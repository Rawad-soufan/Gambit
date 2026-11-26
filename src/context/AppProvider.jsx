import { createContext, useContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { demoCredentials } from "../constants/theme";
import { makeSeedEntries } from "../data/seed";
import { createLiftRepository } from "../lib/repository";
import { liftSchema } from "../lib/validation";

const repository = createLiftRepository(AsyncStorage);
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [signedIn, setSignedIn] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  // Refs update immediately, so a second tap cannot start another save.
  const busy = useRef(false);
  const ready = useRef(false);
  const savedEntries = useRef([]);

  async function retryLoad() {
    if (busy.current) return;

    busy.current = true;
    ready.current = false;
    setLoading(true);
    setLoadError(null);

    try {
      const loadedEntries = await repository.load(makeSeedEntries);
      savedEntries.current = loadedEntries;
      setEntries(loadedEntries);
      ready.current = true;
    } catch {
      setLoadError(
        "Your lift log could not be loaded. Your stored data has not been replaced. Check available storage and try again.",
      );
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    retryLoad();
  }, []);

  async function saveEntries(updatedEntries) {
    if (!ready.current) {
      throw new Error("Wait for your lift log to load before making changes.");
    }
    if (busy.current) {
      throw new Error(
        "A change is still being saved. Please try again in a moment.",
      );
    }

    busy.current = true;
    setSaving(true);

    try {
      // Wait for storage before updating the screens or showing success.
      await repository.save(updatedEntries);
      savedEntries.current = updatedEntries;
      setEntries(updatedEntries);
    } catch {
      throw new Error(
        "The change could not be saved. Your lift log is unchanged. Check available storage and try again.",
      );
    } finally {
      busy.current = false;
      setSaving(false);
    }
  }

  async function saveLift(input, id) {
    const validInput = liftSchema.parse(input);
    const currentEntries = savedEntries.current;
    const now = new Date().toISOString();
    let updatedEntries;
    let entryId = id;

    if (id) {
      const existingEntry = currentEntries.find((entry) => entry.id === id);
      if (!existingEntry) {
        throw new Error("This lift no longer exists.");
      }
      const updatedEntry = { ...existingEntry, ...validInput, updatedAt: now };

      // Like the class example, map builds a new array. Here it replaces one lift.
      updatedEntries = currentEntries.map((entry) => {
        if (entry.id === id) return updatedEntry;
        return entry;
      });
    } else {
      entryId =
        "lift-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      const newEntry = {
        ...validInput,
        id: entryId,
        createdAt: now,
        updatedAt: now,
      };
      updatedEntries = [...currentEntries, newEntry];
    }

    await saveEntries(updatedEntries);
    if (id) setNotice("Lift updated.");
    else setNotice("Lift saved.");
    return entryId;
  }

  async function deleteLift(id) {
    const currentEntries = savedEntries.current;
    const existingEntry = currentEntries.find((entry) => entry.id === id);
    if (!existingEntry) {
      throw new Error("This lift no longer exists.");
    }

    // The same filter pattern used to delete tasks in MyTasks.
    const remainingEntries = currentEntries.filter((entry) => entry.id !== id);
    await saveEntries(remainingEntries);
    setNotice("Lift deleted. Your summaries have been updated.");
  }

  function login(email, password) {
    const emailMatches = email.trim().toLowerCase() === demoCredentials.email;
    const passwordMatches = password === demoCredentials.password;
    if (emailMatches && passwordMatches) {
      setSignedIn(true);
      setNotice("Signed in. Welcome to Gambit.");
      return true;
    }
    return false;
  }

  function logout() {
    setSignedIn(false);
    setNotice(null);
  }

  function dismissNotice() {
    setNotice(null);
  }

  return (
    <AppContext.Provider
      value={{
        signedIn,
        login,
        logout,
        entries,
        loading,
        saving,
        loadError,
        retryLoad,
        saveLift,
        deleteLift,
        notice,
        dismissNotice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const app = useContext(AppContext);
  if (!app) throw new Error("useApp must be inside AppProvider.");
  return app;
}

import { storedCollectionSchema } from "./validation";
export const STORAGE_KEY = "gambit:liftEntries:v1";
export function createLiftRepository(storage) {
  return {
    async load(seed) {
      const raw = await storage.getItem(STORAGE_KEY);
      // Only null means first launch. A persisted [] is deliberately empty.
      if (raw === null) {
        const entries = storedCollectionSchema.parse(seed());
        await storage.setItem(STORAGE_KEY, JSON.stringify(entries));
        return entries;
      }
      return storedCollectionSchema.parse(JSON.parse(raw));
    },
    async save(entries) {
      const validated = storedCollectionSchema.parse(entries);
      await storage.setItem(STORAGE_KEY, JSON.stringify(validated));
    },
  };
}

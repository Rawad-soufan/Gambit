import AppButton from "../components/AppButton";
import { useState } from "react";
import { router } from "expo-router";
import { Text } from "react-native";
import { ExerciseFilter } from "../components/ExerciseFilter";
import { LiftCard } from "../components/LiftCard";
import { DataGate,
  EmptyState,
  Field,
  PageHeader,
  Screen,
  styles,
} from "../components/ui";
import { useApp } from "../context/AppProvider";
import { searchEntries } from "../lib/calculations";
import MainLinks from "../components/MainLinks";
export default function LogScreen() {
  const { entries } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const matching = searchEntries(entries, query, filter);
  return (
    <Screen>
      <PageHeader
        eyebrow="Gambit / Session history"
        title="Lift log."
        subtitle="Every performance has a place here."
      />
      <MainLinks current="log" />
      <DataGate>
        <AppButton text="+ Add lift" onPress={() => router.push("/form")} />
        <Field
          label="Search lifts"
          value={query}
          onChangeText={setQuery}
          placeholder="Search exercise or notes"
          autoCorrect={false}
          returnKeyType="search"
        />
        <ExerciseFilter value={filter} onChange={setFilter} includeAll />
        {entries.length === 0 ? (
          <EmptyState
            title="No lifts logged yet."
            description="Your first rep starts here. Log a lift to begin your history."
            action="Add your first lift"
            onAction={() => router.push("/form")}
          />
        ) : matching.length === 0 ? (
          <EmptyState
            title="No matching lifts found."
            description="Try a different exercise or search term."
            action="Clear search and filters"
            onAction={() => {
              setQuery("");
              setFilter("all");
            }}
          />
        ) : (
          <>
            <Text style={styles.label}>
              {matching.length} {matching.length === 1 ? "entry" : "entries"} ·
              newest first
            </Text>
            {matching.map((entry) => (
              <LiftCard
                key={entry.id}
                entry={entry}
                onPress={() =>
                  router.push({
                    pathname: "/details",
                    params: { id: entry.id },
                  })
                }
              />
            ))}
          </>
        )}
      </DataGate>
    </Screen>
  );
}

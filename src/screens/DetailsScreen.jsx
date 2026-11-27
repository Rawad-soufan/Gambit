import AppButton from "../components/AppButton";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { Card,
  DataGate,
  EmptyState,
  Metric,
  PageHeader,
  Screen,
  styles,
} from "../components/ui";
import { exerciseLabels } from "../constants/theme";
import { useApp } from "../context/AppProvider";
import {
  displayDate,
  estimatedMax,
  formatKg,
  volume,
} from "../lib/calculations";
export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const { entries, deleteLift, saving } = useApp();
  const entry = entries.find((item) => item.id === id);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState(null);
  async function remove() {
    if (!entry) return;
    setError(null);
    try {
      await deleteLift(entry.id);
      setConfirm(false);
      router.dismissTo("/log");
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "The lift could not be deleted. Please try again.",
      );
    }
  }
  return (
    <Screen>
      <AppButton
        text="← Back"
        variant="secondary"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/log")
        }
      />
      <DataGate>
        {entry ? (
          <>
            <PageHeader
              eyebrow="Gambit / Lift details"
              title={exerciseLabels[entry.exercise]}
              subtitle={displayDate(entry.date)}
            />
            <Card>
              <Metric
                label="Working weight"
                value={formatKg(entry.weightKg)}
                unit="kg"
              />
              <View style={styles.row}>
                <Metric label="Sets" value={String(entry.sets)} />
                <Metric label="Reps" value={String(entry.reps)} />
              </View>
            </Card>
            <Card>
              <Metric
                label="Estimated 1RM"
                value={formatKg(estimatedMax(entry))}
                unit="kg"
              />
              <Metric
                label="Session volume"
                value={formatKg(volume(entry))}
                unit="kg"
              />
            </Card>
            <Card>
              <Text style={styles.label}>Training notes</Text>
              <Text style={styles.body}>
                {entry.notes || "No notes added for this lift."}
              </Text>
            </Card>
            <AppButton
              text="Edit lift"
              disabled={saving}
              onPress={() =>
                router.push({ pathname: "/form", params: { id: entry.id } })
              }
            />
            <AppButton
              text="Delete lift"
              variant="danger"
              disabled={saving}
              onPress={() => {
                setError(null);
                setConfirm(true);
              }}
            />
            <ConfirmationDialog
              visible={confirm}
              busy={saving}
              error={error}
              onCancel={() => setConfirm(false)}
              onConfirm={() => {
                void remove();
              }}
            />
          </>
        ) : (
          <EmptyState
            title="Lift not found."
            description="This entry may have been deleted. Return to your log to choose another lift."
            action="Open lift log"
            onAction={() => router.replace("/log")}
          />
        )}
      </DataGate>
    </Screen>
  );
}

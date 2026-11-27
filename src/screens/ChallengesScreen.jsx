import { router } from "expo-router";
import { Text } from "react-native";
import AppButton from "../components/AppButton";
import { Card, DataGate, PageHeader, Screen, styles } from "../components/ui";
import { exerciseLabels } from "../constants/theme";
import { useApp } from "../context/AppProvider";
import { estimatedMax, formatKg } from "../lib/calculations";

const demoChallenges = [
  { exercise: "squat", friend: "Maya", target: 130 },
  { exercise: "bench", friend: "Karim", target: 90 },
  { exercise: "deadlift", friend: "Nour", target: 170 },
];

export default function ChallengesScreen() {
  const { entries } = useApp();

  return (
    <Screen>
      <PageHeader
        title="Friend challenges"
        subtitle="Compare your best estimated one-rep max from your lift log with demo friends."
      />
      <AppButton
        text="Back to dashboard"
        variant="secondary"
        onPress={() => router.dismissTo("/dashboard")}
      />
      <DataGate>
        {demoChallenges.map(({ exercise, friend, target }) => {
          const best = entries
            .filter((entry) => entry.exercise === exercise)
            .reduce(
              (highest, entry) => Math.max(highest, estimatedMax(entry)),
              0,
            );
          const score = Number(best.toFixed(1));
          const result =
            score > target
              ? "You lead"
              : score === target
                ? "Tied"
                : `${friend} leads`;

          return (
            <Card key={exercise}>
              <Text style={styles.heading}>
                {exerciseLabels[exercise]} vs. {friend}
              </Text>
              <Text style={styles.body}>
                {friend} (demo) · {formatKg(target)} kg
              </Text>
              <Text style={styles.body}>
                {best > 0
                  ? `Your best · ${formatKg(score)} kg`
                  : "Log this lift to see your score."}
              </Text>
              {best > 0 && <Text style={styles.heading}>{result}</Text>}
            </Card>
          );
        })}
      </DataGate>
    </Screen>
  );
}

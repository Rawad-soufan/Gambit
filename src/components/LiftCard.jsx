import { Pressable, Text, View } from "react-native";
import { colors, exerciseLabels } from "../constants/theme";
import { displayDate, estimatedMax, formatKg } from "../lib/calculations";
import { styles } from "./ui";
export function LiftCard({ entry, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${exerciseLabels[entry.exercise]}, ${entry.weightKg} kilograms, ${entry.date}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.75 : 1 }]}
    >
      <View style={styles.between}>
        <Text style={styles.heading}>{exerciseLabels[entry.exercise]}</Text>
        <Text style={{ color: colors.accent, fontSize: 22 }}>↗</Text>
      </View>
      <Text style={{ color: colors.muted, fontSize: 13 }}>
        {displayDate(entry.date)}
      </Text>
      <View style={styles.between}>
        <Text style={[styles.number, { fontSize: 27 }]}>
          {formatKg(entry.weightKg)}
          <Text style={{ fontSize: 14, color: colors.muted }}> kg</Text>
        </Text>
        <Text style={{ color: colors.text, fontSize: 15 }}>
          {entry.sets} sets × {entry.reps} reps
        </Text>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 12,
        }}
      >
        <Text style={{ color: colors.muted, fontSize: 13 }}>
          Estimated 1RM{" "}
          <Text style={{ color: colors.accent, fontWeight: "700" }}>
            {formatKg(estimatedMax(entry))} kg
          </Text>
        </Text>
      </View>
    </Pressable>
  );
}

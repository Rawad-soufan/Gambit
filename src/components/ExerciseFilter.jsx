import { Pressable, Text, View } from "react-native";
import { colors, exerciseLabels, exercises } from "../constants/theme";
export function ExerciseFilter({ value, onChange, includeAll = false }) {
  const options = includeAll ? ["all", ...exercises] : [...exercises];
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {options.map((exercise) => (
        <Pressable
          key={exercise}
          accessibilityRole="button"
          accessibilityState={{ selected: value === exercise }}
          onPress={() => onChange(exercise)}
          style={({ pressed }) => ({
            minHeight: 46,
            justifyContent: "center",
            paddingHorizontal: 16,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: value === exercise ? colors.accent : colors.border,
            backgroundColor:
              value === exercise ? colors.accent : colors.surface,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text
            style={{
              color: value === exercise ? colors.background : colors.muted,
              fontSize: 13,
              fontWeight: "700",
            }}
          >
            {exercise === "all" ? "All lifts" : exerciseLabels[exercise]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

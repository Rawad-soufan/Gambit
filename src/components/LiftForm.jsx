import AppButton from "./AppButton";
import { useState } from "react";
import { Text, View } from "react-native";
import { ExerciseFilter } from "./ExerciseFilter";
import { Field, styles } from "./ui";
import { todayLocal } from "../lib/calculations";
import { fieldErrors, liftSchema } from "../lib/validation";
export function LiftForm({ entry, busy, onSave, onCancel }) {
  const [form, setForm] = useState({
    exercise: entry?.exercise ?? "squat",
    weightKg: entry ? String(entry.weightKg) : "",
    sets: entry ? String(entry.sets) : "",
    reps: entry ? String(entry.reps) : "",
    date: entry?.date ?? todayLocal(),
    notes: entry?.notes ?? "",
  });
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setSaveError("");
  }
  async function submit() {
    if (busy) return;
    const result = liftSchema.safeParse(form);
    if (!result.success) {
      setErrors(fieldErrors(result.error));
      setSaveError("Check the highlighted fields before saving.");
      return;
    }
    setErrors({});
    setSaveError("");
    try {
      await onSave(result.data);
    } catch (failure) {
      setSaveError(
        failure instanceof Error
          ? failure.message
          : "Your lift could not be saved. Please try again.",
      );
    }
  }
  return (
    <View style={{ gap: 22 }}>
      <View style={{ gap: 10 }}>
        <Text style={{ color: "#F5F7FA", fontSize: 14, fontWeight: "600" }}>
          Exercise
        </Text>
        <ExerciseFilter
          value={form.exercise}
          onChange={(value) => {
            if (value !== "all") update("exercise", value);
          }}
        />
        {errors.exercise && <Text style={styles.error}>{errors.exercise}</Text>}
      </View>
      <Field
        label="Weight (kg)"
        value={form.weightKg}
        onChangeText={(value) => update("weightKg", value)}
        error={errors.weightKg}
        keyboardType="decimal-pad"
        placeholder="e.g. 82.5"
        helper="Greater than 0, up to 500 kg."
        editable={!busy}
      />
      <View style={{ flexDirection: "row", gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Field
            label="Sets"
            value={form.sets}
            onChangeText={(value) => update("sets", value)}
            error={errors.sets}
            keyboardType="number-pad"
            placeholder="e.g. 3"
            helper="1–10 sets"
            editable={!busy}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Field
            label="Reps per set"
            value={form.reps}
            onChangeText={(value) => update("reps", value)}
            error={errors.reps}
            keyboardType="number-pad"
            placeholder="e.g. 5"
            helper="1–10 reps"
            editable={!busy}
          />
        </View>
      </View>
      <Field
        label="Date (YYYY-MM-DD)"
        value={form.date}
        onChangeText={(value) => update("date", value)}
        error={errors.date}
        placeholder="YYYY-MM-DD"
        autoCorrect={false}
        autoCapitalize="none"
        helper="Today or an earlier date."
        editable={!busy}
      />
      <Field
        label="Notes (optional)"
        value={form.notes}
        onChangeText={(value) => update("notes", value)}
        error={errors.notes}
        multiline
        placeholder="How did the lift feel?"
        helper={`${form.notes.length}/300 characters`}
        editable={!busy}
      />
      {!!saveError && (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {saveError}
        </Text>
      )}
      <AppButton
        text={busy ? "Saving lift…" : entry ? "Save changes" : "Save lift"}
        busy={busy}
        onPress={() => {
          void submit();
        }}
      />
      <AppButton
        text="Cancel"
        variant="secondary"
        disabled={busy}
        onPress={onCancel}
      />
    </View>
  );
}

// Adapted from AppTextInput in MyTasks: a controlled input using props.
import { StyleSheet, TextInput } from "react-native";
import { colors } from "../constants/theme";

export default function AppTextInput(props) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.muted}
      selectionColor={colors.accent}
      style={[styles.input, props.style]}
    />
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 17,
    color: colors.text,
    minHeight: 52,
  },
});

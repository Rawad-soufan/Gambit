// Adapted from the AppButton component in the class MyTasks project.
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../constants/theme";

export default function AppButton(props) {
  const disabled = props.disabled || props.busy;
  let buttonStyle = styles.button;
  let textStyle = styles.buttonText;
  if (props.variant === "secondary") {
    buttonStyle = styles.secondaryButton;
    textStyle = styles.secondaryText;
  }
  if (props.variant === "danger") {
    buttonStyle = styles.dangerButton;
    textStyle = styles.dangerText;
  }
  return (
    <Pressable
      onPress={props.onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled, busy: !!props.busy }}
      style={[
        styles.base,
        buttonStyle,
        disabled && styles.disabled,
        props.style,
      ]}
    >
      {props.busy && <ActivityIndicator color={colors.text} size="small" />}
      <Text style={[styles.buttonText, textStyle]}>{props.text}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    flexDirection: "row",
    gap: 10,
  },
  button: { backgroundColor: colors.accent },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: "600" },
  secondaryButton: { backgroundColor: colors.raised },
  secondaryText: { color: colors.text },
  dangerButton: { backgroundColor: colors.dangerSurface },
  dangerText: { color: colors.error },
  disabled: { opacity: 0.55 },
});

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppButton from "./AppButton";
import AppScreen from "./AppScreen";
import AppTextInput from "./AppTextInput";
import { colors } from "../constants/theme";
import { useApp } from "../context/AppProvider";
export const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 30, fontWeight: "700" },
  heading: { color: colors.text, fontSize: 21, fontWeight: "600" },
  body: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  label: { color: colors.muted, fontSize: 13, fontWeight: "600" },
  number: { color: colors.text, fontSize: 28, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: colors.surface,
    gap: 12,
  },
  error: { color: colors.error, fontSize: 14, lineHeight: 21 },
});
export function Screen({ children }) {
  const { notice, dismissNotice } = useApp();
  return (
    <AppScreen>
      {notice && (
        <View accessibilityLiveRegion="polite" style={styles.card}>
          <Text style={{ color: colors.accent, fontSize: 14, lineHeight: 21 }}>
            {notice}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={dismissNotice}
            style={{ minHeight: 44, justifyContent: "center" }}
          >
            <Text style={{ color: colors.text }}>Dismiss message</Text>
          </Pressable>
        </View>
      )}
      {children}
    </AppScreen>
  );
}
export function PageHeader({ title, subtitle, action }) {
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.between}>
        <Text accessibilityRole="header" style={[styles.title, { flex: 1 }]}>
          {title}
        </Text>
        {action}
      </View>
      {subtitle && <Text style={styles.body}>{subtitle}</Text>}
    </View>
  );
}
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}
export function Field({ label, error, helper, ...input }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.text, fontWeight: "600", fontSize: 15 }}>
        {label}
      </Text>
      <AppTextInput
        {...input}
        accessibilityLabel={label}
        style={[
          error && { borderColor: colors.error },
          input.multiline && { minHeight: 110, textAlignVertical: "top" },
          input.style,
        ]}
      />
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : helper ? (
        <Text style={{ color: colors.muted, fontSize: 12 }}>{helper}</Text>
      ) : null}
    </View>
  );
}
export function EmptyState({ title, description, action, onAction }) {
  return (
    <Card>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.body}>{description}</Text>
      {action && onAction && <AppButton text={action} onPress={onAction} />}
    </Card>
  );
}
export function DataGate({ children }) {
  const { loading, loadError, retryLoad } = useApp();
  if (loading)
    return (
      <Card>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.body}>Loading your saved lift log…</Text>
      </Card>
    );
  if (loadError)
    return (
      <Card>
        <Text style={styles.heading}>Couldn’t open your log</Text>
        <Text style={styles.error}>{loadError}</Text>
        <AppButton text="Try loading again" onPress={retryLoad} />
      </Card>
    );
  return children;
}
export function Metric({ label, value, unit }) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.number}>
        {value}
        <Text style={{ fontSize: 14, color: colors.muted }}> {unit}</Text>
      </Text>
    </View>
  );
}

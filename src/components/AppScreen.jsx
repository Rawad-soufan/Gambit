// Adapted from the scrollable AppScreen component used in class.
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/theme";

export default function AppScreen(props) {
  const contentStyle = [styles.content, props.contentStyle];
  if (props.centered === true) contentStyle.push(styles.centered);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inner}>{props.children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  inner: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    gap: 20,
    flexGrow: 1,
  },
  centered: { justifyContent: "center" },
});

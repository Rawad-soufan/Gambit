import { router } from "expo-router";
import { Text, View } from "react-native";
import AppButton from "../components/AppButton";
import { Screen, styles } from "../components/ui";
import { colors } from "../constants/theme";

export default function WelcomeScreen() {
  function openLogin() {
    router.replace("/login");
  }
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", gap: 20 }}>
        <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 20 }}>
          GAMBIT
        </Text>
        <Text accessibilityRole="header" style={styles.title}>
          Your next lift starts here.
        </Text>
        <Text style={styles.body}>
          Keep track of your squat, bench press, and deadlift in one simple
          training log.
        </Text>
        <AppButton text="Get started" onPress={openLogin} />
      </View>
    </Screen>
  );
}

import { router } from "expo-router";
import { View } from "react-native";
import AppButton from "./AppButton";

export default function MainLinks({ current }) {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ flex: 1 }}>
        <AppButton
          text="Dashboard"
          variant={current === "dashboard" ? "primary" : "secondary"}
          onPress={() => router.replace("/dashboard")}
        />
      </View>
      <View style={{ flex: 1 }}>
        <AppButton
          text="Lift log"
          variant={current === "log" ? "primary" : "secondary"}
          onPress={() => router.replace("/log")}
        />
      </View>
    </View>
  );
}

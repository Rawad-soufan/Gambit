import AppButton from "../components/AppButton";
import { useState } from "react";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { Card,
  Field,
  PageHeader,
  Screen,
  styles,
} from "../components/ui";
import { colors, demoCredentials } from "../constants/theme";
import { useApp } from "../context/AppProvider";
import { fieldErrors, loginSchema } from "../lib/validation";
export default function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  function submit() {
    setAuthError("");
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(fieldErrors(result.error));
      return;
    }
    setErrors({});
    if (!login(result.data.email, result.data.password)) {
      setAuthError(
        "Incorrect email or password. Use the demo credentials below.",
      );
      return;
    }
    router.replace("/dashboard");
  }
  return (
    <Screen>
      <AppButton
        text="← Welcome"
        variant="secondary"
        onPress={() => router.replace("/")}
      />
      <View style={{ paddingTop: 20 }}>
        <PageHeader
          eyebrow="Gambit / Athlete access"
          title="Welcome back."
          subtitle="Your next session starts here."
        />
      </View>
      <View style={{ gap: 20 }}>
        <Field
          label="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setAuthError("");
          }}
          error={errors.email}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
        <Field
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setAuthError("");
          }}
          error={errors.password}
          placeholder="Enter your password"
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          onSubmitEditing={submit}
          returnKeyType="go"
        />
        <AppButton
          text={visible ? "Hide password" : "Show password"}
          variant="secondary"
          onPress={() => setVisible(!visible)}
        />
        {!!authError && (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {authError}
          </Text>
        )}
        <AppButton text="Log in →" onPress={submit} />
      </View>
      <Card>
        <Text style={[styles.label, { color: colors.accent }]}>
          Try the demo
        </Text>
        <Text selectable style={styles.body}>
          Email: {demoCredentials.email}
          {"\n"}Password: {demoCredentials.password}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19 }}>
          Use these mock credentials. Your lift log is stored on this device.
        </Text>
      </Card>
    </Screen>
  );
}

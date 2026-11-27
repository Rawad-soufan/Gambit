import { router } from "expo-router";
import { Text, View } from "react-native";
import AppButton from "../components/AppButton";
import MainLinks from "../components/MainLinks";
import {
  Card,
  DataGate,
  EmptyState,
  Metric,
  PageHeader,
  Screen,
  styles,
} from "../components/ui";
import { LiftCard } from "../components/LiftCard";
import { useApp } from "../context/AppProvider";
import { formatKg, newestFirst, volume } from "../lib/calculations";

export default function DashboardScreen() {
  const { entries, logout } = useApp();
  const totalVolume = entries.reduce(
    (total, entry) => total + volume(entry),
    0,
  );
  const recentEntries = newestFirst(entries).slice(0, 3);
  function openLift(entry) {
    router.push({ pathname: "/details", params: { id: entry.id } });
  }
  function handleLogout() {
    logout();
    router.replace("/login");
  }
  return (
    <Screen>
      <PageHeader title="Gambit" subtitle="Your powerlifting journal." />
      <MainLinks current="dashboard" />
      <DataGate>
        <Card>
          <Text style={styles.heading}>Your training</Text>
          <View style={styles.row}>
            <Metric label="Logged lifts" value={String(entries.length)} />
            <Metric
              label="Total volume"
              value={formatKg(totalVolume)}
              unit="kg"
            />
          </View>
        </Card>
        <AppButton text="Add lift" onPress={() => router.push("/form")} />
        <AppButton
          text="Friend challenges"
          variant="secondary"
          onPress={() => router.push("/challenges")}
        />
        <Text style={styles.heading}>Recent lifts</Text>
        {entries.length === 0 ? (
          <EmptyState
            title="No lifts logged yet."
            description="Add your first lift to start your training history."
            action="Add your first lift"
            onAction={() => router.push("/form")}
          />
        ) : (
          recentEntries.map((entry) => (
            <LiftCard
              key={entry.id}
              entry={entry}
              onPress={() => openLift(entry)}
            />
          ))
        )}
      </DataGate>
      <AppButton text="Log out" variant="secondary" onPress={handleLogout} />
    </Screen>
  );
}

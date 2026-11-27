import { router, useLocalSearchParams } from "expo-router";
import { LiftForm } from "../components/LiftForm";
import { DataGate, EmptyState, PageHeader, Screen } from "../components/ui";
import { useApp } from "../context/AppProvider";
export default function LiftFormScreen() {
  const { id } = useLocalSearchParams();
  const { entries, saveLift, saving } = useApp();
  const entry = entries.find((item) => item.id === id);
  function cancel() {
    if (router.canGoBack()) router.back();
    else router.replace("/log");
  }
  async function handleSave(input) {
    await saveLift(input, id);
    if (id) {
      if (router.canGoBack()) router.back();
      else router.replace({ pathname: "/details", params: { id } });
    } else {
      router.dismissTo("/log");
    }
  }
  return (
    <Screen>
      <PageHeader
        eyebrow="Gambit / Record a performance"
        title={id ? "Edit your lift." : "Log your lift."}
        subtitle="One exercise, one weight, one step forward."
      />
      <DataGate>
        {id && !entry ? (
          <EmptyState
            title="Lift not found."
            description="This entry is no longer available to edit."
            action="Return to lift log"
            onAction={() => router.replace("/log")}
          />
        ) : (
          <LiftForm
            key={entry?.id ?? "new"}
            entry={entry}
            busy={saving}
            onCancel={cancel}
            onSave={handleSave}
          />
        )}
      </DataGate>
    </Screen>
  );
}

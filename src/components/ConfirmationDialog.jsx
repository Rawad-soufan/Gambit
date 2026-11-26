import AppButton from "./AppButton";
import { Modal, Text, View } from "react-native";
import { styles } from "./ui";
export function ConfirmationDialog({
  visible,
  busy,
  error,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!busy) onCancel();
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#000B",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          accessibilityViewIsModal
          style={[
            styles.card,
            { width: "100%", maxWidth: 450, alignSelf: "center", gap: 20 },
          ]}
        >
          <Text accessibilityRole="header" style={styles.heading}>
            Delete this lift?
          </Text>
          <Text style={styles.body}>
            This action cannot be undone. The lift will be removed from your
            log.
          </Text>
          {error && (
            <Text accessibilityLiveRegion="polite" style={styles.error}>
              {error}
            </Text>
          )}
          <AppButton
            text={busy ? "Deleting…" : "Delete lift"}
            busy={busy}
            onPress={onConfirm}
            variant="danger"
          />
          <AppButton
            text="Cancel"
            disabled={busy}
            onPress={onCancel}
            variant="secondary"
          />
        </View>
      </View>
    </Modal>
  );
}

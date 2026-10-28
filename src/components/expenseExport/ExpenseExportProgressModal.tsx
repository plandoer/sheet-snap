import { GLOBAL_STYLES } from "@/constants/global-styles";
import { Modal, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  currentNumber: number;
  total: number;
  text: string;
}

export default function ExpenseExportProgressModal({
  visible,
  currentNumber,
  total,
  text,
}: Props) {
  const progress = total === 0 ? 0 : currentNumber / total;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Title and subtitle */}
          <Text style={styles.title}>Exporting</Text>
          <Text style={styles.subtitle}>Please don&apos;t close the app.</Text>

          {/* Progress bar */}
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          </View>

          {/* Status message */}
          <Text style={styles.status}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.overlay,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: GLOBAL_STYLES.colors.white,
    borderRadius: 12,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: GLOBAL_STYLES.colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    color: GLOBAL_STYLES.colors.textSecondary,
  },
  track: {
    height: 10,
    borderRadius: 5,
    marginTop: 24,
    overflow: "hidden",
    backgroundColor: GLOBAL_STYLES.colors.neutralBackground,
  },
  fill: {
    height: "100%",
    backgroundColor: GLOBAL_STYLES.colors.primary,
  },
  status: {
    fontSize: 16,
    marginTop: 20,
    color: GLOBAL_STYLES.colors.textDark,
  },
});

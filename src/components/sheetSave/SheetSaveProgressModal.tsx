import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useSheetContext } from "@/context/SheetContext";
import { Modal, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  totalSheets: number;
  currentSheetIndex: number;
}

export default function SheetSaveProgressModal({
  visible,
  totalSheets,
  currentSheetIndex,
}: Props) {
  const { selectedSheet } = useSheetContext();
  const currentNumber = currentSheetIndex + 1;
  const progress = totalSheets === 0 ? 0 : currentNumber / totalSheets;

  const sheetTitle = `${selectedSheet?.spreadsheet.name} - ${selectedSheet?.sheet.properties.title}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Saving Expenses</Text>
          <Text style={styles.subtitle}>Please don&apos;t close the app.</Text>

          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress * 100}%` }]} />
          </View>

          <Text style={styles.status}>
            Saving expense {currentNumber} of {totalSheets} to &quot;
            {sheetTitle}&quot;
          </Text>
          <Text style={styles.remaining}>
            {totalSheets - currentNumber} left
          </Text>
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
  remaining: {
    fontSize: 14,
    marginTop: 6,
    color: GLOBAL_STYLES.colors.textSecondary,
  },
});

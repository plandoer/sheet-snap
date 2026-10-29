import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useSheetContext } from "@/context/SheetContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
}

export default function SheetSelectbox({ onPress }: Props) {
  const { selectedSheet } = useSheetContext();

  const spreadsheetName = selectedSheet?.spreadsheet?.name;
  const sheetName = selectedSheet?.sheet?.properties?.title;
  const sheetTitle = selectedSheet
    ? `${spreadsheetName} - ${sheetName}`
    : "Select a Google Sheet";

  return (
    <TouchableOpacity
      style={styles.sheetSelector}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.headerTitle}>{sheetTitle}</Text>
      <MaterialCommunityIcons
        name="chevron-down"
        size={20}
        color={GLOBAL_STYLES.colors.textMedium}
        style={styles.chevronIcon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sheetSelector: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textPrimary,
    marginRight: 4,
  },
  chevronIcon: {
    marginTop: 2,
  },
});

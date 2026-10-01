import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useSheetContext } from "@/context/SheetContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import SheetPickerModal from "./SheetPickerModal";

export default function SheetPicker() {
  const { selectedSheet } = useSheetContext();
  const [showSheetPicker, setShowSheetPicker] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.sheetSelector}
        onPress={() => setShowSheetPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.headerTitle}>
          {selectedSheet?.spreadsheet?.name
            ? `Sync to ${selectedSheet.spreadsheet.name} - ${selectedSheet.sheet.properties.title}`
            : "Select a Google Sheet"}
        </Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={20}
          color={GLOBAL_STYLES.colors.textMedium}
          style={styles.chevronIcon}
        />
      </TouchableOpacity>

      {/* Sheet Picker Modal */}
      <SheetPickerModal
        visible={showSheetPicker}
        onClose={() => setShowSheetPicker(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sheetSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textDark,
    marginRight: 4,
  },
  chevronIcon: {
    marginTop: 2,
  },
});

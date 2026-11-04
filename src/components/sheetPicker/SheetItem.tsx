import { GLOBAL_STYLES } from "@/constants/global-styles";
import { GoogleSheet } from "@/models/googleSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  sheet: GoogleSheet;
  onClick: (sheet: GoogleSheet) => void;
}

export default function SheetItem({ sheet, onClick }: Props) {
  return (
    <TouchableOpacity
      style={styles.sheetItem}
      onPress={() => onClick(sheet)}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name="table"
        size={24}
        color={GLOBAL_STYLES.colors.googleBlue}
        style={styles.sheetIcon}
      />
      <View style={styles.sheetInfo}>
        <Text style={styles.sheetName} numberOfLines={1}>
          {sheet.properties.title}
        </Text>
        <Text style={styles.sheetDate}>Sheet {sheet.properties.index + 1}</Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={GLOBAL_STYLES.colors.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GLOBAL_STYLES.colors.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GLOBAL_STYLES.colors.borderColor,
  },
  sheetIcon: {
    marginRight: 12,
  },
  sheetInfo: {
    flex: 1,
  },
  sheetName: {
    fontSize: 16,
    fontWeight: "500",
    color: GLOBAL_STYLES.colors.textDark,
    marginBottom: 4,
  },
  sheetDate: {
    fontSize: 12,
    color: GLOBAL_STYLES.colors.textMuted,
  },
});

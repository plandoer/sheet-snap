import { GLOBAL_STYLES } from "@/constants/global-styles";
import { GoogleSpreadsheet } from "@/models/googleSpreadSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  spreadsheet: GoogleSpreadsheet;
  onClick: (spreadsheet: GoogleSpreadsheet) => void;
}

export default function SpreadSheetItem({ spreadsheet, onClick }: Props) {
  return (
    <TouchableOpacity
      style={styles.sheetItem}
      onPress={() => onClick(spreadsheet)}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name="google-spreadsheet"
        size={24}
        color={GLOBAL_STYLES.colors.primary}
        style={styles.sheetIcon}
      />
      <View style={styles.sheetInfo}>
        <Text style={styles.sheetName} numberOfLines={1}>
          {spreadsheet.name}
        </Text>
        <Text style={styles.sheetDate}>
          Modified: {new Date(spreadsheet.modifiedTime).toLocaleDateString()}
        </Text>
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

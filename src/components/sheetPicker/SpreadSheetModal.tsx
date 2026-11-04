import { GLOBAL_STYLES } from "@/constants/global-styles";
import { GoogleSpreadsheet } from "@/models/googleSpreadSheet";
import { Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../IconButton";
import SpreadSheetItems from "./SpreadSheetItems";

interface Props {
  visible: boolean;
  isLoading: boolean;
  spreadsheets: GoogleSpreadsheet[];
  onClose: () => void;
  onClick: (spreadsheet: GoogleSpreadsheet) => void;
}

export default function SpreadSheetModal({
  visible,
  isLoading,
  spreadsheets,
  onClose,
  onClick,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* Title */}
          <Text style={styles.headerTitle}>Select a Google Sheet</Text>

          {/* Close button */}
          <IconButton name="close" color="black" onPress={onClose} />
        </View>

        <SpreadSheetItems
          spreadsheets={spreadsheets}
          isLoading={isLoading}
          onClick={onClick}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: GLOBAL_STYLES.colors.textDark,
  },
});

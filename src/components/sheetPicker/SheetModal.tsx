import { GLOBAL_STYLES } from "@/constants/global-styles";
import { GoogleSheet } from "@/models/googleSheet";
import { Modal, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../IconButton";
import SheetItems from "./SheetItems";

interface Props {
  visible: boolean;
  isLoading: boolean;
  spreadsheetName: string;
  sheets: GoogleSheet[];
  onClose: () => void;
  onClick: (sheet: GoogleSheet) => void;
}

export default function SheetModal({
  visible,
  isLoading,
  spreadsheetName,
  sheets,
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
          {/* Back button */}
          <IconButton name="arrow-back" color="black" onPress={onClose} />

          {/* Title */}
          <Text style={styles.headerTitle}>
            {`Select Sheet in ${spreadsheetName}`}
          </Text>

          {/* Close button */}
          <IconButton name="close" color="black" onPress={onClose} />
        </View>

        <SheetItems sheets={sheets} isLoading={isLoading} onClick={onClick} />
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

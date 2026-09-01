import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroups } from "@/hooks/useExpenseGroup";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddExpenseGroup from "./AddExpenseGroup";
import ExpenseGroupHeader from "./ExpenseGroupHeader";
import ExpenseGroupItems from "./ExpenseGroupItems";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAdd(): void;
}

export default function ExpenseGroupsModal({ visible, onClose, onAdd }: Props) {
  const { data: expenseGroups, refetch, isFetching } = useExpenseGroups();

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
          <ExpenseGroupHeader onClose={onClose} />
          <ExpenseGroupItems
            expenseGroups={expenseGroups ?? []}
            onRefresh={refetch}
            onClose={onClose}
            refreshing={isFetching}
          />
          <AddExpenseGroup />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: GLOBAL_STYLES.colors.screenBackground,
  },
});

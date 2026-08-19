import { GLOBAL_STYLES } from "@/constants/global-styles";
import { useExpenseGroups } from "@/hooks/useExpenseGroup";
import { Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FAB from "../FAB";
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
      <SafeAreaView style={styles.container}>
        <ExpenseGroupHeader onClose={onClose} />
        <ExpenseGroupItems
          expenseGroups={expenseGroups ?? []}
          onRefresh={refetch}
          refreshing={isFetching}
        />
        <FAB onPress={onAdd} />
      </SafeAreaView>
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

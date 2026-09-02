import { GLOBAL_STYLES } from "@/constants/global-styles";
import { ExpenseGroup } from "@/models/expenseGroup";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ExpenseGroupItem from "./ExpenseGroupItem";

interface Props {
  expenseGroups: ExpenseGroup[];
  onRefresh: () => void;
  refreshing: boolean;
  onClose: () => void;
  onEdit: (expenseGroup: ExpenseGroup) => void;
}

export default function ExpenseGroupItems({
  expenseGroups,
  onRefresh,
  onClose,
  refreshing,
  onEdit,
}: Props) {
  let content = null;

  if (expenseGroups.length === 0 && !refreshing) {
    content = (
      <View style={styles.emptyContainer}>
        <Text style={styles.noExpenseGroupsText}>No expense groups yet.</Text>
      </View>
    );
  } else {
    content = (
      <FlatList
        data={expenseGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseGroupItem
            expenseGroup={item}
            onClose={onClose}
            onEdit={() => onEdit(item)}
          />
        )}
        contentContainerStyle={styles.list}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    );
  }

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  noExpenseGroupsText: {
    color: GLOBAL_STYLES.colors.disableText,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

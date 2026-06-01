import { Expense } from "@/models/expense";
import { FlatList, StyleSheet, View } from "react-native";
import ExpenseItem from "./ExpenseItem";

interface Props {
  expenses: Expense[];
  onRefresh: () => void;
  refreshing: boolean;
}

export default function ExpenseItems({
  expenses,
  onRefresh,
  refreshing,
}: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
});

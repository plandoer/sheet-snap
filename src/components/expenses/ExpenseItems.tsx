import { FlatList, StyleSheet, View } from "react-native";
import ExpenseItem, { Expense } from "./ExpenseItem";

interface Props {
  expenses: Expense[];
}

export default function ExpenseItems({ expenses }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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

import AddExpense from "@/components/expenses/AddExpense";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import { Expense } from "@/components/expenses/ExpenseItem";
import ExpenseItems from "@/components/expenses/ExpenseItems";
import { StyleSheet, View } from "react-native";

export default function ExpenseScreen() {
  const MOCK_EXPENSES: Expense[] = [
    {
      id: "1",
      name: "Water Refill",
      amount: 200,
      currency: "THB",
      paidBy: "Ye Min Ko",
      date: new Date(2026, 0, 5),
      excluded: false,
    },
    {
      id: "2",
      name: "Taxi Fee",
      amount: 200,
      currency: "THB",
      paidBy: "Ye Min Ko",
      date: new Date(2026, 0, 5),
      excluded: true,
    },
    {
      id: "3",
      name: "Grocery Shopping",
      amount: 850,
      currency: "THB",
      paidBy: "Su Su",
      date: new Date(2026, 1, 10),
      excluded: false,
    },
    {
      id: "4",
      name: "Electricity Bill",
      amount: 1200,
      currency: "THB",
      paidBy: "Ye Min Ko",
      date: new Date(2026, 1, 15),
      excluded: false,
    },
    {
      id: "5",
      name: "Coffee",
      amount: 120,
      currency: "THB",
      paidBy: "Su Su",
      date: new Date(2026, 1, 20),
      excluded: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ExpenseHeader />
      <ExpenseItems expenses={MOCK_EXPENSES} />
      <AddExpense />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
  },
});

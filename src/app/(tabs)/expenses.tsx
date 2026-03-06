import AddExpense from "@/components/expenses/AddExpense";
import ExpenseHeader from "@/components/expenses/ExpenseHeader";
import ExpenseItems from "@/components/expenses/ExpenseItems";
import { Expense } from "@/models/expense";
import { StyleSheet, View } from "react-native";

export default function ExpenseScreen() {
  const MOCK_EXPENSES: Expense[] = [
    {
      id: "1",
      reason: "Water Refill",
      amount: 200,
      subAmounts: [],
      note: "",
      category: "",
      currency: "THB",
      paidBy: "Ye Min Ko",
      splitInHalf: false,
      date: new Date(2026, 0, 5),
      excluded: false,
    },
    {
      id: "2",
      reason: "Taxi Fee",
      amount: 200,
      subAmounts: [],
      note: "",
      category: "",
      currency: "THB",
      paidBy: "Ye Min Ko",
      splitInHalf: false,
      date: new Date(2026, 0, 5),
      excluded: true,
    },
    {
      id: "3",
      reason: "Grocery Shopping",
      amount: 850,
      subAmounts: [],
      note: "",
      category: "",
      currency: "THB",
      paidBy: "Su Su",
      splitInHalf: false,
      date: new Date(2026, 1, 10),
      excluded: false,
    },
    {
      id: "4",
      reason: "Electricity Bill",
      amount: 1200,
      subAmounts: [],
      note: "",
      category: "",
      currency: "THB",
      paidBy: "Ye Min Ko",
      splitInHalf: false,
      date: new Date(2026, 1, 15),
      excluded: false,
    },
    {
      id: "5",
      reason: "Coffee",
      amount: 120,
      subAmounts: [],
      note: "",
      category: "",
      currency: "THB",
      paidBy: "Su Su",
      splitInHalf: false,
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

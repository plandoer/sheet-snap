import { Expense } from "@/models/expense";
import { ExpenseSummary } from "@/models/expenseSummary";
import { Payment } from "@/models/payment";
import { Person } from "@/models/person";

export function calculateSummary(
  persons: Person[],
  expenses: Expense[] | undefined,
): ExpenseSummary {
  const totalExpense = calculateTotalExpense(expenses);
  const payments = persons.map((person) =>
    calculateEachPersonPayment(person.name, expenses),
  );
  return { totalExpense, payments };
}

function calculateTotalExpense(expenses: Expense[] | undefined): number {
  if (!expenses || expenses.length === 0) {
    return 0;
  }
  return expenses.reduce((sum, expense) => sum + +expense.amount, 0) ?? 0;
}

function calculateEachPersonPayment(
  personName: string,
  expenses: Expense[] | undefined,
): Payment {
  if (!expenses || expenses.length === 0) {
    return { personName, totalAmount: 0, personExpenses: [] };
  }

  const personExpenses = expenses.filter(
    (expense) => expense.paidBy === personName,
  );
  const totalAmount = personExpenses.reduce(
    (sum, expense) => sum + +expense.amount,
    0,
  );
  return { personName, totalAmount: totalAmount ?? 0, personExpenses };
}

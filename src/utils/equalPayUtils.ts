import { EqualPay } from "@/models/equalPay";
import { Expense } from "@/models/expense";
import { ExpenseSummary } from "@/models/expenseSummary";
import { Person } from "@/models/person";
import { PersonExpenseSummary } from "@/models/personExpenseSummary";
import { Settlement } from "@/models/settlement";

export function calculateSummary(
  persons: Person[],
  expenses: Expense[] | undefined,
): ExpenseSummary {
  const totalExpense = calculateTotalExpense(expenses);
  const personSummaries = persons.map((person) =>
    calculateEachPersonSummary(person.name, expenses),
  );
  return { totalExpense, personSummaries };
}

export function calculateEqualPay(expenseSummary: ExpenseSummary): EqualPay {
  const eachShare =
    expenseSummary.totalExpense / expenseSummary.personSummaries.length;

  const receivers = expenseSummary.personSummaries.filter(
    (personSummary) => personSummary.totalPaid > eachShare,
  );

  const payers = expenseSummary.personSummaries.filter(
    (personSummary) => personSummary.totalPaid < eachShare,
  );

  const settlements: Settlement[] = [];

  for (const payer of payers) {
    let remainingAmountToPay = eachShare - payer.totalPaid;

    for (const receiver of receivers) {
      if (remainingAmountToPay <= 0) {
        break;
      }

      const amountReceiverCanReceive = receiver.totalPaid - eachShare;

      const amountToSettle = Math.min(
        remainingAmountToPay,
        amountReceiverCanReceive,
      );

      if (amountToSettle > 0) {
        settlements.push({
          id: `${payer.name}-${receiver.name}`,
          from: payer.name,
          to: receiver.name,
          amount: amountToSettle,
          expenses: receiver.paidExpenses.map((expense) => ({
            ...expense,
            amount: (
              +expense.amount / expenseSummary.personSummaries.length
            ).toString(), // Split the expense amount equally among all persons
          })),
        });

        remainingAmountToPay -= amountToSettle;
      }
    }
  }

  return { eachShare, settlements };
}

function calculateTotalExpense(expenses: Expense[] | undefined): number {
  if (!expenses || expenses.length === 0) {
    return 0;
  }
  return expenses.reduce((sum, expense) => sum + +expense.amount, 0) ?? 0;
}

function calculateEachPersonSummary(
  personName: string,
  expenses: Expense[] | undefined,
): PersonExpenseSummary {
  if (!expenses || expenses.length === 0) {
    return { name: personName, totalPaid: 0, paidExpenses: [] };
  }

  const personExpenses = expenses.filter(
    (expense) => expense.paidBy === personName,
  );
  const personTotalExpense = personExpenses.reduce(
    (sum, expense) => sum + +expense.amount,
    0,
  );
  return {
    name: personName,
    totalPaid: personTotalExpense ?? 0,
    paidExpenses: personExpenses,
  };
}

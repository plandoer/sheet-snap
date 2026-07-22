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
  const personCount = expenseSummary.personSummaries.length;

  if (personCount === 0) {
    return { eachShare: 0, settlements: [] };
  }

  const eachShare = expenseSummary.totalExpense / personCount;

  const payees = expenseSummary.personSummaries.filter(
    (personSummary) => personSummary.totalPaid > eachShare,
  );

  const payers = expenseSummary.personSummaries.filter(
    (personSummary) => personSummary.totalPaid < eachShare,
  );

  const settlements: Settlement[] = [];

  const remainingReceivable = new Map<string, number>(
    payees.map((payee) => [payee.name, payee.totalPaid - eachShare]),
  );

  for (const payer of payers) {
    let remainingAmountToPay = eachShare - payer.totalPaid;

    for (const payee of payees) {
      if (remainingAmountToPay <= 0) {
        break;
      }

      const amountPayeeCanReceive = remainingReceivable.get(payee.name) ?? 0;

      const amountToSettle = Math.min(
        remainingAmountToPay,
        amountPayeeCanReceive,
      );

      if (amountToSettle > 0) {
        settlements.push({
          id: `${payer.name}-${payee.name}`,
          from: payer.name,
          to: payee.name,
          amount: amountToSettle,
        });

        remainingAmountToPay -= amountToSettle;
        remainingReceivable.set(
          payee.name,
          amountPayeeCanReceive - amountToSettle,
        );
      }
    }
  }

  return { eachShare, settlements };
}

function calculateTotalExpense(expenses: Expense[] | undefined): number {
  if (!expenses || expenses.length === 0) {
    return 0;
  }
  return expenses.reduce((sum, expense) => {
    const amount = Number(expense.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
}

function calculateEachPersonSummary(
  personName: string,
  expenses: Expense[] | undefined,
): PersonExpenseSummary {
  if (!expenses || expenses.length === 0) {
    return { name: personName, totalPaid: 0, paidExpenses: [] };
  }

  const personExpenses = expenses.filter(
    (expense) => expense.paidBy.name === personName,
  );

  const personTotalExpense = personExpenses.reduce((sum, expense) => {
    const amount = Number(expense.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  return {
    name: personName,
    totalPaid: personTotalExpense ?? 0,
    paidExpenses: personExpenses,
  };
}

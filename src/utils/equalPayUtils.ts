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
    calculateEachPersonSummary(person, expenses),
  );
  return { totalExpense, personSummaries };
}

export function calculateEqualPay(
  expenseSummary: ExpenseSummary,
  expenses: Expense[],
): EqualPay {
  const personCount = expenseSummary.personSummaries.length;

  if (personCount === 0 || expenseSummary.totalExpense === 0) {
    return { eachShare: 0, settlements: [] };
  }

  const eachShare = expenseSummary.totalExpense / personCount;

  const personShares = expenseSummary.personSummaries.map((personSummary) => {
    const personShare: string[] = expenses.map((expense) => {
      return (
        expense.eachShares.find(
          (eachShare) => eachShare.person.id === personSummary.person.id,
        )?.amount ?? "0"
      );
    });

    const totalPersonShare = personShare.reduce(
      (sum, amount) => sum + Number.parseFloat(amount),
      0,
    );

    return [personSummary.person.id, totalPersonShare];
  });

  const payees = expenseSummary.personSummaries.filter(
    (personSummary) => personSummary.totalPaid > eachShare,
  );

  const payers = expenseSummary.personSummaries.filter(
    (personSummary) => personSummary.totalPaid < eachShare,
  );

  const settlements: Settlement[] = [];

  const remainingReceivable = new Map<string, number>(
    payees.map((payee) => [payee.person.id, payee.totalPaid - eachShare]),
  );

  for (const payer of payers) {
    let remainingAmountToPay = eachShare - payer.totalPaid;

    for (const payee of payees) {
      if (remainingAmountToPay <= 0) {
        break;
      }

      const amountPayeeCanReceive =
        remainingReceivable.get(payee.person.id) ?? 0;

      const amountToSettle = Math.min(
        remainingAmountToPay,
        amountPayeeCanReceive,
      );

      if (amountToSettle > 0) {
        settlements.push({
          id: `${payer.person.id}-${payee.person.id}`,
          from: payer.person.name,
          to: payee.person.name,
          amount: amountToSettle,
        });

        remainingAmountToPay -= amountToSettle;
        remainingReceivable.set(
          payee.person.id,
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
  person: Person,
  expenses: Expense[] | undefined,
): PersonExpenseSummary {
  if (!expenses || expenses.length === 0) {
    return { person, totalPaid: 0 };
  }

  const personExpenses = expenses.filter(
    (expense) => expense.paidBy.id === person.id,
  );

  const personTotalExpense = personExpenses.reduce((sum, expense) => {
    const amount = Number(expense.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  return {
    person,
    totalPaid: personTotalExpense,
  };
}

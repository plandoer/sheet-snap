import { Expense } from "@/models/expense";
import { ExpenseSummary } from "@/models/expenseSummary";
import { Person } from "@/models/person";
import { PersonExpenseSummary } from "@/models/personExpenseSummary";
import { Settlement } from "@/models/settlement";

export function calculateSummary(
  persons: Person[],
  expenses: Expense[] | undefined,
): ExpenseSummary {
  if (!expenses || expenses.length === 0) {
    return { totalExpense: 0, personSummaries: [] };
  }

  const totalExpense = getTotalExpenseAmount(expenses);
  const personSummaries = persons.map((person) =>
    getPersonSummary(person, expenses),
  );
  return { totalExpense, personSummaries };
}

export function calculateSettlements(
  expenseSummary: ExpenseSummary,
): Settlement[] {
  if (expenseSummary.totalExpense === 0) {
    return [];
  }

  const payees = expenseSummary.personSummaries.filter(
    (personSummary) => personSummary.totalPaid > personSummary.share,
  );

  const payers = expenseSummary.personSummaries.filter(
    (personSummary) => personSummary.totalPaid < personSummary.share,
  );

  const settlements: Settlement[] = [];

  const remainingReceivable = new Map<string, number>(
    payees.map((payee) => [payee.person.id, payee.totalPaid - payee.share]),
  );

  for (const payer of payers) {
    let remainingAmountToPay = payer.share - payer.totalPaid;

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

  return settlements;
}

function getPersonSummary(
  person: Person,
  expenses: Expense[],
): PersonExpenseSummary {
  const personExpenses = expenses.filter(
    (expense) => expense.paidBy.id === person.id,
  );

  const totalPaid = getTotalExpenseAmount(personExpenses);
  const share = getPersonShare(person, expenses);

  return {
    person,
    totalPaid,
    share,
  };
}

function getTotalExpenseAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => {
    const amount = Number(expense.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
}

function getPersonShare(person: Person, expenses: Expense[]): number {
  return expenses
    .flatMap((expense) => expense.eachShares)
    .filter((share) => share.person.id === person.id)
    .reduce((sum, share) => {
      const amount = Number(share.amount);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
}

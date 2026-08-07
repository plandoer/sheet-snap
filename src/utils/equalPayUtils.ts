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
  persons: Person[],
  expenses: Expense[] | undefined,
): Settlement[] {
  const personCount = expenseSummary.personSummaries.length;

  if (
    personCount === 0 ||
    expenseSummary.totalExpense === 0 ||
    !expenses ||
    expenses.length === 0
  ) {
    return [];
  }

  const personShares = getPersonShares(persons, expenses);

  const payees = expenseSummary.personSummaries.filter(
    (personSummary) =>
      personSummary.totalPaid >
      (personShares.get(personSummary.person.id) ?? 0),
  );

  const payers = expenseSummary.personSummaries.filter(
    (personSummary) =>
      personSummary.totalPaid <
      (personShares.get(personSummary.person.id) ?? 0),
  );

  const settlements: Settlement[] = [];

  const remainingReceivable = new Map<string, number>(
    payees.map((payee) => [
      payee.person.id,
      payee.totalPaid - (personShares.get(payee.person.id) ?? 0),
    ]),
  );

  for (const payer of payers) {
    let remainingAmountToPay =
      (personShares.get(payer.person.id) ?? 0) - payer.totalPaid;

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

  return {
    person,
    totalPaid,
  };
}

function getTotalExpenseAmount(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => {
    const amount = Number(expense.amount);
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0);
}

function getPersonShares(
  persons: Person[],
  expenses: Expense[],
): Map<string, number> {
  let personShares = new Map<string, number>();

  personShares = new Map(
    persons.map((person) => {
      const personShare: string[] = expenses.map((expense) => {
        return (
          expense.eachShares.find(
            (eachShare) => eachShare.person.id === person.id,
          )?.amount ?? "0"
        );
      });

      const totalPersonShare = personShare.reduce(
        (sum, amount) => sum + Number.parseFloat(amount),
        0,
      );

      return [person.id, totalPersonShare];
    }),
  );

  return personShares;
}

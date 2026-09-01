import { EachShare } from "@/models/eachShare";
import { Expense } from "@/models/expense";
import { Person } from "@/models/person";
import { Tables } from "@/models/supabase/database.types";
import { toPerson } from "./personUtils";
import { toSubAmount } from "./subAmountUtils";

type ExpenseRow = Tables<"expenses"> & {
  paid_by_person?: Tables<"persons"> | null;
  each_shares?: (Tables<"each_shares"> & {
    person?: Tables<"persons"> | null;
  })[];
  sub_amounts?: Tables<"sub_amounts">[];
};

export function toExpense(row: ExpenseRow): Expense {
  const expense = new Expense();
  expense.id = row.id;
  expense.userId = row.user_id;
  expense.groupId = row.group_id;
  expense.date = new Date(row.date);
  expense.amount = row.amount;
  expense.reason = row.reason ?? "";
  expense.note = row.note ?? "";
  expense.category = row.category ?? "";
  expense.currency = row.currency;
  expense.paidBy = toPaidByPerson(
    row.paid_by_person ? toPerson(row.paid_by_person) : null,
    row.paid_by,
  );
  expense.splitInHalf = row.split_in_half;
  expense.excluded = row.excluded;
  expense.createdAt = row.created_at;
  expense.subAmounts = (row.sub_amounts ?? []).map(toSubAmount);
  expense.eachShares = (row.each_shares ?? []).map((shareRow) =>
    toEachShare(shareRow, shareRow.person ? toPerson(shareRow.person) : null),
  );
  return expense;
}

function toPaidByPerson(
  person: Person | null,
  fallbackId: string | null,
): Person {
  if (!person) {
    const newPerson = new Person();
    newPerson.id = fallbackId ?? "";
    return newPerson;
  }

  return person;
}

function toEachShare(
  row: Tables<"each_shares">,
  personRow: Person | null,
): EachShare {
  const eachShare = new EachShare();
  eachShare.id = row.id;
  eachShare.person = toPaidByPerson(personRow, row.person_id);
  eachShare.amount = row.amount;
  return eachShare;
}

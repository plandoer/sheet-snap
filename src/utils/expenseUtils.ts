import { EachShare } from "@/models/eachShare";
import { Expense } from "@/models/expense";
import { Person } from "@/models/person";
import { Tables } from "@/models/supabase/database.types";
import { expenseGroupService } from "@/services/expenseGroupService";
import { toSubAmount } from "./subAmountUtils";

type ExpenseRow = Tables<"expenses"> & {
  each_shares?: Tables<"each_shares">[];
  sub_amounts?: Tables<"sub_amounts">[];
};

export function toExpense(
  row: ExpenseRow,
  personsById: Map<string, Tables<"persons">>,
): Expense {
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
    row.paid_by ? (personsById.get(row.paid_by) ?? null) : null,
    row.paid_by,
  );
  expense.splitInHalf = row.split_in_half;
  expense.excluded = row.excluded;
  expense.createdAt = row.created_at;
  expense.subAmounts = (row.sub_amounts ?? []).map(toSubAmount);
  expense.eachShares = (row.each_shares ?? []).map((shareRow) =>
    toEachShare(shareRow, personsById.get(shareRow.person_id) ?? null),
  );
  return expense;
}

function toPaidByPerson(
  row: Tables<"persons"> | null,
  fallbackId: string | null,
): Person {
  if (!row) {
    const person = new Person();
    person.id = fallbackId ?? "";
    return person;
  }

  const person = new Person();
  person.id = row.id;
  person.name = row.name;
  person.createdAt = new Date(row.created_at);
  return person;
}

function toEachShare(
  row: Tables<"each_shares">,
  personRow: Tables<"persons"> | null,
): EachShare {
  const eachShare = new EachShare();
  eachShare.id = row.id;
  eachShare.person = toPaidByPerson(personRow, row.person_id);
  eachShare.amount = row.amount;
  return eachShare;
}

export async function resolveGroupId(groupId: string): Promise<string> {
  if (groupId) {
    return groupId;
  }

  const groups = await expenseGroupService.getAll();
  const group = groups[0];
  if (!group) {
    throw new Error("No expense group is available for the current user");
  }
  return group.id;
}

export function flattenRelatedPersonIds(expenseRows: ExpenseRow[]): string[] {
  const personIds: string[] = [];

  for (const row of expenseRows) {
    if (row.paid_by) {
      personIds.push(row.paid_by);
    }

    for (const shareRow of row.each_shares ?? []) {
      personIds.push(shareRow.person_id);
    }
  }

  return personIds;
}

import { Category } from "@/models/category";
import { EachShare } from "@/models/eachShare";
import { Expense } from "@/models/expense";
import { Person } from "@/models/person";
import { Tables } from "@/models/supabase/database.types";
import { toCategory } from "./categoryUtils";
import { toPerson } from "./personUtils";
import { toSubAmount } from "./subAmountUtils";

type ExpenseRow = Tables<"expenses"> & {
  paid_by_person?: Tables<"persons"> | null;
  category?: Tables<"categories"> | null;
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
  expense.category = row.category ? toCategory(row.category) : new Category();
  expense.currency = row.currency;
  expense.paidBy = row.paid_by_person
    ? toPerson(row.paid_by_person)
    : new Person();
  expense.splitInHalf = row.split_in_half;
  expense.excluded = row.excluded;
  expense.isActive = row.is_active;
  expense.createdAt = row.created_at;
  expense.subAmounts = (row.sub_amounts ?? []).map(toSubAmount);
  expense.eachShares = (row.each_shares ?? []).map((shareRow) =>
    toEachShare(shareRow),
  );
  return expense;
}

function toEachShare(
  row: Tables<"each_shares"> & { person?: Tables<"persons"> | null },
): EachShare {
  const eachShare = new EachShare();
  eachShare.id = row.id;
  eachShare.person = row.person ? toPerson(row.person) : new Person();
  eachShare.amount = row.amount;
  return eachShare;
}

import { EachShare } from "@/models/eachShare";
import { ErrorType } from "@/models/enums/errorType";
import { Expense } from "@/models/expense";
import { Person } from "@/models/person";
import { Tables } from "@/models/supabase/database.types";
import { toSubAmount } from "./subAmountService";
import { getCurrentSupabaseUserId, supabase } from "./supabaseAuthService";

type ExpenseRow = Tables<"expenses"> & {
  each_shares?: Tables<"each_shares">[];
  sub_amounts?: Tables<"sub_amounts">[];
};

export async function createExpense(expense: Expense): Promise<Expense> {
  const userId = await getCurrentSupabaseUserId();

  const { data: expenseRow, error } = await supabase
    .rpc("create_expense_with_sub_amounts", {
      p_user_id: userId,
      p_date: expense.date.toISOString(),
      p_amount: expense.amount,
      p_reason: expense.reason || null,
      p_note: expense.note || null,
      p_category: expense.category || null,
      p_currency: expense.currency,
      p_paid_by: expense.paidBy.id || null,
      p_split_in_half: expense.splitInHalf,
      p_excluded: expense.excluded,
      p_sub_amounts: expense.subAmounts.map((s) => ({
        amount: s.amount,
        reason: s.reason,
      })),
      p_each_shares: expense.eachShares.map((share) => ({
        person_id: share.person.id,
        amount: share.amount,
      })),
    })
    .single();

  if (error || !expenseRow) {
    const customError = new Error("Failed to create expense", { cause: error });
    customError.name = ErrorType.FAILED_TO_CREATE_EXPENSE;
    throw customError;
  }

  const createdExpenseId = getExpenseIdFromRpcResult(
    expenseRow,
    ErrorType.FAILED_TO_CREATE_EXPENSE,
  );
  return getExpenseById(createdExpenseId);
}

export async function getExpenses(): Promise<Expense[]> {
  const { data: expenseRows, error } = await supabase
    .from("expenses")
    .select("*, sub_amounts(*), each_shares(*)")
    .order("date", { ascending: false });

  if (error) {
    const customError = new Error("Failed to fetch expenses", { cause: error });
    customError.name = ErrorType.FAILED_TO_FETCH_EXPENSES;
    throw customError;
  }

  const personsById = await getPersonsById(
    flattenRelatedPersonIds(expenseRows),
  );

  return expenseRows.map((row) => toExpense(row, personsById));
}

export async function getExpenseById(id: string): Promise<Expense> {
  const { data: expenseRow, error } = await supabase
    .from("expenses")
    .select("*, sub_amounts(*), each_shares(*)")
    .eq("id", id)
    .single();

  if (error || !expenseRow) {
    const customError = new Error("Failed to fetch expense by id", {
      cause: error,
    });
    customError.name = ErrorType.FAILED_TO_FETCH_EXPENSE_BY_ID;
    throw customError;
  }

  const personsById = await getPersonsById(
    flattenRelatedPersonIds([expenseRow]),
  );
  return toExpense(expenseRow, personsById);
}

export async function updateExpense(
  id: string,
  expense: Expense,
): Promise<Expense> {
  const userId = await getCurrentSupabaseUserId();

  const { data: expenseRow, error } = await supabase
    .rpc("update_expense_with_sub_amounts", {
      p_user_id: userId,
      p_expense_id: id,
      p_date: expense.date.toISOString(),
      p_amount: expense.amount,
      p_reason: expense.reason || null,
      p_note: expense.note || null,
      p_category: expense.category || null,
      p_currency: expense.currency,
      p_paid_by: expense.paidBy.id || null,
      p_split_in_half: expense.splitInHalf,
      p_excluded: expense.excluded,
      p_sub_amounts: expense.subAmounts.map((s) => ({
        amount: s.amount,
        reason: s.reason,
      })),
      p_each_shares: expense.eachShares.map((share) => ({
        person_id: share.person.id,
        amount: share.amount,
      })),
    })
    .single();

  if (error || !expenseRow) {
    const customError = new Error("Failed to update expense", { cause: error });
    customError.name = ErrorType.FAILED_TO_UPDATE_EXPENSE;
    throw customError;
  }

  const updatedExpenseId = getExpenseIdFromRpcResult(
    expenseRow,
    ErrorType.FAILED_TO_UPDATE_EXPENSE,
  );
  return getExpenseById(updatedExpenseId);
}

export async function deleteExpense(id: string): Promise<void> {
  const userId = await getCurrentSupabaseUserId();

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    const customError = new Error("Failed to delete expense", { cause: error });
    customError.name = ErrorType.FAILED_TO_DELETE_EXPENSE;
    throw customError;
  }
}

function toExpense(
  row: ExpenseRow,
  personsById: Map<string, Tables<"persons">>,
): Expense {
  const expense = new Expense();
  expense.id = row.id;
  expense.userId = row.user_id;
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

async function getPersonsById(
  personIds: string[],
): Promise<Map<string, Tables<"persons">>> {
  const uniquePersonIds = Array.from(new Set(personIds));
  if (uniquePersonIds.length === 0) {
    return new Map();
  }

  const { data: personRows, error } = await supabase
    .from("persons")
    .select("*")
    .in("id", uniquePersonIds);

  if (error) {
    const customError = new Error("Failed to fetch related persons", {
      cause: error,
    });
    customError.name = ErrorType.FAILED_TO_FETCH_PERSONS;
    throw customError;
  }

  return new Map(personRows.map((row) => [row.id, row]));
}

function flattenRelatedPersonIds(expenseRows: ExpenseRow[]): string[] {
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

function getExpenseIdFromRpcResult(
  result: unknown,
  errorType: ErrorType,
): string {
  if (
    typeof result === "object" &&
    result !== null &&
    "id" in result &&
    typeof result.id === "string"
  ) {
    return result.id;
  }

  const customError = new Error("Invalid expense returned from RPC");
  customError.name = errorType;
  throw customError;
}

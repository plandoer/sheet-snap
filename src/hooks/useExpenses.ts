import { Expense } from "@/models/expense";
import {
  createExpense,
  getExpenseById,
  getExpenses,
  updateExpense,
} from "@/services/expenseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateExpense() {
  const invalidateExpenses = useInvalidateExpenses();
  return useMutation({
    mutationFn: (expense: Expense) => createExpense(expense),
    onSuccess: invalidateExpenses,
  });
}

export function useUpdateExpense() {
  const invalidateExpenses = useInvalidateExpenses();
  return useMutation({
    mutationFn: ({ id, expense }: { id: string; expense: Expense }) =>
      updateExpense(id, expense),
    onSuccess: invalidateExpenses,
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });
}

export function useExpenseById(id?: string) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => getExpenseById(id!),
    enabled: !!id,
  });
}

function useInvalidateExpenses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["expenses"] });
}

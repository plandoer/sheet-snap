import { Expense } from "@/models/expense";
import { expenseService } from "@/services/expenseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateExpense() {
  const invalidateExpenses = useInvalidateExpenses();
  return useMutation({
    mutationFn: (expense: Expense) => expenseService.create(expense),
    onSuccess: invalidateExpenses,
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => expenseService.getAll(),
  });
}

export function useNonExcludedExpenses() {
  return useQuery({
    queryKey: ["expenses", "nonExcluded"],
    queryFn: () => expenseService.getNotExcluded(),
  });
}

export function useExpenseById(id?: string) {
  return useQuery({
    queryKey: ["expenses", id],
    queryFn: () => expenseService.getById(id!),
    enabled: !!id,
  });
}

export function useUpdateExpense() {
  const invalidateExpenses = useInvalidateExpenses();
  return useMutation({
    mutationFn: ({ id, expense }: { id: string; expense: Expense }) =>
      expenseService.update(id, expense),
    onSuccess: invalidateExpenses,
  });
}

export function useDeleteExpense() {
  const invalidateExpenses = useInvalidateExpenses();
  return useMutation({
    mutationFn: (id: string) => expenseService.delete(id),
    onSuccess: invalidateExpenses,
  });
}

function useInvalidateExpenses() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  };
}

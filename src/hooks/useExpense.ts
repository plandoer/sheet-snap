import { Expense } from "@/models/expense";
import { expenseService } from "@/services/expenseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateExpense() {
  const invalidateExpenses = useInvalidateExpenses();
  return useMutation({
    mutationFn: ({ expense, groupId }: { expense: Expense; groupId: string }) =>
      expenseService.create(expense, groupId),
    onSuccess: invalidateExpenses,
  });
}

export function useExpensesByGroupId(groupId: string) {
  return useQuery({
    enabled: !!groupId,
    queryKey: ["expenses", groupId],
    queryFn: () => expenseService.getByGroupId(groupId),
  });
}

export function useNonExcludedExpenses(groupId: string) {
  return useQuery({
    enabled: !!groupId,
    queryKey: ["expenses", "nonExcluded", groupId],
    queryFn: () => expenseService.getNotExcludedByGroupId(groupId),
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
    mutationFn: ({
      id,
      expense,
      groupId,
    }: {
      id: string;
      expense: Expense;
      groupId: string;
    }) => expenseService.update(id, expense, groupId),
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

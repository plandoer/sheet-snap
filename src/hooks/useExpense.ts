import { useUser } from "@/context/UserContext";
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
  const { user } = useUser();
  return useQuery({
    enabled: !!groupId && !!user,
    queryKey: ["expenses", groupId, user?.id],
    queryFn: () => expenseService.getByGroupId(groupId),
  });
}

export function useNonExcludedExpenses(groupId: string) {
  const { user } = useUser();
  return useQuery({
    enabled: !!groupId && !!user,
    queryKey: ["expenses", "nonExcluded", groupId, user?.id],
    queryFn: () => expenseService.getNotExcludedByGroupId(groupId),
  });
}

export function useExpenseById(id?: string) {
  const { user } = useUser();
  return useQuery({
    enabled: !!id && !!user,
    queryKey: ["expenses", id, user?.id],
    queryFn: () => expenseService.getById(id!),
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

import { useGroupContext } from "@/context/GroupContext";
import { useUser } from "@/context/UserContext";
import { Expense } from "@/models/expense";
import { expenseService } from "@/services/expenseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateExpense() {
  const { currentGroup } = useGroupContext();
  const invalidateExpenses = useInvalidateExpenses();

  return useMutation({
    mutationFn: (expense: Expense) =>
      expenseService.create(expense, currentGroup?.id),
    onSuccess: invalidateExpenses,
  });
}

export function useExpensesByCurrentGroup() {
  const { user } = useUser();
  const { currentGroup } = useGroupContext();
  const groupId = currentGroup?.id ?? "";

  return useQuery({
    enabled: !!groupId && !!user,
    queryKey: ["expenses", groupId, user?.id],
    queryFn: () => expenseService.getByGroupId(groupId),
  });
}

export function useNonExcludedExpensesByCurrentGroup() {
  const { user } = useUser();
  const { currentGroup } = useGroupContext();
  const groupId = currentGroup?.id ?? "";

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
  const { currentGroup } = useGroupContext();
  const groupId = currentGroup?.id ?? "";
  const invalidateExpenses = useInvalidateExpenses();

  return useMutation({
    mutationFn: ({ id, expense }: { id: string; expense: Expense }) =>
      expenseService.update(id, expense, groupId),
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

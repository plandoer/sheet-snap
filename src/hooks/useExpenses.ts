import { Expense } from "@/models/expense";
import { createExpense, getExpenses } from "@/services/expenseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateExpense() {
  const invalidateExpenses = useInvalidateExpenses();
  return useMutation({
    mutationFn: (expense: Expense) => createExpense(expense),
    onSuccess: invalidateExpenses,
  });
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });
}

function useInvalidateExpenses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["expenses"] });
}

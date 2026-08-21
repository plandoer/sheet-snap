import { ExpenseGroup } from "@/models/expenseGroup";
import {
  createExpenseGroup,
  getExpenseGroups,
} from "@/services/expenseGroupService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateExpenseGroup() {
  const invalidateExpenseGroups = useInvalidateExpenseGroups();
  return useMutation({
    mutationFn: (expenseGroup: ExpenseGroup) =>
      createExpenseGroup(expenseGroup),
    onSuccess: invalidateExpenseGroups,
  });
}

export function useExpenseGroups() {
  return useQuery({
    queryKey: ["expenseGroups"],
    queryFn: getExpenseGroups,
  });
}

function useInvalidateExpenseGroups() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["expenseGroups"] });
  };
}

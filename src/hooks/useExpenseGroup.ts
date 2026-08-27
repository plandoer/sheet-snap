import { expenseGroupService } from "@/services/expenseGroupService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateExpenseGroup() {
  const invalidateExpenseGroups = useInvalidateExpenseGroups();
  return useMutation({
    mutationFn: (name: string) => expenseGroupService.create(name),
    onSuccess: invalidateExpenseGroups,
  });
}

export function useExpenseGroups() {
  return useQuery({
    queryKey: ["expenseGroups"],
    queryFn: () => expenseGroupService.getAll(),
  });
}

function useInvalidateExpenseGroups() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["expenseGroups"] });
  };
}

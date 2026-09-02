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

export function useUpdateExpenseGroup() {
  const invalidateExpenseGroups = useInvalidateExpenseGroups();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      expenseGroupService.update(id, name),
    onSuccess: invalidateExpenseGroups,
  });
}

export function useRemoveExpenseGroupMember() {
  const invalidateExpenseGroups = useInvalidateExpenseGroups();
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      expenseGroupService.removeMember(groupId, userId),
    onSuccess: invalidateExpenseGroups,
  });
}

function useInvalidateExpenseGroups() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["expenseGroups"] });
  };
}

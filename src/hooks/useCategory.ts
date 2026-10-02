import { useGroupContext } from "@/context/GroupContext";
import { useUser } from "@/context/UserContext";
import { categoryService } from "@/services/categoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateCategory() {
  const invalidateCategories = useInvalidateCategories();

  return useMutation({
    mutationFn: ({ name, groupId }: { name: string; groupId: string }) =>
      categoryService.create(name, groupId),
    onSuccess: invalidateCategories,
  });
}

export function useCategoriesByCurrentGroup() {
  const { user } = useUser();
  const { currentGroup } = useGroupContext();
  const groupId = currentGroup?.id ?? "";

  return useQuery({
    enabled: !!groupId && !!user,
    queryKey: ["categories", groupId, user?.id],
    queryFn: () => categoryService.getByGroupId(groupId),
  });
}

export function useUpdateCategory() {
  const invalidateCategories = useInvalidateCategories();

  return useMutation({
    mutationFn: ({
      id,
      name,
      groupId,
    }: {
      id: string;
      name: string;
      groupId: string;
    }) => categoryService.update(id, name, groupId),
    onSuccess: invalidateCategories,
  });
}

export function useDeleteCategory() {
  const invalidateCategories = useInvalidateCategories();

  return useMutation({
    mutationFn: ({ id, groupId }: { id: string; groupId: string }) =>
      categoryService.delete(id, groupId),
    onSuccess: invalidateCategories,
  });
}

function useInvalidateCategories() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };
}

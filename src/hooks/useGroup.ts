import { groupService } from "@/services/groupService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateGroup() {
  const invalidateGroups = useInvalidateGroups();
  return useMutation({
    mutationFn: (name: string) => groupService.create(name),
    onSuccess: invalidateGroups,
  });
}

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => groupService.getAll(),
  });
}

export function useUpdateGroup() {
  const invalidateGroups = useInvalidateGroups();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      groupService.update(id, name),
    onSuccess: invalidateGroups,
  });
}

export function useJoinGroup() {
  const invalidateGroups = useInvalidateGroups();
  return useMutation({
    mutationFn: (token: string) =>
      groupService.joinByInvitationToken(token),
    onSuccess: invalidateGroups,
  });
}

export function useRemoveGroupMember() {
  const invalidateGroups = useInvalidateGroups();
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupService.removeMember(groupId, userId),
    onSuccess: invalidateGroups,
  });
}

export function useDeleteGroup() {
  const invalidateGroups = useInvalidateGroups();
  return useMutation({
    mutationFn: (id: string) => groupService.delete(id),
    onSuccess: invalidateGroups,
  });
}

function useInvalidateGroups() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["groups"] });
  };
}

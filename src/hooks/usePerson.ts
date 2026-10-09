import { useGroupContext } from "@/context/GroupContext";
import { useUser } from "@/context/UserContext";
import { personService } from "@/services/personService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreatePerson() {
  const { currentGroup } = useGroupContext();
  const invalidatePersons = useInvalidatePersons();

  return useMutation({
    mutationFn: (name: string) => personService.create(name, currentGroup?.id),
    onSuccess: invalidatePersons,
  });
}

export function usePersonsByCurrentGroup() {
  const { user } = useUser();
  const { currentGroup } = useGroupContext();
  const groupId = currentGroup?.id ?? "";

  return useQuery({
    enabled: !!groupId && !!user,
    queryKey: ["persons", groupId, user?.id],
    queryFn: () => personService.getByGroupId(groupId),
  });
}

export function useUpdatePerson() {
  const invalidatePersons = useInvalidatePersons();

  return useMutation({
    mutationFn: ({
      id,
      name,
      groupId,
    }: {
      id: string;
      name: string;
      groupId: string;
    }) => personService.update(id, name, groupId),
    onSuccess: invalidatePersons,
  });
}

export function useDeletePerson() {
  const invalidatePersons = useInvalidatePersons();

  return useMutation({
    mutationFn: ({ id, groupId }: { id: string; groupId: string }) =>
      personService.delete(id, groupId),
    onSuccess: invalidatePersons,
  });
}

function useInvalidatePersons() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["persons"] });
  };
}

import { Person } from "@/models/person";
import { personService } from "@/services/personService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePersons() {
  return useQuery({
    queryKey: ["persons"],
    queryFn: () => personService.getAll(),
  });
}

export function useCreatePerson() {
  const invalidatePersons = useInvalidatePersons();
  return useMutation({
    mutationFn: (name: string) => personService.create(name),
    onSuccess: invalidatePersons,
  });
}

export function useUpdatePerson() {
  const invalidatePersons = useInvalidatePersons();
  return useMutation({
    mutationFn: ({ id, name }: Person) => personService.update(id, name),
    onSuccess: invalidatePersons,
  });
}

export function useDeletePerson() {
  const invalidatePersons = useInvalidatePersons();
  return useMutation({
    mutationFn: (id: string) => personService.delete(id),
    onSuccess: invalidatePersons,
  });
}

function useInvalidatePersons() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["persons"] });
  };
}

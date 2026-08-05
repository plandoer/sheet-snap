import { Person } from "@/models/person";
import {
  createPerson,
  deletePerson,
  getPersons,
  updatePerson,
} from "@/services/personService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePersons() {
  return useQuery({
    queryKey: ["persons"],
    queryFn: getPersons,
  });
}

export function useCreatePerson() {
  const invalidatePersons = useInvalidatePersons();
  return useMutation({
    mutationFn: (name: string) => createPerson(name),
    onSuccess: invalidatePersons,
  });
}

export function useUpdatePerson() {
  const invalidatePersons = useInvalidatePersons();
  return useMutation({
    mutationFn: ({ id, name }: Person) => updatePerson(id, name),
    onSuccess: invalidatePersons,
  });
}

export function useDeletePerson() {
  const invalidatePersons = useInvalidatePersons();
  return useMutation({
    mutationFn: (id: string) => deletePerson(id),
    onSuccess: invalidatePersons,
  });
}

function useInvalidatePersons() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["persons"] });
  };
}

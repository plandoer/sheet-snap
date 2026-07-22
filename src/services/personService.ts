import { ErrorType } from "@/models/enums/errorType";
import { Person } from "@/models/person";
import { Tables, TablesInsert } from "@/models/supabase/database.types";
import { getCurrentSupabaseUserId, supabase } from "./supabaseAuthService";

export async function getPersons(): Promise<Person[]> {
  const { data: personRows, error } = await supabase
    .from("persons")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    const customError = new Error("Failed to fetch persons", { cause: error });
    customError.name = ErrorType.FAILED_TO_FETCH_PERSONS;
    throw customError;
  }

  return personRows.map(toPerson);
}

export async function createPerson(name: string): Promise<Person> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    const customError = new Error("Person name is required");
    customError.name = ErrorType.FAILED_TO_CREATE_PERSON;
    throw customError;
  }

  const userId = await getCurrentSupabaseUserId();
  const payload: TablesInsert<"persons"> = {
    user_id: userId,
    name: trimmedName,
  };

  const { data: personRow, error } = await supabase
    .from("persons")
    .insert(payload)
    .select("*")
    .single();

  if (error || !personRow) {
    const customError = new Error("Failed to create person", { cause: error });
    customError.name = ErrorType.FAILED_TO_CREATE_PERSON;
    throw customError;
  }

  return toPerson(personRow);
}

export async function deletePerson(id: string): Promise<void> {
  const userId = await getCurrentSupabaseUserId();
  const { error } = await supabase
    .from("persons")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    const customError = new Error("Failed to delete person", { cause: error });
    customError.name = ErrorType.FAILED_TO_DELETE_PERSON;
    throw customError;
  }
}

export function toPerson(row: Tables<"persons">): Person {
  const person = new Person();
  person.id = row.id;
  person.name = row.name;
  person.createdAt = new Date(row.created_at);
  return person;
}

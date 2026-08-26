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

export async function getPersonsById(
  personIds: string[],
): Promise<Map<string, Tables<"persons">>> {
  const uniquePersonIds = Array.from(new Set(personIds));
  if (uniquePersonIds.length === 0) {
    return new Map();
  }

  const { data: personRows, error } = await supabase
    .from("persons")
    .select("*")
    .in("id", uniquePersonIds);

  if (error) {
    const customError = new Error("Failed to fetch related persons", {
      cause: error,
    });
    customError.name = ErrorType.FAILED_TO_FETCH_PERSONS;
    throw customError;
  }

  return new Map(personRows.map((row) => [row.id, row]));
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

export async function updatePerson(id: string, name: string): Promise<Person> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    const customError = new Error("Person name is required");
    customError.name = ErrorType.FAILED_TO_UPDATE_PERSON;
    throw customError;
  }

  const userId = await getCurrentSupabaseUserId();
  const payload: Partial<TablesInsert<"persons">> = {
    name: trimmedName,
  };

  const { data: personRow, error } = await supabase
    .from("persons")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !personRow) {
    const customError = new Error("Failed to update person", { cause: error });
    customError.name = ErrorType.FAILED_TO_UPDATE_PERSON;
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

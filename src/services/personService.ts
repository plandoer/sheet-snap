import { ErrorType } from "@/models/enums/errorType";
import { Person } from "@/models/person";
import { TablesInsert } from "@/models/supabase/database.types";
import { toPerson } from "@/utils/personUtils";
import { supabase, supabaseAuthService } from "./supabaseAuthService";

export const personService = {
  async create(name: string): Promise<Person> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      const customError = new Error("Person name is required");
      customError.name = ErrorType.FAILED_TO_CREATE_PERSON;
      throw customError;
    }

    const userId = await supabaseAuthService.getCurrentUserId();
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
      const customError = new Error("Failed to create person", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_CREATE_PERSON;
      throw customError;
    }

    return toPerson(personRow);
  },

  async getAll(): Promise<Person[]> {
    const { data: personRows, error } = await supabase
      .from("persons")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      const customError = new Error("Failed to fetch persons", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_FETCH_PERSONS;
      throw customError;
    }

    return personRows.map(toPerson);
  },

  async update(id: string, name: string): Promise<Person> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      const customError = new Error("Person name is required");
      customError.name = ErrorType.FAILED_TO_UPDATE_PERSON;
      throw customError;
    }

    const userId = await supabaseAuthService.getCurrentUserId();
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
      const customError = new Error("Failed to update person", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_UPDATE_PERSON;
      throw customError;
    }

    return toPerson(personRow);
  },

  async delete(id: string): Promise<void> {
    const userId = await supabaseAuthService.getCurrentUserId();
    const { error } = await supabase
      .from("persons")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      const customError = new Error("Failed to delete person", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_DELETE_PERSON;
      throw customError;
    }
  },
};

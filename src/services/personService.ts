import { ErrorType } from "@/models/enums/errorType";
import { Person } from "@/models/person";
import { TablesInsert } from "@/models/supabase/database.types";
import { toPerson } from "@/utils/personUtils";
import { supabase } from "./supabaseAuthService";

export const personService = {
  async create(name: string, groupId: string): Promise<Person> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      const customError = new Error("Person name is required");
      customError.name = ErrorType.FAILED_TO_CREATE_PERSON;
      throw customError;
    }

    const payload: TablesInsert<"persons"> = {
      group_id: groupId,
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

  async getByGroupId(groupId: string): Promise<Person[]> {
    const { data: personRows, error } = await supabase
      .from("persons")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      const customError = new Error(
        `Failed to fetch persons for group ${groupId}`,
        { cause: error },
      );
      customError.name = ErrorType.FAILED_TO_FETCH_PERSONS;
      throw customError;
    }

    return personRows.map(toPerson);
  },

  async update(id: string, name: string, groupId: string): Promise<Person> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      const customError = new Error("Person name is required");
      customError.name = ErrorType.FAILED_TO_UPDATE_PERSON;
      throw customError;
    }

    const payload: Partial<TablesInsert<"persons">> = {
      name: trimmedName,
    };

    const { data: personRow, error } = await supabase
      .from("persons")
      .update(payload)
      .eq("id", id)
      .eq("group_id", groupId)
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

  async delete(id: string, groupId: string): Promise<void> {
    const { error } = await supabase
      .from("persons")
      .delete()
      .eq("id", id)
      .eq("group_id", groupId);

    if (error) {
      const customError = new Error("Failed to delete person", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_DELETE_PERSON;
      throw customError;
    }
  },
};

import { ErrorType } from "@/models/enums/errorType";
import { Tables } from "@/models/supabase/database.types";
import { supabase } from "./supabaseAuthService";

type Profile = Tables<"profiles">;

export const profileService = {
  async getByUserIds(userIds: string[]): Promise<Map<string, Profile>> {
    const uniqueIds = Array.from(new Set(userIds));

    if (uniqueIds.length === 0) return new Map();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", uniqueIds);

    if (error) {
      const customError = new Error("Failed to fetch profiles", {
        cause: error,
      });
      customError.name = ErrorType.FAILED_TO_FETCH_PROFILES;
      throw customError;
    }

    return new Map(data.map((profile) => [profile.id, profile]));
  },
};

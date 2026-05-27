import { ErrorType } from "@/models/enums/errorType";
import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";
import { Database } from "../models/supabase/database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

export async function signInWithSupabase(idToken: string) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
  return { data, error };
}

export async function getCurrentSupabaseUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    const customError = new Error("Failed to get current user from Supabase", {
      cause: error,
    });
    customError.name = ErrorType.FAILED_TO_GET_CURRENT_USER;
    throw customError;
  }
  return data.user.id;
}

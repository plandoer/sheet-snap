import { ErrorType } from "@/models/enums/errorType";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../models/supabase/database.types";
import { storageService } from "./storageService";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      storage: storageService,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

export const supabaseAuthService = {
  async getCurrentUserId(): Promise<string> {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user.id) {
      const customError = new Error(
        "Failed to get current user from Supabase",
        {
          cause: error,
        },
      );
      customError.name = ErrorType.FAILED_TO_GET_CURRENT_USER;
      throw customError;
    }

    return data.user.id;
  },

  async signInAndGetUserId(googleUserIdToken: string): Promise<string> {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: googleUserIdToken,
    });

    if (error || !data.user || !data.user.id) {
      const customError = new Error("Supabase Sign-In failed.", {
        cause: error,
      });
      customError.name = ErrorType.SUPABASE_SIGN_IN_FAILED;
      throw customError;
    }

    return data.user.id;
  },

  async signOut() {
    return await supabase.auth.signOut();
  },
};

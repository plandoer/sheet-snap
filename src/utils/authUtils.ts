import { ErrorType } from "@/models/enums/errorType";
import { GoogleUser } from "@/models/googleUser";
import { SupabaseUser } from "@/models/supabaseUser";
import { initUser, User } from "@/models/user";
import {
  getCurrentGoogleUser,
  signInWithGoogle,
} from "@/services/googleAuthService";
import { signInWithSupabase, supabase } from "@/services/supabaseAuthService";

export async function initCurrentUser(): Promise<User | null> {
  const googleUser = await getCurrentGoogleUser();
  const { data: supabaseData, error } = await supabase.auth.getUser();

  if (error) {
    if (error.name === "AuthSessionMissingError") {
      return null;
    }
    const customError = new Error("Failed to get current user from Supabase.", {
      cause: error,
    });
    customError.name = ErrorType.FAILED_TO_GET_CURRENT_USER;
    throw customError;
  }

  if (!googleUser?.user || !supabaseData?.user) {
    return null;
  }

  return getUser(supabaseData.user, googleUser.user);
}

export async function handleLogin(): Promise<User | null> {
  const googleUser = await signInWithGoogle();

  if (googleUser.type === "cancelled") {
    const error = new Error("Login cancelled by user");
    error.name = ErrorType.LOGIN_CANCELLED;
    throw error;
  }

  const { user, idToken } = googleUser.data ?? {};

  if (!user || !idToken) {
    const error = new Error("Google Sign-In failed.");
    error.name = ErrorType.GOOGLE_SIGN_IN_FAILED;
    throw error;
  }

  const { data, error } = await signInWithSupabase(idToken);

  if (error || !data.user) {
    const customError = new Error("Supabase Sign-In failed.", { cause: error });
    customError.name = ErrorType.SUPABASE_SIGN_IN_FAILED;
    throw customError;
  }

  return getUser(data.user, user);
}

function getUser(supabaseUser: SupabaseUser, googleUser: GoogleUser): User {
  const user = initUser();
  user.id = supabaseUser.id;
  user.name = googleUser.name;
  user.email = googleUser.email;
  user.photo = googleUser.photo;
  return user;
}

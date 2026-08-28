import { ErrorType } from "@/models/enums/errorType";
import { User } from "@/models/user";
import { googleAuthService } from "@/services/googleAuthService";
import { supabaseAuthService } from "@/services/supabaseAuthService";

export async function initCurrentUser(): Promise<User | null> {
  const googleUser = await googleAuthService.getCurrentUser();
  const supabaseUserId = await supabaseAuthService.getCurrentUserId();

  if (!googleUser?.user || !supabaseUserId) {
    return null;
  }

  const user = new User();
  user.id = supabaseUserId;
  user.name = googleUser.user.name;
  user.email = googleUser.user.email;
  user.photo = googleUser.user.photo;

  return user;
}

export async function handleLogin(): Promise<User | null> {
  const googleUser = await googleAuthService.signIn();

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

  const { data, error } = await supabaseAuthService.signIn(idToken);

  if (error || !data.user) {
    const customError = new Error("Supabase Sign-In failed.", { cause: error });
    customError.name = ErrorType.SUPABASE_SIGN_IN_FAILED;
    throw customError;
  }

  return getUser(data.user.id, user);
}

export async function handleLogout() {
  const [googleResult, supabaseResult] = await Promise.allSettled([
    googleAuthService.signOut(),
    supabaseAuthService.signOut(),
  ]);

  const errors: unknown[] = [];

  if (googleResult.status === "rejected") {
    errors.push(googleResult.reason);
  }

  if (supabaseResult.status === "fulfilled" && supabaseResult.value.error) {
    errors.push(supabaseResult.value.error);
  } else if (supabaseResult.status === "rejected") {
    errors.push(supabaseResult.reason);
  }

  if (errors.length > 0) {
    const customError = new Error("Logout failed.", {
      cause: errors.length === 1 ? errors[0] : errors,
    });
    customError.name = ErrorType.LOGOUT_FAILED;
    throw customError;
  }
}

function getUser(supabaseUserId: string, googleUser: GoogleUser): User {
  const user = new User();
  user.id = supabaseUserId;
  user.name = googleUser.name;
  user.email = googleUser.email;
  user.photo = googleUser.photo;
  return user;
}

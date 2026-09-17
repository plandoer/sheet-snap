import { ErrorType } from "@/models/enums/errorType";
import { User } from "@/models/user";
import { googleAuthService } from "@/services/googleAuthService";
import { storageService } from "@/services/storageService";
import { supabaseAuthService } from "@/services/supabaseAuthService";
import { queryClient } from "./queryUtils";

export async function initCurrentUser(): Promise<User | null> {
  const googleUser = await googleAuthService.getCurrentUser();

  if (!googleUser) {
    return null;
  }

  const supabaseUserId = await supabaseAuthService.getCurrentUserId();

  const user = new User();
  user.id = supabaseUserId;
  user.name = googleUser.username;
  user.email = googleUser.email;
  user.photo = googleUser.photo;

  return user;
}

export async function handleLogin(): Promise<User> {
  const googleUser = await googleAuthService.signIn();

  const supabaseUserId = await supabaseAuthService.signInAndGetUserId(
    googleUser.idToken,
  );

  const user = new User();
  user.id = supabaseUserId;
  user.name = googleUser.username;
  user.email = googleUser.email;
  user.photo = googleUser.photo;

  return user;
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

  if (supabaseResult.status === "rejected") {
    errors.push(supabaseResult.reason);
  } else if (supabaseResult.value.error) {
    errors.push(supabaseResult.value.error);
  }

  try {
    queryClient.clear();
    await storageService.clearAll();
  } catch (error) {
    errors.push(error);
  }

  if (errors.length > 0) {
    const customError = new Error("Logout failed.", {
      cause: errors.length === 1 ? errors[0] : errors,
    });
    customError.name = ErrorType.LOGOUT_FAILED;
    throw customError;
  }
}

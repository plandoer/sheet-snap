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
  try {
    await googleAuthService.signOut();
    await supabaseAuthService.signOut();
    queryClient.clear();
    await storageService.clearAll();
  } catch (error) {
    const customError = new Error("Logout failed.", { cause: error });
    customError.name = ErrorType.LOGOUT_FAILED;
    throw customError;
  }
}

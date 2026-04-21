import { GoogleUser } from "@/models/googleUser";
import { SupabaseUser } from "@/models/supabaseUser";
import { initUser, User } from "@/models/user";
import {
  getCurrentGoogleUser,
  signInWithGoogle,
} from "@/services/googleAuthService";
import { signInWithSupabase, supabase } from "@/services/supabaseAuthService";
import { Alert } from "react-native";

export async function initCurrentUser(): Promise<User | null> {
  const googleUser = await getCurrentGoogleUser();
  const { data, error } = await supabase.auth.getUser();

  if (!googleUser?.user || !data?.user || error) {
    Alert.alert(
      "Authentication Error",
      "Failed to retrieve current user information. Please try signing in again.",
    );
    throw (
      error ?? new Error("Failed to get current user from Google or Supabase.")
    );
  }

  return getUser(data.user, googleUser.user);
}

export async function handleLogin(): Promise<User | null> {
  try {
    const googleUser = await signInWithGoogle();

    if (googleUser.type === "cancelled") {
      Alert.alert("👋 Hey", "Please login to continue using the app.");
      return null;
    }

    const { user, idToken } = googleUser.data ?? {};

    if (!user) return null;
    if (!idToken) throw new Error("Google Sign-In did not return an ID token.");

    const { data, error } = await signInWithSupabase(idToken);

    if (error || !data.user)
      throw error ?? new Error("Supabase sign-in failed.");

    return getUser(data.user, user);
  } catch (error: any) {
    console.error("Login failed:", error);
    Alert.alert(
      "Login Failed",
      "An error occurred during Google Sign-In. Please try again.",
    );
    return null;
  }
}

function getUser(supabaseUser: SupabaseUser, googleUser: GoogleUser): User {
  const user = initUser();
  user.id = supabaseUser.id;
  user.name = googleUser.name;
  user.email = googleUser.email;
  user.photo = googleUser.photo;
  return user;
}

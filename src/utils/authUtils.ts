import { initUser, User } from "@/models/user";
import {
  getCurrentGoogleUser,
  signInWithGoogle,
} from "@/services/googleAuthService";
import { signInWithSupabase, supabase } from "@/services/supabaseAuthService";
import { Alert } from "react-native";

export async function handleLogin(): Promise<User | null> {
  try {
    const userInfo = await signInWithGoogle();

    if (userInfo.type === "cancelled") {
      Alert.alert("👋 Hey", "Please login to continue using the app.");
      return null;
    }

    if (!userInfo.data?.user) {
      return null;
    }

    const idToken = userInfo.data.idToken;

    if (!idToken) {
      throw new Error("Google Sign-In did not return an ID token.");
    }

    console.log("Google Sign-In successful. User info:", idToken);

    const { data, error } = await signInWithSupabase(idToken);
    console.log("Supabase sign-in response:", data);
    if (error || !data.user) {
      console.error("Supabase sign-in failed:", error);
      throw error;
    }
    console.log("Supabase sign-in successful.");

    const user = initUser();
    user.id = data.user.id;
    user.name = userInfo.data.user.name;
    user.email = userInfo.data.user.email;
    user.photo = userInfo.data.user.photo;
    return user;
  } catch (error: any) {
    console.error("Login failed:", error);

    Alert.alert(
      "Login Failed",
      error.message ||
        "An error occurred during Google Sign-In. Please try again.",
    );
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const googleUser = await getCurrentGoogleUser();
    const supabaseUser = await supabase.auth.getUser();

    if (!googleUser?.user || !supabaseUser.data.user) {
      return null;
    }

    return {
      id: supabaseUser.data.user.id,
      name: googleUser.user.name,
      email: googleUser.user.email,
      photo: googleUser.user.photo,
    };
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

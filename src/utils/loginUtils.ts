import { signInWithGoogle } from "@/config/google-signin";
import { initUser, User } from "@/models/user";
import { supabase } from "@/utils/supabase";
import { Alert } from "react-native";

export async function handleGoogleLogin(): Promise<User | null> {
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

    console.log("Google Sign-In successful. User info:", idToken);

    if (idToken) {
      console.log("Signing in with Supabase using Google ID token...");
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      console.log("Supabase sign-in response:", data);
      if (error) {
        console.error("Supabase sign-in failed:", error);
        throw error;
      }
      console.log("Supabase sign-in successful.");
    }

    const user = initUser();
    user.id = userInfo.data.user.id;
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

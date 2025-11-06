import { signInWithGoogle } from "@/config/google-signin";
import { initUser, User } from "@/models/user";
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
        "An error occurred during Google Sign-In. Please try again."
    );
    return null;
  }
}

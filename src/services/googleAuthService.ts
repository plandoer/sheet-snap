import { ErrorType } from "@/models/enums/errorType";
import { GoogleUser } from "@/models/googleUser";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const googleAuthService = {
  init() {
    GoogleSignin.configure({
      // iOS Client ID
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,

      // Web Client ID
      // Note: For Android, use the Web Client ID (not Android Client ID)
      // Android authentication uses the Web Client ID + Android SHA-1 fingerprint
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,

      // Scopes for accessing Google Sheets
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.readonly",
      ],

      // Request offline access to get refresh token
      // Set to true if you need a refresh token for server-side use
      offlineAccess: false,
    });
  },

  async getCurrentUser(): Promise<GoogleUser> {
    const response = await GoogleSignin.getCurrentUser();

    if (!response || !response.idToken || !response.user) {
      const error = new Error(
        "Failed to get current user from Google Sign-In.",
      );
      error.name = ErrorType.FAILED_TO_GET_CURRENT_USER;
      throw error;
    }

    const user = new GoogleUser();
    user.idToken = response.idToken;
    user.username = response.user.name ?? "";
    user.email = response.user.email ?? "";
    user.photo = response.user.photo ?? "";

    return user;
  },

  async signIn(): Promise<GoogleUser> {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();

      if (!hasPlayServices) {
        const error = new Error(
          "Google Play Services are not available or outdated.",
        );
        error.name = ErrorType.PLAY_SERVICES_UNAVAILABLE;
        throw error;
      }

      const response = await GoogleSignin.signIn();

      if (response.type === "cancelled") {
        const error = new Error("Login cancelled by user");
        error.name = ErrorType.LOGIN_CANCELLED;
        throw error;
      }

      if (!response || !response.data.idToken || !response.data) {
        const error = new Error("Google Sign-In failed.");
        error.name = ErrorType.GOOGLE_SIGN_IN_FAILED;
        throw error;
      }

      const user = new GoogleUser();
      user.idToken = response.data.idToken;
      user.username = response.data.user.name ?? "";
      user.email = response.data.user.email ?? "";
      user.photo = response.data.user.photo ?? "";

      return user;
    } catch (error: any) {
      if (error?.message === "NETWORK_ERROR") {
        const networkError = new Error(
          "Network error occurred during Google Sign-In.",
        );
        networkError.name = ErrorType.NETWORK_ERROR;
        throw networkError;
      }
      throw error;
    }
  },

  async signOut() {
    return await GoogleSignin.signOut();
  },
};

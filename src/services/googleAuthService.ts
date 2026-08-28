import { ErrorType } from "@/models/enums/errorType";
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

  async getCurrentUser() {
    return await GoogleSignin.getCurrentUser();
  },

  async signIn() {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn().catch((error) => {
      if (error.message === "NETWORK_ERROR") {
        const networkError = new Error(
          "Network error occurred during Google Sign-In.",
        );
        networkError.name = ErrorType.NETWORK_ERROR;
        throw networkError;
      }
      throw error;
    });
    return userInfo;
  },

  async signOut() {
    return await GoogleSignin.signOut();
  },
};

import { GoogleSignin } from "@react-native-google-signin/google-signin";

export function initGoogleSignIn() {
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
    offlineAccess: true,
  });
}

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

export async function signOutFromGoogle() {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error("Google Sign-Out Error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser;
  } catch (error) {
    console.error("Get Current User Error:", error);
    return null;
  }
}

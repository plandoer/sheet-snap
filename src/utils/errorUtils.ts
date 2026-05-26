import { ErrorType } from "@/models/enums/errorType";
import { ErrorInfo } from "@/models/errorInfo";

export function getErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    switch (error.name) {
      case ErrorType.LOGIN_CANCELLED:
        return new ErrorInfo(
          "👋 Hey",
          "Please login to continue using the app.",
        );
      case ErrorType.GOOGLE_SIGN_IN_FAILED:
      case ErrorType.SUPABASE_SIGN_IN_FAILED:
        return new ErrorInfo(
          "Sign-in Failed",
          "We couldn't sign you in. Please check your connection and try again.",
        );
      case ErrorType.FAILED_TO_GET_CURRENT_USER:
        return new ErrorInfo(
          "Failed to Get Current User",
          "We couldn't retrieve your account information. Please try signing in again.",
        );
      case ErrorType.INVALID_FORM_DATA:
        return new ErrorInfo(
          "Invalid Form Data",
          "Please fill in all required fields before submitting.",
        );
      case ErrorType.NO_SHEET_SELECTED:
        return new ErrorInfo(
          "No Sheet Selected",
          "Please select a Google Sheet to save your data.",
        );
      case ErrorType.NO_GOOGLE_ACCESS_TOKEN:
        return new ErrorInfo(
          "No Google Access Token",
          "We couldn't access your Google account. Please try signing in again.",
        );
      case ErrorType.FAILED_TO_FETCH_SHEETS:
        return new ErrorInfo(
          "Failed to Retrieve Sheets",
          "We couldn't retrieve your Google Sheets. Please check your connection and try again.",
        );
      case ErrorType.FAILED_TO_APPEND_TO_SHEET:
        return new ErrorInfo(
          "Failed to Save Data",
          "We couldn't save your data to the Google Sheet. Please check your connection and try again.",
        );
      default:
        return new ErrorInfo(
          "Internal Error",
          error.message || "An unexpected error occurred. Please try again.",
        );
    }
  }

  return new ErrorInfo(
    "Internal Error",
    "An unexpected error occurred. Please try again.",
  );
}

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
      case ErrorType.FAILED_TO_CREATE_EXPENSE:
        return new ErrorInfo(
          "Failed to Create Expense",
          "We couldn't create your expense. Please try again.",
        );
      case ErrorType.FAILED_TO_FETCH_EXPENSES:
        return new ErrorInfo(
          "Failed to Fetch Expenses",
          "We couldn't retrieve your expenses. Please check your connection and try again.",
        );
      case ErrorType.FAILED_TO_CREATE_SUB_AMOUNTS:
        return new ErrorInfo(
          "Failed to Create Sub Amounts",
          "We couldn't save the sub amounts for your expense. Please try again.",
        );
      case ErrorType.SUBMISSION_IN_PROGRESS:
        return new ErrorInfo(
          "Submission in Progress",
          "Your previous submission is still being processed. Please wait a moment before trying again.",
        );
      case ErrorType.LOGOUT_FAILED:
        return new ErrorInfo(
          "Logout Failed",
          "We couldn't log you out. Please check your connection and try again.",
        );
      case ErrorType.TOKEN_REVOKED:
        return new ErrorInfo(
          "Session Expired",
          "Your Google session has expired or been revoked. Please sign in again to continue.",
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

import { ErrorType } from "@/models/enums/errorType";
import { ErrorInfo } from "@/models/errorInfo";

export function getErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    switch (error.name) {
      case ErrorType.LOGIN_CANCELLED:
        return {
          title: "👋 Hey",
          message: "Please login to continue using the app.",
        };
      case ErrorType.GOOGLE_SIGN_IN_FAILED:
      case ErrorType.SUPABASE_SIGN_IN_FAILED:
        return {
          title: "Sign-in Failed",
          message:
            "We couldn't sign you in. Please check your connection and try again.",
        };
      case ErrorType.FAILED_TO_GET_CURRENT_USER:
        return {
          title: "Failed to Get Current User",
          message:
            "We couldn't retrieve your account information. Please try signing in again.",
        };
      case ErrorType.INVALID_FORM_DATA:
        return {
          title: "Invalid Form Data",
          message: "Please fill in all required fields before submitting.",
        };
      case ErrorType.NO_SHEET_SELECTED:
        return {
          title: "No Sheet Selected",
          message: "Please select a Google Sheet to save your data.",
        };
      case ErrorType.NO_GOOGLE_ACCESS_TOKEN:
        return {
          title: "No Google Access Token",
          message:
            "We couldn't access your Google account. Please try signing in again.",
        };
      case ErrorType.FAILED_TO_FETCH_SHEETS:
        return {
          title: "Failed to Retrieve Sheets",
          message:
            "We couldn't retrieve your Google Sheets. Please check your connection and try again.",
        };
      case ErrorType.FAILED_TO_APPEND_TO_SHEET:
        return {
          title: "Failed to Save Data",
          message:
            "We couldn't save your data to the Google Sheet. Please check your connection and try again.",
        };
      case ErrorType.FAILED_TO_CREATE_EXPENSE:
        return {
          title: "Failed to Create Expense",
          message: "We couldn't create your expense. Please try again.",
        };
      case ErrorType.FAILED_TO_FETCH_EXPENSES:
        return {
          title: "Failed to Fetch Expenses",
          message:
            "We couldn't retrieve your expenses. Please check your connection and try again.",
        };
      case ErrorType.FAILED_TO_FETCH_EXPENSE_BY_ID:
        return {
          title: "Failed to Load Expense",
          message: "We couldn't load this expense. Please try again.",
        };
      case ErrorType.FAILED_TO_UPDATE_EXPENSE:
        return {
          title: "Failed to Update Expense",
          message: "We couldn't save your changes. Please try again.",
        };
      case ErrorType.FAILED_TO_DELETE_EXPENSE:
        return {
          title: "Failed to Delete Expense",
          message: "We couldn't delete this expense. Please try again.",
        };
      case ErrorType.FAILED_TO_CREATE_SUB_AMOUNTS:
        return {
          title: "Failed to Create Sub Amounts",
          message:
            "We couldn't save the sub amounts for your expense. Please try again.",
        };
      case ErrorType.FAILED_TO_FETCH_PERSONS:
        return {
          title: "Failed to Fetch Persons",
          message:
            "We couldn't retrieve persons. Please check your connection and try again.",
        };
      case ErrorType.FAILED_TO_CREATE_PERSON:
        return {
          title: "Failed to Create Person",
          message: "We couldn't add this person. Please try again.",
        };
      case ErrorType.FAILED_TO_UPDATE_PERSON:
        return {
          title: "Failed to Update Person",
          message: "We couldn't update this person. Please try again.",
        };
      case ErrorType.FAILED_TO_DELETE_PERSON:
        return {
          title: "Failed to Delete Person",
          message: "We couldn't delete this person. Please try again.",
        };
      case ErrorType.SUBMISSION_IN_PROGRESS:
        return {
          title: "Submission in Progress",
          message:
            "Your previous submission is still being processed. Please wait a moment before trying again.",
        };
      case ErrorType.LOGOUT_FAILED:
        return {
          title: "Logout Failed",
          message:
            "We couldn't log you out. Please check your connection and try again.",
        };
      case ErrorType.TOKEN_REVOKED:
        return {
          title: "Session Expired",
          message:
            "Your Google session has expired or been revoked. Please sign in again to continue.",
        };
      case ErrorType.NETWORK_ERROR:
        return {
          title: "Network Error",
          message: "Please check your internet connection and try again.",
        };
      default:
        return {
          title: "Internal Error",
          message:
            error.message || "An unexpected error occurred. Please try again.",
        };
    }
  }

  return {
    title: "Internal Error",
    message: "An unexpected error occurred. Please try again.",
  };
}

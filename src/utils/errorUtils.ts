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
    }
  }

  return new ErrorInfo(
    "Internal Error",
    "An unexpected error occurred. Please try again.",
  );
}

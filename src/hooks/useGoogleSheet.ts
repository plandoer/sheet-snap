import { useSheet } from "@/context/SheetContext";
import { ErrorInfo } from "@/models/errorInfo";
import { SheetFormData } from "@/models/form";
import { getErrorInfo } from "@/utils/errorUtils";
import { handleForm } from "@/utils/formUtils";
import { useState } from "react";

export function useSaveToGoogleSheet() {
  const { selectedSheet } = useSheet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);

  async function save(formData: SheetFormData): Promise<void> {
    setError(null);
    if (isSubmitting) return Promise.reject("Submission in progress");

    if (!selectedSheet) {
      return Promise.reject("No sheet selected");
    }

    setIsSubmitting(true);
    try {
      return await handleForm(
        formData,
        selectedSheet.spreadsheet.id,
        selectedSheet.sheet.properties.title,
      );
    } catch (error) {
      console.error("Error saving to sheet:", error);
      const errorInfo = getErrorInfo(error);
      setError(errorInfo);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    error,
    save,
  };
}

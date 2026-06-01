import { useSheet } from "@/context/SheetContext";
import { ErrorType } from "@/models/enums/errorType";
import { SheetFormData } from "@/models/form";
import { handleForm } from "@/utils/formUtils";
import { useState } from "react";

export function useSaveToGoogleSheet() {
  const { selectedSheet } = useSheet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function save(formData: SheetFormData): Promise<void> {
    if (isSubmitting) {
      const error = new Error("Submission in progress");
      error.name = ErrorType.SUBMISSION_IN_PROGRESS;
      return Promise.reject(error);
    }

    try {
      if (!selectedSheet) {
        const error = new Error("No sheet selected");
        error.name = ErrorType.NO_SHEET_SELECTED;
        return Promise.reject(error);
      }

      setIsSubmitting(true);

      return await handleForm(
        formData,
        selectedSheet.spreadsheet.id,
        selectedSheet.sheet.properties.title,
      );
    } catch (error) {
      console.error("Error saving to sheet:", error);
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    save,
  };
}

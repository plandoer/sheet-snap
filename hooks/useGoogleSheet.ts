import { useSheet } from "@/context/SheetContext";
import { SheetFormData } from "@/models/form";
import { handleForm } from "@/utils/formUtils";
import { useState } from "react";

export function useSaveToGoogleSheet() {
  const { selectedSheet } = useSheet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function save(formData: SheetFormData): Promise<string> {
    if (isSubmitting) return Promise.reject("Submission in progress");

    if (!selectedSheet) {
      return Promise.reject("No sheet selected");
    }

    setIsSubmitting(true);
    try {
      return await handleForm(
        formData,
        selectedSheet.spreadsheet.id,
        selectedSheet.sheet.properties.title
      );
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    save,
    isSubmitting,
  };
}

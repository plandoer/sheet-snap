import { useSheet } from "@/context/SheetContext";
import { SheetFormData } from "@/models/form";
import { handleForm } from "@/utils/formUtils";
import { useState } from "react";
import { Alert } from "react-native";

export function useSaveToGoogleSheet() {
  const { selectedSheet } = useSheet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function save(formData: SheetFormData) {
    if (isSubmitting) return;

    if (!selectedSheet) {
      Alert.alert("Error", "Please select a Google Sheet first");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleForm(
        formData,
        selectedSheet.spreadsheet.id,
        selectedSheet.sheet.properties.title
      );
    } catch (error) {
      console.error("Error saving to Google Sheet:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    save,
    isSubmitting,
  };
}

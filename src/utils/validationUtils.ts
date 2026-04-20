export function validateNumericInput(
  text: string,
  keyboardType: "default" | "numeric" | "email-address" | "phone-pad",
  setValue: (text: string) => void,
) {
  if (keyboardType === "numeric") {
    // Allow only numbers and a single period
    let cleaned = text.replace(/[^0-9.]/g, "");

    // Prevent more than one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    setValue(cleaned);
  } else {
    setValue(text);
  }
}

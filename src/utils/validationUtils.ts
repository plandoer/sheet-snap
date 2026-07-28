import { Expense } from "@/models/expense";
import { SheetFormData } from "@/models/form";

export function getSantizedNumericValue(text: string): string {
  // Allow only numbers and a single period
  let cleaned = text.replace(/[^0-9.]/g, "");

  // Prevent more than one decimal point
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  return cleaned;
}

export function validateForm(formData: SheetFormData): Record<string, string> {
  const newErrors: Record<string, string> = {};
  if (!formData.selectedDate) {
    newErrors.selectedDate = "* Please select a date.";
  }
  if (!formData.amount.trim()) {
    newErrors.amount = "* Please enter an amount.";
  } else if (isNaN(Number(formData.amount.trim()))) {
    newErrors.amount = "* Amount must be a valid number.";
  }
  if (!formData.reason.trim()) {
    newErrors.reason = "* Please enter a reason.";
  }
  if (!formData.category) {
    newErrors.category = "* Please select a category.";
  }
  if (!formData.selectedPerson) {
    newErrors.selectedPerson = "* Please select a person.";
  }

  return newErrors;
}

export function validateExpenseForm(expense: Expense): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!expense.date) {
    errors.date = "* Please select a date.";
  }
  if (!expense.amount.trim()) {
    errors.amount = "* Please enter an amount.";
  }
  if (!expense.reason.trim()) {
    errors.reason = "* Please enter a reason.";
  }
  if (!expense.category) {
    errors.category = "* Please select a category.";
  }
  if (!expense.paidBy.name) {
    errors.paidBy = "* Please select who paid.";
  }

  if (!isSharesMatchingTotal(expense)) {
    errors.eachShares = "* Each shares do not match the total amount.";
  }
  return errors;
}

function isSharesMatchingTotal(expense: Expense): boolean {
  const totalShares = expense.eachShares.reduce(
    (sum, share) => sum + (parseFloat(share.amount) || 0),
    0,
  );
  const totalAmount = parseFloat(expense.amount) || 0;
  return totalShares === totalAmount;
}

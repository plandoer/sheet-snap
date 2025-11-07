export interface SheetFormData {
  selectedDate: Date;
  amount: string;
  reason: string;
  note: string;
  category: string;
  selectedPerson: string;
}

export function initFormData(): SheetFormData {
  return {
    selectedDate: new Date(),
    amount: "",
    reason: "",
    note: "",
    category: "",
    selectedPerson: "",
  };
}

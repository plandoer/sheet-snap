export class SheetFormData {
  selectedDate: Date = new Date();
  amount: string = "";
  reason: string = "";
  note: string = "";
  category: string = "";
  selectedPerson: string = "";
  splitInHalf: boolean = false;
}

export function initFormData(): SheetFormData {
  return new SheetFormData();
}

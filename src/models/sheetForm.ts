export class SheetForm {
  selectedDate: Date = new Date();
  amount: string = "";
  reason: string = "";
  note: string = "";
  category: string = "";
  selectedPerson: string = "";
  splitInHalf: boolean = false;
}

export function initFormData(): SheetForm {
  return new SheetForm();
}

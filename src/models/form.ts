export class SheetFormData {
  constructor(
    public selectedDate: Date,
    public amount: string,
    public reason: string,
    public note: string,
    public category: string,
    public selectedPerson: string,
    public splitInHalf: boolean = false,
  ) {}
}

export function initFormData(): SheetFormData {
  return new SheetFormData(new Date(), "", "", "", "", "", false);
}

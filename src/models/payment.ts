import { Expense } from "./expense";

export class Payment {
  personName: string = "";
  totalAmount: number = 0;
  personExpenses: Expense[] = [];
}

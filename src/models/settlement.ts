import { Expense } from "./expense";

export class Settlement {
  id: string = "";
  from: string = "";
  to: string = "";
  amount: number = 0;
  expenses: Expense[] = [];
}

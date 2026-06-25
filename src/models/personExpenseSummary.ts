import { Expense } from "./expense";

export class PersonExpenseSummary {
  name: string = "";
  totalPaid: number = 0;
  paidExpenses: Expense[] = [];
}

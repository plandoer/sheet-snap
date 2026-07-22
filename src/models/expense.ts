import { EachShare } from "./eachShare";
import { Person } from "./person";
import { SubAmount } from "./subAmount";

export class Expense {
  id: string = "";
  userId: string = "";
  date: Date = new Date();
  amount: string = "";
  subAmounts: SubAmount[] = [];
  reason: string = "";
  note: string = "";
  category: string = "";
  currency: string = "THB";
  paidBy: Person = new Person();
  splitInHalf: boolean = false;
  excluded: boolean = false;
  createdAt: string = "";
  eachShares: EachShare[] = [];
}

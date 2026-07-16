import { EachShare } from "./eachShare";
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
  paidBy: string = "";
  splitInHalf: boolean = false;
  excluded: boolean = false;
  createdAt: string = "";
  eachShares: EachShare[] = [];
}

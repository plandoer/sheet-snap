import { Category } from "./category";
import { EachShare } from "./eachShare";
import { Person } from "./person";
import { SubAmount } from "./subAmount";

export class Expense {
  id: string = "";
  userId: string = "";
  groupId: string = "";
  date: Date = new Date();
  amount: string = "";
  subAmounts: SubAmount[] = [];
  reason: string = "";
  note: string = "";
  category: Category = new Category();
  currency: string = "THB";
  paidBy: Person = new Person();
  splitInHalf: boolean = false;
  excluded: boolean = false;
  isActive: boolean = true;
  createdAt: string = "";
  eachShares: EachShare[] = [];
}

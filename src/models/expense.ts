import { SubAmount } from "./subAmount";

export class Expense {
  public id: string = "";
  public date: Date = new Date();
  public amount: number = 0;
  public subAmounts: SubAmount[] = [];
  public reason: string = "";
  public note: string = "";
  public category: string = "";
  public currency: string = "THB";
  public paidBy: string = "";
  public splitInHalf: boolean = false;
  public excluded: boolean = false;
}

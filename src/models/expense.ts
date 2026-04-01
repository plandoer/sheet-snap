import { SubAmount } from "./subAmount";

export class Expense {
  public id: string = "";
  public userId: string = "";
  public date: Date = new Date();
  public amount: string = "";
  public subAmounts: SubAmount[] = [];
  public reason: string = "";
  public note: string = "";
  public category: string = "";
  public currency: string = "";
  public paidBy: string = "";
  public splitInHalf: boolean = false;
  public excluded: boolean = false;
  public createdAt: string = "";
}

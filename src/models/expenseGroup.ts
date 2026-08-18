import { User } from "./user";

export class ExpenseGroup {
  id: string = "";
  name: string = "";
  owner: User = new User();
  members: User[] = [];
  createdAt: string = "";
}

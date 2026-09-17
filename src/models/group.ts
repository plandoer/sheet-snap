import { User } from "./user";

export class Group {
  id: string = "";
  name: string = "";
  owner: User = new User();
  members: User[] = [];
  createdAt: string = "";
  invitationToken: string | null = null;
}

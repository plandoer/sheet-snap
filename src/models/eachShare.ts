import { Person } from "./person";

export class EachShare {
  id: string = new Date().getTime().toString();
  person: Person = new Person();
  amount: string = "";
}

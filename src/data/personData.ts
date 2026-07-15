import { Person } from "@/models/person";

export const persons: Person[] = [
  new Person(1, "Ye"),
  new Person(2, "Pont"),
  new Person(3, "Kofi"),
];

export const personsWithBothOption: Person[] = [
  ...persons,
  new Person(4, "Both"),
];

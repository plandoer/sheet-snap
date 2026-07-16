import { Person } from "@/models/person";

export const persons: Person[] = [
  { id: 1, name: "Ye" },
  { id: 2, name: "Pont" },
  { id: 3, name: "Kofi" },
];

export const personsWithBothOption: Person[] = [
  ...persons,
  { id: 4, name: "Both" },
];

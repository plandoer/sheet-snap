import { Person } from "@/models/person";

export const persons: Person[] = [
  { id: "1", name: "Ye", createdAt: new Date() },
  { id: "2", name: "Pont", createdAt: new Date() },
  { id: "3", name: "Kofi", createdAt: new Date() },
];

export const personsWithBothOption: Person[] = [
  ...persons,
  { id: "4", name: "Both", createdAt: new Date() },
];

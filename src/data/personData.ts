import { Person } from "@/models/person";

export const persons: Person[] = [
  { id: "1", name: "Ye", createdAt: new Date(), groupId: "" },
  { id: "2", name: "Pont", createdAt: new Date(), groupId: "" },
];

export const personsWithBothOption: Person[] = [
  ...persons,
  { id: "4", name: "Both", createdAt: new Date(), groupId: "" },
];

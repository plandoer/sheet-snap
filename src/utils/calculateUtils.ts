import { SubAmount } from "@/models/subAmount";

export default function getTotalAmount(subAmounts: SubAmount[]): string {
  const sum = subAmounts.reduce(
    (total, s) => total + (parseFloat(s.amount) || 0),
    0,
  );
  return sum.toString();
}

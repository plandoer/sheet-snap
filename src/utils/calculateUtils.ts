import { SubAmount } from "@/models/subAmount";

export default function getTotalAmount(subAmounts: SubAmount[]): string {
  const sum = subAmounts.reduce(
    (total, s) => total + (parseFloat(s.amount) || 0),
    0,
  );
  return sum.toString();
}

export function isNonTerminatingDecimal(
  numerator: number,
  denominator: number,
): boolean {
  if (denominator === 0) return false;
  if (numerator === 0) return false;

  const g = gcd(Math.abs(numerator), Math.abs(denominator));
  let d = Math.abs(denominator) / g;

  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;

  return d !== 1;
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Format selected date as "26 Oct, 2025"
export function formatDate(date: Date): string {
  return `${date.getDate()} ${date.toLocaleString("default", {
    month: "short",
  })}, ${date.getFullYear()}`;
}

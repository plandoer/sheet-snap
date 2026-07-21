// Format selected date as "26 Oct, 2025"
export function formatDate(date: Date): string {
  return `${date.getDate()} ${date.toLocaleString("default", {
    month: "short",
  })}, ${date.getFullYear()}`;
}

// Format a date as a relative time, e.g. "1d ago", "2h ago", "Just now"
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label} ago`;
    }
  }

  return "Just now";
}

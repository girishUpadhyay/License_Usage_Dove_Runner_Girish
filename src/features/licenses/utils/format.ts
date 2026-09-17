export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** "in 5 days" / "3 days ago" / "today" — used to surface renewal urgency at a glance. */
export function formatRelativeDays(iso: string): string {
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((new Date(iso).getTime() - Date.now()) / dayMs);

  if (diffDays === 0) return "today";
  if (diffDays > 0) return `in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"} ago`;
}

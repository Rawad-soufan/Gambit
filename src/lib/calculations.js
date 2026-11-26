export function estimatedMax(lift) {
  return lift.reps === 1 ? lift.weightKg : lift.weightKg * (1 + lift.reps / 30);
}
export function volume(lift) {
  return lift.weightKg * lift.reps * lift.sets;
}
export function newestFirst(entries) {
  return [...entries].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
}
export function searchEntries(entries, query, filter) {
  const term = query.trim().toLowerCase();
  return newestFirst(entries).filter(
    (entry) =>
      (filter === "all" || entry.exercise === filter) &&
      `${entry.exercise === "bench" ? "bench press" : entry.exercise} ${entry.notes}`
        .toLowerCase()
        .includes(term),
  );
}
export const formatKg = (value) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 1 });
export function displayDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
export function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/**
 * Lightweight date helpers — no external deps needed.
 */

const UNITS = [
  { label: "year",   ms: 365.25 * 24 * 60 * 60 * 1000 },
  { label: "month",  ms: 30.44  * 24 * 60 * 60 * 1000 },
  { label: "week",   ms: 7      * 24 * 60 * 60 * 1000 },
  { label: "day",    ms: 24     * 60 * 60 * 1000 },
  { label: "hour",   ms: 60     * 60 * 1000 },
  { label: "minute", ms: 60     * 1000 },
  { label: "second", ms: 1000 },
];

/**
 * formatDistanceToNow("2026-09-15T10:30:00Z", { addSuffix: true })
 * → "5 days ago"
 */
export function formatDistanceToNow(date, { addSuffix = false } = {}) {
  const diff = Date.now() - new Date(date).getTime();
  const abs = Math.abs(diff);

  for (const { label, ms } of UNITS) {
    const val = Math.round(abs / ms);
    if (val >= 1) {
      const str = `${val} ${label}${val !== 1 ? "s" : ""}`;
      if (!addSuffix) return str;
      return diff >= 0 ? `${str} ago` : `in ${str}`;
    }
  }
  return "just now";
}

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

/**
 * format(new Date(), "d MMM yyyy, HH:mm")  → "20 Sep 2026, 14:30"
 */
export function format(date, fmt) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return fmt
    .replace("d",    d.getDate())
    .replace("MMM",  MONTHS[d.getMonth()])
    .replace("MM",   pad(d.getMonth() + 1))
    .replace("yyyy", d.getFullYear())
    .replace("HH",   pad(d.getHours()))
    .replace("mm",   pad(d.getMinutes()));
}

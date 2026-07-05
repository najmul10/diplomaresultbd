/**
 * Helpers for BTEB grading & display.
 */

export function gradeColor(grade: string): {
  bg: string;
  text: string;
  ring: string;
  label: string;
} {
  switch (grade) {
    case "A+":
      return {
        bg: "bg-emerald-500/15",
        text: "text-emerald-700 dark:text-emerald-300",
        ring: "ring-emerald-500/30",
        label: "Excellent",
      };
    case "A":
      return {
        bg: "bg-green-500/15",
        text: "text-green-700 dark:text-green-300",
        ring: "ring-green-500/30",
        label: "Very Good",
      };
    case "A-":
      return {
        bg: "bg-teal-500/15",
        text: "text-teal-700 dark:text-teal-300",
        ring: "ring-teal-500/30",
        label: "Good",
      };
    case "B":
      return {
        bg: "bg-amber-500/15",
        text: "text-amber-700 dark:text-amber-300",
        ring: "ring-amber-500/30",
        label: "Satisfactory",
      };
    case "C":
      return {
        bg: "bg-orange-500/15",
        text: "text-orange-700 dark:text-orange-300",
        ring: "ring-orange-500/30",
        label: "Pass",
      };
    case "D":
      return {
        bg: "bg-rose-500/15",
        text: "text-rose-700 dark:text-rose-300",
        ring: "ring-rose-500/30",
        label: "Marginal Pass",
      };
    case "F":
      return {
        bg: "bg-red-500/15",
        text: "text-red-700 dark:text-red-300",
        ring: "ring-red-500/30",
        label: "Fail",
      };
    default:
      return {
        bg: "bg-muted",
        text: "text-muted-foreground",
        ring: "ring-border",
        label: "",
      };
  }
}

export function gpaColor(gpa: number | undefined | null): string {
  if (typeof gpa !== "number" || isNaN(gpa)) return "text-muted-foreground";
  if (gpa >= 3.5) return "text-emerald-600 dark:text-emerald-400";
  if (gpa >= 3) return "text-teal-600 dark:text-teal-400";
  if (gpa >= 2.5) return "text-amber-600 dark:text-amber-400";
  if (gpa >= 2) return "text-orange-600 dark:text-orange-400";
  if (gpa > 0) return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

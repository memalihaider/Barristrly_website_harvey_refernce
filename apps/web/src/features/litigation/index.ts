/** Phase 6 — Thin litigation helpers */

export type DeadlineStatus = "open" | "done" | "missed" | "cancelled";
export type DeadlineKind =
  | "hearing"
  | "filing"
  | "limitation"
  | "obligation"
  | "general";

export interface DeadlineAlert {
  title: string;
  dueAt: string;
  daysRemaining: number;
  status: DeadlineStatus;
  kind: DeadlineKind;
}

export function daysUntil(dueAt: Date, now = new Date()): number {
  return Math.ceil((dueAt.getTime() - now.getTime()) / 86400000);
}

export function toDeadlineAlert(row: {
  title: string;
  due_at: string;
  status: string;
  kind: string;
}): DeadlineAlert {
  return {
    title: row.title,
    dueAt: row.due_at,
    daysRemaining: daysUntil(new Date(row.due_at)),
    status: row.status as DeadlineStatus,
    kind: row.kind as DeadlineKind,
  };
}

export function sortDeadlinesByDue<T extends { due_at: string }>(rows: T[]): T[] {
  return [...rows].sort(
    (a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime()
  );
}

export const DEADLINE_KINDS: DeadlineKind[] = [
  "hearing",
  "filing",
  "limitation",
  "obligation",
  "general",
];

export const DEADLINE_STATUSES: DeadlineStatus[] = [
  "open",
  "done",
  "missed",
  "cancelled",
];

/** Phase 3 — Thin Practice Core / CRM mapped to live leads + profiles */

export const PIPELINE_STATUSES = [
  "open",
  "matched",
  "screening",
  "consulting",
  "engaged",
  "completed",
  "cancelled",
] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

/** Allowed lead status transitions for lawyer CRM. */
const ALLOWED: Record<PipelineStatus, PipelineStatus[]> = {
  open: ["matched", "screening", "cancelled"],
  matched: ["screening", "consulting", "cancelled"],
  screening: ["consulting", "matched", "cancelled"],
  consulting: ["engaged", "completed", "cancelled"],
  engaged: ["completed", "consulting", "cancelled"],
  completed: [],
  cancelled: ["open", "matched"],
};

export function canTransitionLead(
  from: string,
  to: string
): boolean {
  if (!(PIPELINE_STATUSES as readonly string[]).includes(from)) return false;
  if (!(PIPELINE_STATUSES as readonly string[]).includes(to)) return false;
  return ALLOWED[from as PipelineStatus].includes(to as PipelineStatus);
}

export const MEETING_STATUSES = [
  "scheduled",
  "ongoing",
  "completed",
  "missed",
] as const;

export type MeetingStatus = (typeof MEETING_STATUSES)[number];

export function canTransitionMeeting(from: string, to: string): boolean {
  if (!(MEETING_STATUSES as readonly string[]).includes(to)) return false;
  if (from === to) return true;
  const allowed: Record<MeetingStatus, MeetingStatus[]> = {
    scheduled: ["ongoing", "completed", "missed"],
    ongoing: ["completed", "missed"],
    completed: [],
    missed: ["scheduled"],
  };
  return allowed[from as MeetingStatus]?.includes(to as MeetingStatus) ?? false;
}

export type CrmClientSummary = {
  clientId: string;
  displayLabel: string;
  contactRevealed: boolean;
  leadCount: number;
  matterCount: number;
  latestStatus: string | null;
  latestLeadId: string | null;
};

export function initialsFromName(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 3)
      .toUpperCase() || "LW"
  );
}

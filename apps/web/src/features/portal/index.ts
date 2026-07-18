/** Phase 2 — Thin client collaboration portal (matter = engaged lead) */

import { maskDisplayName } from "@/features/marketplace/consent";

export const MATTER_STATUSES = [
  "consulting",
  "engaged",
  "completed",
] as const;

export type MatterStatus = (typeof MATTER_STATUSES)[number];

export interface PortalMatterSummary {
  id: string;
  title: string;
  status: string;
  category: string | null;
  counterpartLabel: string;
  contactRevealed: boolean;
  assignedLawyerId: string | null;
  clientId: string;
  nextAction?: string;
  updatedAt?: string;
}

export interface LeadRow {
  id: string;
  client_id: string;
  assigned_lawyer_id: string | null;
  status: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function isMatterStatus(status: string): boolean {
  return (MATTER_STATUSES as readonly string[]).includes(status);
}

export function matterTitle(lead: Pick<LeadRow, "category" | "description">): string {
  const cat = lead.category?.trim() || "Matter";
  const preview = lead.description?.trim().slice(0, 48) || "Untitled";
  return `${cat}: ${preview}${lead.description && lead.description.length > 48 ? "…" : ""}`;
}

export function nextActionForStatus(status: string): string {
  switch (status) {
    case "consulting":
      return "Complete consult and confirm engagement";
    case "engaged":
      return "Collaborate on notes, messages, and billing";
    case "completed":
      return "Review closed matter history";
    default:
      return "Continue marketplace flow";
  }
}

export function toMatterSummary(
  lead: LeadRow,
  opts: {
    viewerRole: "client" | "lawyer" | string;
    counterpartName: string | null;
    contactRevealed: boolean;
  }
): PortalMatterSummary {
  const counterpartLabel = maskDisplayName(
    opts.counterpartName,
    opts.contactRevealed
  );
  return {
    id: lead.id,
    title: matterTitle(lead),
    status: lead.status,
    category: lead.category,
    counterpartLabel,
    contactRevealed: opts.contactRevealed,
    assignedLawyerId: lead.assigned_lawyer_id,
    clientId: lead.client_id,
    nextAction: nextActionForStatus(lead.status),
    updatedAt: lead.updated_at,
  };
}

export function emptyPortalState(): {
  matters: PortalMatterSummary[];
  unreadMessages: number;
} {
  return { matters: [], unreadMessages: 0 };
}

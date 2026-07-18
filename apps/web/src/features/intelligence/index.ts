/** Phase 8 — Thin intelligence helpers (insights, next actions, briefs) */

import type { PlatformKpis } from "@/features/enterprise";

export type InsightRecommendation = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  priority: "high" | "medium" | "low";
};

export type LawyerInsights = {
  matchesSuggested: number;
  matchesAccepted: number;
  meetingsBooked: number;
  meetingsCompleted: number;
  conversionMatchToMeeting: number;
  escrowHeld: number;
  openDeadlines: number;
  stalePipelineLeads: number;
  recommendations: InsightRecommendation[];
};

export function buildLawyerInsights(input: {
  matches: { status: string }[];
  meetings: { status: string }[];
  escrowsHeld: number;
  openDeadlines: number;
  stalePipelineLeads: number;
}): LawyerInsights {
  const matchesSuggested = input.matches.length;
  const matchesAccepted = input.matches.filter((m) =>
    ["accepted", "engaged", "contacted"].includes(m.status)
  ).length;
  const meetingsBooked = input.meetings.length;
  const meetingsCompleted = input.meetings.filter(
    (m) => m.status === "completed"
  ).length;
  const conversionMatchToMeeting =
    matchesSuggested > 0
      ? Number((meetingsBooked / matchesSuggested).toFixed(3))
      : 0;

  const recommendations: InsightRecommendation[] = [];

  if (input.stalePipelineLeads > 0) {
    recommendations.push({
      id: "stale_pipeline",
      title: "Advance stale pipeline leads",
      detail: `${input.stalePipelineLeads} lead(s) idle 7+ days — update status or follow up.`,
      href: "/lawyer/leads",
      priority: "high",
    });
  }
  if (input.openDeadlines > 0) {
    recommendations.push({
      id: "open_deadlines",
      title: "Clear upcoming deadlines",
      detail: `${input.openDeadlines} open deadline(s) need attention.`,
      href: "/lawyer/deadlines",
      priority: "high",
    });
  }
  if (input.escrowsHeld > 0) {
    recommendations.push({
      id: "escrow_confirm",
      title: "Confirm escrow releases",
      detail: `${input.escrowsHeld} held escrow(s) await dual confirmation.`,
      href: "/lawyer/matters",
      priority: "medium",
    });
  }
  if (conversionMatchToMeeting < 0.25 && matchesSuggested >= 3) {
    recommendations.push({
      id: "conversion",
      title: "Improve match-to-booking conversion",
      detail: `Only ${(conversionMatchToMeeting * 100).toFixed(0)}% of matches become meetings — respond faster on new leads.`,
      href: "/lawyer/leads",
      priority: "medium",
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      id: "profile",
      title: "Keep profile match-ready",
      detail: "Practice areas and jurisdictions drive ranking — keep them current.",
      href: "/lawyer/profile",
      priority: "low",
    });
  }

  return {
    matchesSuggested,
    matchesAccepted,
    meetingsBooked,
    meetingsCompleted,
    conversionMatchToMeeting,
    escrowHeld: input.escrowsHeld,
    openDeadlines: input.openDeadlines,
    stalePipelineLeads: input.stalePipelineLeads,
    recommendations: recommendations.slice(0, 5),
  };
}

export type NextBestAction = {
  id: string;
  title: string;
  detail: string;
  href: string;
  priority: "high" | "medium" | "low";
  leadId?: string;
};

/** @deprecated Use NextBestAction */
export type ClientNextAction = NextBestAction;

const PRIORITY_ORDER: Record<NextBestAction["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function rankNextBestActions(actions: NextBestAction[]): {
  primary: NextBestAction | null;
  secondary: NextBestAction[];
  actions: NextBestAction[];
} {
  const sorted = [...actions].sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    return a.id.localeCompare(b.id);
  });
  const primary = sorted[0] ?? null;
  const secondary = sorted.slice(1, 3);
  return { primary, secondary, actions: sorted };
}

export function toLawyerNextBestActions(
  insights: LawyerInsights
): ReturnType<typeof rankNextBestActions> {
  const actions: NextBestAction[] = insights.recommendations.map((r) => ({
    id: r.id,
    title: r.title,
    detail: r.detail,
    href: r.href ?? "/lawyer",
    priority: r.priority,
  }));
  return rankNextBestActions(actions);
}

export type ClientNbaInput = {
  leads: { id: string; status: string }[];
  /** Per matched lead: client still needs to consent / reveal */
  pendingConsentLeadIds: string[];
  /** Leads with consent ready but no meeting yet */
  bookable: { leadId: string; lawyerId: string | null }[];
  /** Meetings exist but escrow not created / not funded for lead */
  needsEscrowFunding: { leadId: string; lawyerId: string | null }[];
  /** Held escrow awaiting client confirm */
  needsEscrowConfirm: { leadId: string }[];
  /** Engaged matters that may need a note */
  mattersNeedingUpdate: { id: string }[];
  upcomingMeetings: number;
  /** Optional: scope to one lead (matter detail) */
  leadIdFilter?: string;
};

export function buildClientNextActions(
  input: ClientNbaInput
): NextBestAction[] {
  const filter = input.leadIdFilter;
  const leads = filter
    ? input.leads.filter((l) => l.id === filter)
    : input.leads;

  const openLeads = leads.filter((l) => l.status === "open");
  const engagedMatters = leads.filter((l) =>
    ["engaged", "consulting", "completed"].includes(l.status)
  );

  const actions: NextBestAction[] = [];

  if (leads.length === 0 && !filter) {
    actions.push({
      id: "start_intake",
      title: "Start AI intake",
      detail: "Describe your legal issue to begin matching.",
      href: "/client/intake",
      priority: "high",
    });
    return actions;
  }

  for (const lead of openLeads) {
    actions.push({
      id: `run_match:${lead.id}`,
      title: "Find lawyer matches",
      detail: "Your intake is ready — run conflict-safe matching.",
      href: `/client/matches?leadId=${lead.id}`,
      priority: "high",
      leadId: lead.id,
    });
  }

  for (const leadId of input.pendingConsentLeadIds) {
    if (filter && leadId !== filter) continue;
    if (!leads.some((l) => l.id === leadId)) continue;
    actions.push({
      id: `dual_consent:${leadId}`,
      title: "Complete dual consent",
      detail: "Grant consent so identities can be revealed before booking.",
      href: `/client/matches?leadId=${leadId}`,
      priority: "high",
      leadId,
    });
  }

  for (const b of input.bookable) {
    if (filter && b.leadId !== filter) continue;
    const params = new URLSearchParams({ leadId: b.leadId });
    if (b.lawyerId) params.set("lawyerId", b.lawyerId);
    actions.push({
      id: `book_consult:${b.leadId}`,
      title: "Book a consultation",
      detail: "Consent is in place — schedule your consult.",
      href: `/client/bookings?${params.toString()}`,
      priority: "high",
      leadId: b.leadId,
    });
  }

  for (const e of input.needsEscrowFunding) {
    if (filter && e.leadId !== filter) continue;
    const params = new URLSearchParams({ leadId: e.leadId });
    if (e.lawyerId) params.set("lawyerId", e.lawyerId);
    actions.push({
      id: `pay_escrow:${e.leadId}`,
      title: "Fund consultation escrow",
      detail: "Pay escrow to lock in your consult.",
      href: `/client/bookings?${params.toString()}`,
      priority: "high",
      leadId: e.leadId,
    });
  }

  for (const e of input.needsEscrowConfirm) {
    if (filter && e.leadId !== filter) continue;
    actions.push({
      id: `confirm_escrow:${e.leadId}`,
      title: "Confirm escrow release",
      detail: "Funds are held — confirm release when the consult is complete.",
      href: `/client/matters/${e.leadId}`,
      priority: "medium",
      leadId: e.leadId,
    });
  }

  if (input.upcomingMeetings > 0 && !filter) {
    actions.push({
      id: "upcoming_meeting",
      title: "Prepare for upcoming consult",
      detail: `${input.upcomingMeetings} meeting(s) scheduled.`,
      href: "/client/bookings",
      priority: "medium",
    });
  }

  for (const m of input.mattersNeedingUpdate) {
    if (filter && m.id !== filter) continue;
    actions.push({
      id: `matter_note:${m.id}`,
      title: "Update your matter",
      detail: "Add a note or message on an active matter.",
      href: `/client/matters/${m.id}`,
      priority: "low",
      leadId: m.id,
    });
  }

  if (actions.length === 0) {
    if (filter) {
      actions.push({
        id: `review_matter:${filter}`,
        title: "Review this matter",
        detail: "Check timeline, documents, and billing.",
        href: `/client/matters/${filter}`,
        priority: "low",
        leadId: filter,
      });
    } else if (engagedMatters.length > 0) {
      actions.push({
        id: "review_matters",
        title: "Review your matters",
        detail: "Catch up on notes, messages, and billing.",
        href: "/client/matters",
        priority: "low",
      });
    } else {
      actions.push({
        id: "start_intake",
        title: "Start AI intake",
        detail: "Describe your legal issue to begin matching.",
        href: "/client/intake",
        priority: "medium",
      });
    }
  }

  return actions.slice(0, 8);
}


export type LawyerOutcomeStats = {
  matchCount: number;
  acceptedCount: number;
  meetingCount: number;
  completedCount: number;
  outcomeFit: number;
};

/** Default mid score when sparse history. */
export function computeOutcomeFit(stats: {
  matchCount: number;
  acceptedCount: number;
  meetingCount: number;
  completedCount: number;
}): number {
  if (stats.matchCount + stats.meetingCount < 2) return 0.5;
  const acceptRate =
    stats.matchCount > 0 ? stats.acceptedCount / stats.matchCount : 0.5;
  const completeRate =
    stats.meetingCount > 0
      ? stats.completedCount / stats.meetingCount
      : 0.5;
  const bookRate =
    stats.matchCount > 0 ? stats.meetingCount / stats.matchCount : 0.5;
  return Number(
    Math.min(1, acceptRate * 0.35 + completeRate * 0.35 + bookRate * 0.3).toFixed(
      4
    )
  );
}

export function buildOutcomeStatsMap(
  matches: { lawyer_id: string; status: string }[],
  meetings: { lawyer_id: string; status: string }[]
): Map<string, LawyerOutcomeStats> {
  const map = new Map<string, LawyerOutcomeStats>();

  const ensure = (id: string) => {
    let row = map.get(id);
    if (!row) {
      row = {
        matchCount: 0,
        acceptedCount: 0,
        meetingCount: 0,
        completedCount: 0,
        outcomeFit: 0.5,
      };
      map.set(id, row);
    }
    return row;
  };

  for (const m of matches) {
    const row = ensure(m.lawyer_id);
    row.matchCount += 1;
    if (["accepted", "engaged", "contacted"].includes(m.status)) {
      row.acceptedCount += 1;
    }
  }
  for (const m of meetings) {
    const row = ensure(m.lawyer_id);
    row.meetingCount += 1;
    if (m.status === "completed") row.completedCount += 1;
  }

  for (const [id, row] of map) {
    row.outcomeFit = computeOutcomeFit(row);
    map.set(id, row);
  }
  return map;
}

export type AdminInsightTip = {
  id: string;
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
};

export function buildAdminOptimizationTips(kpis: PlatformKpis): AdminInsightTip[] {
  const tips: AdminInsightTip[] = [];

  if (kpis.pendingLawyerApprovals > 0) {
    tips.push({
      id: "approvals",
      title: "Clear lawyer approval queue",
      detail: `${kpis.pendingLawyerApprovals} pending — verified lawyers expand the match pool.`,
      priority: "high",
    });
  }
  if (kpis.escrowHeld > 0) {
    tips.push({
      id: "escrow",
      title: "Monitor held escrow",
      detail: `${kpis.escrowHeld} held account(s) — dual confirm may be stalled.`,
      priority: "medium",
    });
  }
  if (kpis.leadsOpen > kpis.leadsMatched && kpis.leadsOpen > 0) {
    tips.push({
      id: "match_funnel",
      title: "Open leads awaiting match",
      detail: `${kpis.leadsOpen} open vs ${kpis.leadsMatched} matched — nudge clients to rematch.`,
      priority: "medium",
    });
  }
  if (kpis.pendingAds > 0) {
    tips.push({
      id: "ads",
      title: "Moderate pending ads",
      detail: `${kpis.pendingAds} ad(s) waiting review.`,
      priority: "low",
    });
  }
  if (kpis.lawyers < 3) {
    tips.push({
      id: "supply",
      title: "Grow lawyer supply",
      detail: "Few verified lawyers — marketplace conversion will stay thin.",
      priority: "high",
    });
  }
  if (tips.length === 0) {
    tips.push({
      id: "healthy",
      title: "Marketplace healthy",
      detail: "No urgent optimization flags from current KPIs.",
      priority: "low",
    });
  }
  return tips.slice(0, 6);
}

export function buildExecutiveBrief(kpis: PlatformKpis): string[] {
  return [
    `Platform users: ${kpis.usersTotal} (${kpis.clients} clients, ${kpis.lawyers} lawyers).`,
    `Lead funnel: ${kpis.leadsOpen} open, ${kpis.leadsMatched} matched, ${kpis.leadsEngaged} engaged+.`,
    `Meetings: ${kpis.meetingsTotal}; payments succeeded: ${kpis.paymentsSucceeded}; GMV: ${kpis.gmv}.`,
    `Escrow: ${kpis.escrowHeld} held, ${kpis.escrowReleased} released.`,
    `Ops: ${kpis.pendingLawyerApprovals} pending lawyer approvals, ${kpis.pendingAds} pending ads, ${kpis.coiScreens} COI screens.`,
  ];
}

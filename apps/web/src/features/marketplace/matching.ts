import type { PracticeArea, JurisdictionCode } from "@/lib/ontology";

export interface MatchCandidate {
  lawyerId: string;
  score: number;
  rank: number;
  explanation: {
    practiceFit: number;
    jurisdictionFit: number;
    availability: number;
    reputation: number;
    outcomeFit: number;
  };
}

export interface MatchInput {
  practiceArea?: PracticeArea;
  jurisdiction?: JurisdictionCode;
  candidates: Array<{
    id: string;
    practiceAreas: string[];
    jurisdictions: string[];
    rating: number;
    isAcceptingLeads: boolean;
    /** Live outcome signal 0–1; defaults to 0.5 when sparse. */
    outcomeFit?: number;
  }>;
}

/**
 * Deterministic ranking with practice / jurisdiction / reputation / outcomeFit.
 * Phase 8 adds outcomeFit from historical match & meeting outcomes.
 */
export function rankLawyerMatches(input: MatchInput): MatchCandidate[] {
  const scored = input.candidates
    .filter((c) => c.isAcceptingLeads)
    .map((c) => {
      const practiceFit = input.practiceArea
        ? c.practiceAreas.includes(input.practiceArea)
          ? 1
          : 0.2
        : 0.5;
      const jurisdictionFit = input.jurisdiction
        ? c.jurisdictions.includes(input.jurisdiction)
          ? 1
          : 0.2
        : 0.5;
      const reputation = Math.min(1, (c.rating || 0) / 5);
      const outcomeFit =
        typeof c.outcomeFit === "number" && Number.isFinite(c.outcomeFit)
          ? Math.min(1, Math.max(0, c.outcomeFit))
          : 0.5;
      const availability = c.isAcceptingLeads ? 1 : 0;
      const score =
        practiceFit * 0.35 +
        jurisdictionFit * 0.25 +
        reputation * 0.15 +
        outcomeFit * 0.2 +
        availability * 0.05;
      return {
        lawyerId: c.id,
        score: Number(score.toFixed(4)),
        explanation: {
          practiceFit,
          jurisdictionFit,
          availability,
          reputation: Number(reputation.toFixed(4)),
          outcomeFit: Number(outcomeFit.toFixed(4)),
        },
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored.map((s, i) => ({ ...s, rank: i + 1 }));
}

export function coiPartyHash(parts: string[]): string {
  const normalized = parts
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join("|");
  let h = 0;
  for (let i = 0; i < normalized.length; i++) {
    h = (h * 31 + normalized.charCodeAt(i)) >>> 0;
  }
  return `coi_${h.toString(16)}`;
}

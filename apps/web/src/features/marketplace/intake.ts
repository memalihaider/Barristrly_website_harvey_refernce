import { z } from "zod";
import {
  JURISDICTIONS,
  PRACTICE_AREAS,
  URGENCY_LEVELS,
} from "@/lib/ontology";

export const intakeRequestSchema = z.object({
  message: z.string().min(10).max(20000),
  locale: z.string().default("en"),
});

export type IntakeRequest = z.infer<typeof intakeRequestSchema>;

export const structuredIntakeSchema = z.object({
  jurisdiction: z.enum(JURISDICTIONS).optional(),
  practiceArea: z.enum(PRACTICE_AREAS).optional(),
  urgency: z.enum(URGENCY_LEVELS).default("medium"),
  summary: z.string(),
  facts: z.record(z.string(), z.unknown()).default({}),
});

export type StructuredIntake = z.infer<typeof structuredIntakeSchema>;

/** Rule-based stub extractor until Gemini gateway is wired. */
export function extractIntakeStub(message: string): StructuredIntake {
  const lower = message.toLowerCase();
  let practiceArea: StructuredIntake["practiceArea"];
  if (lower.includes("employ") || lower.includes("terminat")) {
    practiceArea = "employment";
  } else if (lower.includes("property") || lower.includes("lease")) {
    practiceArea = "real_estate";
  } else if (lower.includes("contract") || lower.includes("commercial")) {
    practiceArea = "commercial";
  } else if (lower.includes("family") || lower.includes("divorce")) {
    practiceArea = "family";
  }

  let jurisdiction: StructuredIntake["jurisdiction"];
  if (lower.includes("difc")) jurisdiction = "AE-DIFC";
  else if (lower.includes("adgm")) jurisdiction = "AE-ADGM";
  else if (lower.includes("dubai")) jurisdiction = "AE-DU";
  else if (lower.includes("abu dhabi")) jurisdiction = "AE-AZ";
  else if (lower.includes("pakistan") || lower.includes("karachi")) {
    jurisdiction = "PK";
  } else if (lower.includes("london") || lower.includes("uk")) {
    jurisdiction = "GB-LON";
  }

  const urgency =
    lower.includes("urgent") || lower.includes("asap")
      ? "high"
      : ("medium" as const);

  return {
    jurisdiction,
    practiceArea,
    urgency,
    summary: message.slice(0, 280),
    facts: {},
  };
}

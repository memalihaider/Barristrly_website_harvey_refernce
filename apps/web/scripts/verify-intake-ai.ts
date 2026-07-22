/**
 * Verify intake classifier fallbacks + questionnaire completion gates.
 * Run: pnpm exec tsx apps/web/scripts/verify-intake-ai.ts
 * (from repo root) or: npx tsx scripts/verify-intake-ai.ts from apps/web
 */
import {
  createInitialSession,
  draftToStructuredIntake,
  processChatTurn,
} from "../src/lib/intake/chat-engine";
import { matchFaq } from "../src/lib/intake/faq-corpus";
import { INTAKE_STEP_SEQUENCE } from "../src/lib/intake/questionnaire";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

async function main() {
  // FAQ fallback without LLM
  const faq = matchFaq("Will lawyers see my phone?");
  assert(faq && /phone|email|hidden|mask/i.test(faq), "FAQ privacy answer missing");

  let session = createInitialSession("verify");
  let turn = await processChatTurn(session, { type: "start" });
  session = turn.session;
  assert(turn.quickReplies && turn.quickReplies.length > 5, "Expected category chips");
  assert(!turn.complete, "Should not complete on start");

  // Ask process question mid-flow — stay on same step
  const stepBefore = session.intakeStep;
  turn = await processChatTurn(session, {
    type: "message",
    text: "Will lawyers see my phone?",
  });
  session = turn.session;
  assert(session.intakeStep === stepBefore, "Q&A must not advance step");
  assert(
    turn.botMessages.some((m) => /mask|hidden|phone|email/i.test(m)),
    "Expected privacy answer in bot messages"
  );
  assert(turn.quickReplies && turn.quickReplies.length > 0, "Options should remain");

  // Chip path: pick first category
  const category = turn.quickReplies![0]!;
  turn = await processChatTurn(session, { type: "quick_reply", text: category });
  session = turn.session;
  assert(session.intakeDraft.primaryCategory === category, "Category not applied");
  assert(turn.quickReplies && turn.quickReplies.length > 0, "Sub-category chips expected");

  // Drive remaining steps via chips / slots
  let guard = 0;
  while (session.state !== "complete" && guard < 40) {
    guard++;
    const opts = turn.quickReplies;
    if (opts && opts.length > 0) {
      const pick =
        opts.find((o) => o.startsWith("I acknowledge")) ??
        opts.find((o) => o === "No") ??
        opts[0]!;
      turn = await processChatTurn(session, { type: "quick_reply", text: pick });
    } else {
      // free-text slot
      const step = INTAKE_STEP_SEQUENCE[session.intakeStep];
      const filler =
        step?.kind === "lead_email"
          ? "client@example.com"
          : step?.kind === "lead_phone"
            ? "+971500000000"
            : step?.kind === "lead_name"
              ? "Verify Client LLC"
              : "Brief matter summary for verification script.";
      turn = await processChatTurn(session, { type: "message", text: filler });
    }
    session = turn.session;
  }

  assert(session.state === "complete", `Expected complete, got ${session.state}`);
  assert(turn.complete, "complete flag false");
  const structured = draftToStructuredIntake(session.intakeDraft);
  assert(structured.practiceArea, "practiceArea mapped");
  assert(structured.facts?.masked === true, "masked flag required");
  assert(structured.facts?.leadMaskingConsent === true, "consent required");

  console.log("verify-intake-ai: ok");
  console.log({
    practiceArea: structured.practiceArea,
    jurisdiction: structured.jurisdiction,
    urgency: structured.urgency,
    summary: structured.summary.slice(0, 80),
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

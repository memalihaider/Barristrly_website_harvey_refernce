/**
 * Background jobs skeleton — Redis/BullMQ wiring lands when REDIS_URL is set.
 * See doc/BACKGROUND_JOBS.md and doc/EVENT_DRIVEN_ARCHITECTURE.md
 */

export type JobName =
  | "send_notification"
  | "process_outbox"
  | "run_coi_screen"
  | "rank_lawyer_matches"
  | "stripe_reconcile"
  | "ai_intake_extract"
  | "webhook_deliver";

export interface EnqueueOptions {
  delayMs?: number;
  priority?: number;
}

export async function enqueueJob(
  name: JobName,
  payload: Record<string, unknown>,
  _options?: EnqueueOptions
): Promise<{ queued: boolean; name: JobName }> {
  if (!process.env.REDIS_URL) {
    // Dev fallback: no-op queue until Redis is provisioned
    return { queued: false, name };
  }
  // BullMQ worker integration placeholder
  void payload;
  return { queued: true, name };
}

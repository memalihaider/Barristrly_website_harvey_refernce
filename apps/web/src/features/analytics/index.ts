/** Phase 7 — Analytics event emit (persists when Supabase configured) */
import {
  createServiceClient,
  isDbConfigured,
} from "@/lib/db/client";

export async function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
  userId?: string | null
): Promise<void> {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", eventName, properties);
  }

  if (!isDbConfigured()) {
    return;
  }

  try {
    const admin = createServiceClient();
    await admin.from("analytics_events").insert({
      event_name: eventName,
      user_id: userId ?? null,
      properties,
    });
  } catch {
    // best-effort — never fail the caller
  }
}

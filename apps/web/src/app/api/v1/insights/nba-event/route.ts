import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { getSessionUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { trackEvent } from "@/features/analytics";

const schema = z.object({
  actionId: z.string().min(1).max(200),
  event: z.enum(["click", "dismiss"]),
  leadId: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("NBA events");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      "validation_error",
      "Invalid NBA event",
      400,
      parsed.error.flatten()
    );
  }

  void trackEvent(
    `nba.${parsed.data.event}`,
    {
      actionId: parsed.data.actionId,
      leadId: parsed.data.leadId ?? null,
      role: session.profile.role,
    },
    session.auth.id
  );

  return apiOk({ recorded: true });
}

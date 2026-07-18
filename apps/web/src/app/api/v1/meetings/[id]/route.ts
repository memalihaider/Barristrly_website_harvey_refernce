import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { MEETING_STATUSES, canTransitionMeeting } from "@/features/crm";
import { writeAuditLog } from "@/features/crm/access";
import { recordLeadActivity } from "@/features/portal/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(MEETING_STATUSES),
});

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Meetings");

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid meeting update", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: meeting, error: findErr } = await supabase
    .from("meetings")
    .select("id, client_id, lawyer_id, lead_id, status, scheduled_at, jitsi_room_name")
    .eq("id", id)
    .maybeSingle();

  if (findErr) return apiError("internal", findErr.message, 500);
  if (!meeting) return apiError("not_found", "Meeting not found", 404);

  const isParty =
    meeting.lawyer_id === session.auth.id ||
    meeting.client_id === session.auth.id;
  if (!isParty) return apiError("forbidden", "Not a party to this meeting", 403);

  if (!canTransitionMeeting(meeting.status as string, parsed.data.status)) {
    return apiError(
      "conflict",
      `Cannot move meeting from ${meeting.status} to ${parsed.data.status}`,
      409
    );
  }

  const { data: updated, error } = await supabase
    .from("meetings")
    .update({ status: parsed.data.status })
    .eq("id", id)
    .select("id, client_id, lawyer_id, lead_id, status, scheduled_at, jitsi_room_name")
    .single();

  if (error) return apiError("internal", error.message, 500);

  if (meeting.lead_id) {
    await recordLeadActivity(
      supabase,
      meeting.lead_id as string,
      `Meeting ${parsed.data.status}`
    );
  }
  await writeAuditLog(supabase, {
    action: "meeting.status",
    performedBy: session.auth.id,
    details: `Meeting ${id}: ${meeting.status} → ${parsed.data.status}`,
  });

  return apiOk({
    booking: {
      id: updated.id,
      lawyerId: updated.lawyer_id,
      clientId: updated.client_id,
      leadId: updated.lead_id,
      startsAt: updated.scheduled_at,
      status: updated.status,
      roomName: updated.jitsi_room_name,
    },
  });
}

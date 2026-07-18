import { NextRequest } from "next/server";
import { z } from "zod";
import { apiCreated, apiError, apiOk, notConfigured } from "@/lib/api/response";
import { createMeetingSessionStub } from "@/features/meetings/mediasoup";
import { recordLeadActivity } from "@/features/portal/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

const bookingSchema = z.object({
  lawyerId: z.string().uuid(),
  leadId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  timezone: z.string().default("Asia/Dubai"),
});

export async function GET() {
  if (!isSupabaseConfigured()) return notConfigured("Bookings");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const role = session.profile.role;
  let query = supabase
    .from("meetings")
    .select(
      "id, client_id, lawyer_id, lead_id, scheduled_at, status, jitsi_room_name, created_at"
    )
    .order("scheduled_at", { ascending: true });

  if (role === "lawyer") {
    query = query.eq("lawyer_id", session.auth.id);
  } else {
    query = query.eq("client_id", session.auth.id);
  }

  const { data, error } = await query;
  if (error) return apiError("internal", error.message, 500);

  return apiOk({
    bookings: (data ?? []).map((m) => ({
      id: m.id,
      lawyerId: m.lawyer_id,
      clientId: m.client_id,
      leadId: m.lead_id,
      startsAt: m.scheduled_at,
      status: m.status,
      roomName: m.jitsi_room_name,
      createdAt: m.created_at,
    })),
  });
}

export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Bookings");

  const body = await req.json().catch(() => null);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid booking", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { data: lead, error: leadErr } = await supabase
    .from("leads")
    .select("id, client_id, status")
    .eq("id", parsed.data.leadId)
    .maybeSingle();

  if (leadErr) return apiError("internal", leadErr.message, 500);
  if (!lead) return apiError("not_found", "Lead not found", 404);
  if (lead.client_id !== session.auth.id) {
    return apiError("forbidden", "Not your lead", 403);
  }

  const meetingId = crypto.randomUUID();
  const meetingSession = createMeetingSessionStub(meetingId);

  const { data: meeting, error } = await supabase
    .from("meetings")
    .insert({
      id: meetingId,
      client_id: session.auth.id,
      lawyer_id: parsed.data.lawyerId,
      lead_id: parsed.data.leadId,
      scheduled_at: parsed.data.startsAt,
      status: "scheduled",
      jitsi_room_name: meetingSession.roomName,
    })
    .select(
      "id, client_id, lawyer_id, lead_id, scheduled_at, status, jitsi_room_name"
    )
    .single();

  if (error) return apiError("internal", error.message, 500);

  await supabase
    .from("leads")
    .update({
      assigned_lawyer_id: parsed.data.lawyerId,
      status: "consulting",
    })
    .eq("id", parsed.data.leadId);

  await supabase
    .from("lawyer_matches")
    .update({ status: "accepted" })
    .eq("lead_id", parsed.data.leadId)
    .eq("lawyer_id", parsed.data.lawyerId);

  await recordLeadActivity(
    supabase,
    parsed.data.leadId,
    `Consult booked for ${parsed.data.startsAt}`
  );

  return apiCreated({
    booking: {
      id: meeting.id,
      lawyerId: meeting.lawyer_id,
      leadId: meeting.lead_id,
      startsAt: meeting.scheduled_at,
      status: meeting.status,
      roomName: meeting.jitsi_room_name,
    },
    meeting: meetingSession,
  });
}

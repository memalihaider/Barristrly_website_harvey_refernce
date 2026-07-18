import { NextRequest } from "next/server";
import { z } from "zod";
import { apiCreated, apiOk, apiError, notConfigured } from "@/lib/api/response";
import {
  getAccessibleLead,
  recordLeadActivity,
} from "@/features/portal/access";
import { matterAccessError } from "@/features/portal/http";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";
import type { SupabaseClient } from "@supabase/supabase-js";

type Ctx = { params: Promise<{ id: string }> };

async function resolveMeeting(supabase: SupabaseClient, leadId: string) {
  const { data } = await supabase
    .from("meetings")
    .select("id, scheduled_at, status, jitsi_room_name")
    .eq("lead_id", leadId)
    .order("scheduled_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Matters");

  const { id } = await ctx.params;
  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const access = await getAccessibleLead(
    supabase,
    id,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const meeting = await resolveMeeting(supabase, id);
  if (!meeting) {
    return apiOk({
      messages: [],
      needsMeeting: true,
      meetingId: null,
      message: "Book a consult before messaging on this matter.",
    });
  }

  const { data, error } = await supabase
    .from("meeting_messages")
    .select("id, meeting_id, sender_id, message, created_at")
    .eq("meeting_id", meeting.id)
    .order("created_at", { ascending: true });

  if (error) return apiError("internal", error.message, 500);

  return apiOk({
    messages: data ?? [],
    needsMeeting: false,
    meetingId: meeting.id,
    meetingStatus: meeting.status,
    roomName: meeting.jitsi_room_name,
  });
}

const postSchema = z.object({
  message: z.string().min(1).max(5000),
});

export async function POST(req: NextRequest, ctx: Ctx) {
  if (!isSupabaseConfigured()) return notConfigured("Matters");

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid message", 400, parsed.error.flatten());
  }

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const access = await getAccessibleLead(
    supabase,
    id,
    session.auth.id,
    session.profile.role
  );
  if (!access.ok) return matterAccessError(access);

  const meeting = await resolveMeeting(supabase, id);
  if (!meeting) {
    return apiError(
      "conflict",
      "No meeting for this matter — book a consult first",
      409
    );
  }

  const { data, error } = await supabase
    .from("meeting_messages")
    .insert({
      meeting_id: meeting.id,
      sender_id: session.auth.id,
      message: parsed.data.message,
    })
    .select("id, meeting_id, sender_id, message, created_at")
    .single();

  if (error) return apiError("internal", error.message, 500);

  await recordLeadActivity(supabase, id, "Message sent");

  return apiCreated({ message: data, meetingId: meeting.id });
}

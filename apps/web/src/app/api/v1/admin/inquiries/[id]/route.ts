import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import { actorName, requireSuperAdminService } from "@/features/enterprise/admin";
import {
  INQUIRY_PRIORITIES,
  INQUIRY_STATUSES,
  STATUS_LABEL,
  type InquiryStatus,
} from "@/lib/inquiries/model";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const [inq, events] = await Promise.all([
    gate.admin.from("inquiries").select("*").eq("id", id).maybeSingle(),
    gate.admin
      .from("inquiry_events")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (inq.error) return apiError("internal", inq.error.message, 500);
  if (!inq.data) return apiError("not_found", "Inquiry not found", 404);
  return apiOk({ inquiry: inq.data, events: events.data ?? [] });
}

const patchSchema = z
  .object({
    status: z.enum(INQUIRY_STATUSES).optional(),
    priority: z.enum(INQUIRY_PRIORITIES).optional(),
    assignedTo: z.string().min(1).nullable().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "Nothing to update");

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return apiError("validation_error", "Invalid update", 400, parsed.error.flatten());
  }

  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;
  const { admin, session } = gate;
  const actor = actorName(session);

  const { data: current } = await admin.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!current) return apiError("not_found", "Inquiry not found", 404);

  const now = new Date().toISOString();
  const patch: Record<string, unknown> = { updated_at: now };
  const events: { type: string; body: string }[] = [];
  const { status, priority, assignedTo } = parsed.data;

  if (status && status !== current.status) {
    patch.status = status;
    patch.handled_at = now;
    events.push({
      type: "status",
      body: `Status changed from ${STATUS_LABEL[current.status as InquiryStatus] ?? current.status} to ${STATUS_LABEL[status]}`,
    });
  }
  if (priority && priority !== current.priority) {
    patch.priority = priority;
    events.push({ type: "priority", body: `Priority set to ${priority}` });
  }
  if (assignedTo !== undefined && assignedTo !== current.assigned_to) {
    let assignedName: string | null = null;
    if (assignedTo) {
      const { data: member } = await admin
        .from("users")
        .select("id, display_name, email, role")
        .eq("id", assignedTo)
        .maybeSingle();
      if (!member) return apiError("validation_error", "Assignee not found", 400);
      assignedName = member.display_name || member.email;
    }
    patch.assigned_to = assignedTo;
    patch.assigned_name = assignedName;
    events.push({
      type: "assignment",
      body: assignedName ? `Assigned to ${assignedName}` : "Unassigned",
    });
  }

  const { data, error } = await admin
    .from("inquiries")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return apiError("internal", error.message, 500);

  if (events.length) {
    await admin.from("inquiry_events").insert(
      events.map((e) => ({
        inquiry_id: id,
        ...e,
        author_id: session.auth.id,
        author_name: actor,
        created_at: now,
      }))
    );
  }

  return apiOk({ inquiry: data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { error } = await gate.admin.from("inquiries").delete().eq("id", id);
  if (error) return apiError("internal", error.message, 500);
  await gate.admin.from("inquiry_events").delete().eq("inquiry_id", id);
  return apiOk({ deleted: true });
}

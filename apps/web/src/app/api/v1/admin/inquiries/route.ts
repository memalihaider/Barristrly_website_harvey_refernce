import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";

function assertSuperAdmin(role: string) {
  return role === "platform_admin" || role === "mediator";
}

export async function GET(_req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  if (!assertSuperAdmin(gate.session.profile.role)) {
    return apiError("forbidden", "Super Admin required", 403);
  }

  const { data, error } = await gate.admin
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ inquiries: data ?? [] });
}

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "closed", "spam"]),
  adminNotes: z.string().max(2000).optional(),
});

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid patch", 400, parsed.error.flatten());
  }

  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  if (!assertSuperAdmin(gate.session.profile.role)) {
    return apiError("forbidden", "Super Admin required", 403);
  }

  const now = new Date().toISOString();
  const { data, error } = await gate.admin
    .from("inquiries")
    .update({
      status: parsed.data.status,
      ...(parsed.data.adminNotes !== undefined
        ? { admin_notes: parsed.data.adminNotes }
        : {}),
      handled_by: gate.session.auth.id,
      handled_at: now,
      updated_at: now,
    })
    .eq("id", parsed.data.id)
    .select("*")
    .single();

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ inquiry: data });
}

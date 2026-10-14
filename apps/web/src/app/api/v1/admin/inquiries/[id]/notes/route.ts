import { NextRequest } from "next/server";
import { z } from "zod";
import { apiCreated, apiError } from "@/lib/api/response";
import { actorName, requireSuperAdminService } from "@/features/enterprise/admin";

type Ctx = { params: Promise<{ id: string }> };

const schema = z.object({ body: z.string().trim().min(1).max(5000) });

/** Adds an internal note to the inquiry timeline. */
export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return apiError("validation_error", "Note is empty", 400);

  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { data: inquiry } = await gate.admin
    .from("inquiries")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!inquiry) return apiError("not_found", "Inquiry not found", 404);

  const now = new Date().toISOString();
  const { data, error } = await gate.admin
    .from("inquiry_events")
    .insert({
      inquiry_id: id,
      type: "note",
      body: parsed.data.body,
      author_id: gate.session.auth.id,
      author_name: actorName(gate.session),
      created_at: now,
    })
    .select("*")
    .single();
  if (error) return apiError("internal", error.message, 500);

  await gate.admin.from("inquiries").update({ updated_at: now }).eq("id", id);
  return apiCreated({ event: data });
}

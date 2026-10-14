import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import { actorName, requireSuperAdminService } from "@/features/enterprise/admin";
import { getLegalPage, isLegalSlug, LEGAL_META } from "@/lib/content/legal";
import { sanitizeRichText } from "@/lib/content/sanitize";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return apiError("not_found", "Unknown page", 404);
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;
  return apiOk({ page: await getLegalPage(slug), path: LEGAL_META[slug].path });
}

const schema = z.object({
  title: z.string().trim().min(1).max(200),
  effectiveDate: z.string().trim().min(1).max(60),
  contentHtml: z.string().min(1).max(500_000),
});

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return apiError("not_found", "Unknown page", 404);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return apiError("validation_error", "Invalid page", 400, parsed.error.flatten());
  }
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const content = sanitizeRichText(parsed.data.contentHtml);
  if (!content) return apiError("validation_error", "Content is empty", 400);

  const { error } = await gate.admin.from("site_pages").upsert({
    id: slug,
    title: parsed.data.title,
    effective_date: parsed.data.effectiveDate,
    content_html: content,
    updated_at: new Date().toISOString(),
    updated_by: gate.session.auth.id,
    updated_by_name: actorName(gate.session),
  });
  if (error) return apiError("internal", error.message, 500);

  revalidatePath(LEGAL_META[slug].path);
  return apiOk({ page: await getLegalPage(slug) });
}

/** Restores the built-in default text. */
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return apiError("not_found", "Unknown page", 404);
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { error } = await gate.admin.from("site_pages").delete().eq("id", slug);
  if (error) return apiError("internal", error.message, 500);
  revalidatePath(LEGAL_META[slug].path);
  return apiOk({ page: await getLegalPage(slug) });
}

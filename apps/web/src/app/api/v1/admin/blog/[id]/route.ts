import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api/response";
import { actorName, requireSuperAdminService } from "@/features/enterprise/admin";
import { postSchema, revalidateBlog, toRow, uniqueSlug } from "../shared";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { data, error } = await gate.admin.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) return apiError("internal", error.message, 500);
  if (!data) return apiError("not_found", "Post not found", 404);
  return apiOk({ post: data });
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const parsed = postSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid post";
    return apiError("validation_error", first, 400, parsed.error.flatten());
  }
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { data: current } = await gate.admin.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!current) return apiError("not_found", "Post not found", 404);

  const row = toRow(parsed.data);
  if (row.status === "published" && !row.content_html) {
    return apiError("validation_error", "Add some content before publishing", 400);
  }
  const wantedSlug = parsed.data.slug || current.slug || parsed.data.title;
  const slug =
    wantedSlug === current.slug ? current.slug : await uniqueSlug(gate.admin, wantedSlug, id);
  const now = new Date().toISOString();

  const { data, error } = await gate.admin
    .from("blog_posts")
    .update({
      ...row,
      slug,
      published_at:
        row.status === "published" ? current.published_at ?? now : current.published_at ?? null,
      updated_by_name: actorName(gate.session),
      updated_at: now,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return apiError("internal", error.message, 500);

  revalidateBlog(slug, current.slug !== slug ? current.slug : null);
  return apiOk({ post: data });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { data: current } = await gate.admin.from("blog_posts").select("slug").eq("id", id).maybeSingle();
  const { error } = await gate.admin.from("blog_posts").delete().eq("id", id);
  if (error) return apiError("internal", error.message, 500);
  revalidateBlog(current?.slug);
  return apiOk({ deleted: true });
}

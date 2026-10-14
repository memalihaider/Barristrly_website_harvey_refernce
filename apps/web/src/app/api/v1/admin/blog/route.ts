import { NextRequest } from "next/server";
import { apiCreated, apiError, apiOk } from "@/lib/api/response";
import { actorName, requireSuperAdminService } from "@/features/enterprise/admin";
import { postSchema, revalidateBlog, toRow, uniqueSlug } from "./shared";

export async function GET() {
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { data, error } = await gate.admin
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, status, tags, author_name, cover_image_url, reading_minutes, published_at, created_at, updated_at, updated_by_name"
    )
    .order("updated_at", { ascending: false });
  if (error) return apiError("internal", error.message, 500);
  return apiOk({ posts: data ?? [] });
}

export async function POST(req: NextRequest) {
  const parsed = postSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid post";
    return apiError("validation_error", first, 400, parsed.error.flatten());
  }
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const now = new Date().toISOString();
  const row = toRow(parsed.data);
  if (row.status === "published" && !row.content_html) {
    return apiError("validation_error", "Add some content before publishing", 400);
  }
  const slug = await uniqueSlug(gate.admin, parsed.data.slug || parsed.data.title);
  const actor = actorName(gate.session);

  const { data, error } = await gate.admin
    .from("blog_posts")
    .insert({
      ...row,
      slug,
      author_name: row.author_name ?? actor,
      published_at: row.status === "published" ? now : null,
      created_by: gate.session.auth.id,
      updated_by_name: actor,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();
  if (error) return apiError("internal", error.message, 500);

  revalidateBlog(slug);
  return apiCreated({ post: data });
}

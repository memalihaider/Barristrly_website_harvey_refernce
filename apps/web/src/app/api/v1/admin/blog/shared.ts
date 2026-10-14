import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { DbClient } from "@/lib/firebase/db";
import { htmlToText, sanitizeRichText } from "@/lib/content/sanitize";
import { readingMinutes, slugify } from "@/lib/content/text";

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z.string().trim().max(80).optional().or(z.literal("")),
  excerpt: z.string().trim().max(400).optional().or(z.literal("")),
  coverImageUrl: z
    .string()
    .trim()
    .url("Cover image must be a full https:// URL")
    .max(1000)
    .optional()
    .or(z.literal("")),
  contentHtml: z.string().max(1_000_000).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  authorName: z.string().trim().max(120).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
});

export type PostInput = z.infer<typeof postSchema>;

/** Picks a slug not used by another post (appends -2, -3…). */
export async function uniqueSlug(db: DbClient, base: string, exceptId?: string) {
  const root = slugify(base) || "post";
  for (let n = 1; n < 100; n++) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    const { data } = await db.from("blog_posts").select("id").eq("slug", candidate);
    if (!(data ?? []).some((r) => r.id !== exceptId)) return candidate;
  }
  return `${root}-${Date.now()}`;
}

/** Row fields derived from validated input. */
export function toRow(input: PostInput) {
  const content = sanitizeRichText(input.contentHtml);
  const text = htmlToText(content);
  return {
    title: input.title,
    excerpt: input.excerpt || text.slice(0, 220) || null,
    cover_image_url: input.coverImageUrl || null,
    content_html: content,
    tags: [...new Set(input.tags.map((t) => t.toLowerCase()))],
    author_name: input.authorName || null,
    status: input.status,
    seo_title: input.seoTitle || null,
    seo_description: input.seoDescription || null,
    reading_minutes: readingMinutes(text),
  };
}

export function revalidateBlog(...slugs: (string | null | undefined)[]) {
  revalidatePath("/blog");
  revalidatePath("/resources");
  for (const s of slugs) if (s) revalidatePath(`/blog/${s}`);
}

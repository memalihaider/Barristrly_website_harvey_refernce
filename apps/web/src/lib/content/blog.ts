import { createServiceClient, isDbConfigured } from "@/lib/db/client";
import { sanitizeRichText } from "@/lib/content/sanitize";

export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  content_html: string;
  tags: string[];
  author_name: string | null;
  status: BlogStatus;
  seo_title: string | null;
  seo_description: string | null;
  reading_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostSummary = Omit<BlogPost, "content_html">;

function summary(row: BlogPost): BlogPostSummary {
  const { content_html: _omit, ...rest } = row; // eslint-disable-line @typescript-eslint/no-unused-vars
  return rest;
}

/** Published posts, newest first. Returns [] when the DB is unavailable. */
export async function listPublishedPosts(limit = 50): Promise<BlogPostSummary[]> {
  if (!isDbConfigured()) return [];
  try {
    const { data } = await createServiceClient()
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    return ((data ?? []) as BlogPost[]).map(summary);
  } catch {
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  if (!isDbConfigured()) return null;
  try {
    const { data } = await createServiceClient()
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!data) return null;
    return { ...(data as BlogPost), content_html: sanitizeRichText(data.content_html) };
  } catch {
    return null;
  }
}

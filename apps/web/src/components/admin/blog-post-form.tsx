"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Eye, Save, Send, X } from "lucide-react";
import RichTextEditor from "@/components/editor/rich-text-editor";
import { slugify } from "@/lib/content/text";
import { timeAgo } from "@/lib/time";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  content_html: string;
  tags: string[];
  author_name: string | null;
  status: "draft" | "published";
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string;
};

const field =
  "mt-1.5 w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:bg-white";
const label = "block text-xs font-semibold uppercase tracking-wider text-gray-500";

export default function BlogPostForm({ postId }: { postId?: string }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(!postId);
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [cover, setCover] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [author, setAuthor] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [saving, setSaving] = useState<null | "draft" | "published">(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    fetch(`/api/v1/admin/blog/${postId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (!json?.ok) {
          setError(json?.error?.message ?? "Failed to load article");
          setLoaded(true);
          return;
        }
        const p = json.data.post as Post;
        setPost(p);
        setTitle(p.title);
        setSlug(p.slug);
        setSlugTouched(true);
        setExcerpt(p.excerpt ?? "");
        setCover(p.cover_image_url ?? "");
        setContent(p.content_html ?? "");
        setTags(p.tags ?? []);
        setAuthor(p.author_name ?? "");
        setSeoTitle(p.seo_title ?? "");
        setSeoDescription(p.seo_description ?? "");
        setLoaded(true);
      })
      .catch(() => !cancelled && setError("Failed to load article"));
    return () => {
      cancelled = true;
    };
  }, [postId]);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const touch = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setDirty(true);
    setNotice(null);
  };

  function onTitle(v: string) {
    touch(setTitle)(v);
    if (!slugTouched) setSlug(slugify(v));
  }

  function addTag(raw: string) {
    const t = raw.trim().replace(/^#/, "").toLowerCase();
    if (!t || tags.includes(t) || tags.length >= 12) return;
    touch(setTags)([...tags, t]);
    setTagInput("");
  }

  async function save(status: "draft" | "published") {
    setSaving(status);
    setError(null);
    setNotice(null);
    try {
      const body = {
        title,
        slug,
        excerpt,
        coverImageUrl: cover,
        contentHtml: content,
        tags,
        authorName: author,
        status,
        seoTitle,
        seoDescription,
      };
      const res = await fetch(postId ? `/api/v1/admin/blog/${postId}` : "/api/v1/admin/blog", {
        method: postId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Save failed");
      const saved = json.data.post as Post;
      setDirty(false);
      if (!postId) {
        router.replace(`/admin/blog/${saved.id}`);
        return;
      }
      setPost(saved);
      setSlug(saved.slug);
      setNotice(status === "published" ? "Published — live on the website." : "Draft saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  }

  if (!loaded) return <p className="text-sm text-gray-600">{error ?? "Loading article…"}</p>;

  const isPublished = post?.status === "published";

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {post ? (
            <span className="text-xs text-gray-500">
              {isPublished ? "Published" : "Draft"} · saved {timeAgo(post.updated_at)}
              {dirty ? " · unsaved changes" : ""}
            </span>
          ) : null}
          {isPublished ? (
            <Link
              href={`/blog/${post?.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View live
            </Link>
          ) : null}
          <button
            type="button"
            disabled={!!saving || !title.trim()}
            onClick={() => void save("draft")}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" />
            {saving === "draft" ? "Saving…" : isPublished ? "Unpublish & save draft" : "Save draft"}
          </button>
          <button
            type="button"
            disabled={!!saving || !title.trim()}
            onClick={() => void save("published")}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
            {saving === "published" ? "Publishing…" : isPublished ? "Update live article" : "Publish"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
      ) : null}
      {notice ? (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">{notice}</p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <input
            value={title}
            onChange={(e) => onTitle(e.target.value)}
            placeholder="Article title"
            aria-label="Title"
            className="w-full rounded-2xl border border-[#e5e3dc] bg-white px-5 py-4 font-serif text-2xl text-ink outline-none focus:border-primary md:text-3xl"
          />
          <RichTextEditor
            value={content}
            onChange={touch(setContent)}
            placeholder="Write the article… Use the toolbar for headings, bullet points, quotes, tables and links."
          />
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5 space-y-4">
            <label className={label}>
              URL slug
              <div className="mt-1.5 flex items-center rounded-xl border border-[#e5e3dc] bg-[#faf9f6] text-sm focus-within:border-primary">
                <span className="pl-3 text-gray-400 normal-case tracking-normal">/blog/</span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    touch(setSlug)(slugify(e.target.value));
                  }}
                  className="w-full bg-transparent px-1 py-2.5 normal-case tracking-normal text-ink outline-none"
                />
              </div>
            </label>
            <label className={label}>
              Excerpt
              <textarea
                value={excerpt}
                onChange={(e) => touch(setExcerpt)(e.target.value)}
                rows={3}
                maxLength={400}
                placeholder="Short summary for cards and search results"
                className={`${field} normal-case tracking-normal`}
              />
            </label>
            <label className={label}>
              Author
              <input
                value={author}
                onChange={(e) => touch(setAuthor)(e.target.value)}
                placeholder="Defaults to your name"
                className={`${field} normal-case tracking-normal`}
              />
            </label>
            <div>
              <span className={label}>Tags</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                    #{t}
                    <button type="button" aria-label={`Remove ${t}`} onClick={() => touch(setTags)(tags.filter((x) => x !== t))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                onBlur={() => addTag(tagInput)}
                placeholder="Type a tag and press Enter"
                className={field}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5 space-y-3">
            <label className={label}>
              Cover image URL
              <input
                value={cover}
                onChange={(e) => touch(setCover)(e.target.value.trim())}
                placeholder="https://…"
                className={`${field} normal-case tracking-normal`}
              />
            </label>
            {cover && /^https?:\/\//.test(cover) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt="Cover preview" className="aspect-[16/9] w-full rounded-xl object-cover bg-[#faf9f6]" />
            ) : null}
          </section>

          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5 space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <Eye className="h-3.5 w-3.5" /> Search engine (SEO)
            </p>
            <label className={label}>
              SEO title
              <input
                value={seoTitle}
                onChange={(e) => touch(setSeoTitle)(e.target.value)}
                maxLength={200}
                placeholder={title || "Defaults to the article title"}
                className={`${field} normal-case tracking-normal`}
              />
            </label>
            <label className={label}>
              Meta description
              <textarea
                value={seoDescription}
                onChange={(e) => touch(setSeoDescription)(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder={excerpt || "Defaults to the excerpt"}
                className={`${field} normal-case tracking-normal`}
              />
            </label>
            <div className="rounded-xl bg-[#faf9f6] p-3">
              <p className="truncate text-sm text-[#1a0dab]">{seoTitle || title || "Article title"}</p>
              <p className="truncate text-xs text-emerald-700">barristrly.com/blog/{slug || "slug"}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                {seoDescription || excerpt || "Description shown in search results."}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

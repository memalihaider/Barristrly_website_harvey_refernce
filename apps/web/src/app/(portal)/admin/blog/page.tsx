"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, FilePlus2, PenSquare, Search, Trash2 } from "lucide-react";
import { usePolling } from "@/lib/hooks/use-polling";
import { timeAgo } from "@/lib/time";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: "draft" | "published";
  tags: string[];
  author_name: string | null;
  reading_minutes: number;
  published_at: string | null;
  updated_at: string;
  updated_by_name: string | null;
};

type Filter = "all" | "published" | "draft";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const json = await fetch("/api/v1/admin/blog", { cache: "no-store" }).then((r) => r.json()).catch(() => null);
    setLoading(false);
    if (!json?.ok) {
      setError(json?.error?.message ?? "Failed to load posts");
      return;
    }
    setError(null);
    setPosts(json.data.posts ?? []);
  }, []);

  usePolling(load, 60_000);

  async function remove(post: PostRow) {
    if (!window.confirm(`Delete "${post.title}" permanently?`)) return;
    const json = await fetch(`/api/v1/admin/blog/${post.id}`, { method: "DELETE" }).then((r) => r.json()).catch(() => null);
    if (!json?.ok) {
      setError(json?.error?.message ?? "Delete failed");
      return;
    }
    await load();
  }

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status !== "published").length,
    }),
    [posts]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (filter === "all" || p.status === filter) &&
        (!needle ||
          p.title.toLowerCase().includes(needle) ||
          p.tags?.some((t) => t.includes(needle)))
    );
  }, [posts, filter, query]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-on-light-muted max-w-2xl">
          Articles published here appear on the public{" "}
          <Link href="/blog" target="_blank" className="font-semibold text-primary">
            Blog
          </Link>{" "}
          and the Resources page.
        </p>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover"
        >
          <FilePlus2 className="h-4 w-4" /> New article
        </Link>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize ${
              filter === f ? "border-primary bg-primary text-on-primary" : "border-ink/15 text-ink hover:border-primary"
            }`}
          >
            {f === "draft" ? "Drafts" : f} ({counts[f]})
          </button>
        ))}
        <label className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or tag…"
            className="w-full rounded-xl border border-[#e5e3dc] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading articles…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5e3dc] bg-white p-10 text-center">
          <p className="text-sm text-gray-600">
            {posts.length === 0 ? "No articles yet." : "No articles match."}
          </p>
          {posts.length === 0 ? (
            <Link href="/admin/blog/new" className="mt-3 inline-block text-sm font-semibold text-primary">
              Write the first article →
            </Link>
          ) : null}
        </div>
      ) : (
        <ul className="m-0 list-none space-y-3 p-0">
          {visible.map((p) => (
            <li key={p.id} className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                        p.status === "published"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status === "published" ? "Published" : "Draft"}
                    </span>
                    {p.tags?.slice(0, 4).map((t) => (
                      <span key={t} className="text-[11px] text-gray-500">#{t}</span>
                    ))}
                  </div>
                  <Link href={`/admin/blog/${p.id}`} className="mt-2 block font-serif text-lg text-ink hover:text-primary break-words">
                    {p.title}
                  </Link>
                  {p.excerpt ? <p className="mt-1 line-clamp-2 text-sm text-gray-600">{p.excerpt}</p> : null}
                  <p className="mt-2 text-xs text-gray-500">
                    {p.reading_minutes} min read · updated {timeAgo(p.updated_at)}
                    {p.updated_by_name ? ` by ${p.updated_by_name}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {p.status === "published" ? (
                    <Link href={`/blog/${p.slug}`} target="_blank" title="View live" className="rounded-lg p-2 text-gray-500 hover:bg-black/5 hover:text-ink">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  ) : null}
                  <Link href={`/admin/blog/${p.id}`} title="Edit" className="rounded-lg p-2 text-gray-500 hover:bg-black/5 hover:text-ink">
                    <PenSquare className="h-4 w-4" />
                  </Link>
                  <button type="button" title="Delete" onClick={() => void remove(p)} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

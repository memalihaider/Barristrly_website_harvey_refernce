"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RotateCcw, Save } from "lucide-react";
import RichTextEditor from "@/components/editor/rich-text-editor";
import type { LegalPage, LegalSlug } from "@/lib/content/legal";
import { timeAgo } from "@/lib/time";

const field =
  "mt-1.5 w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3.5 py-2.5 text-sm text-ink outline-none focus:border-primary focus:bg-white";

export default function LegalPageForm({ slug }: { slug: LegalSlug }) {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [path, setPath] = useState("/");
  const [title, setTitle] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [content, setContent] = useState("");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function apply(p: LegalPage) {
    setPage(p);
    setTitle(p.title);
    setEffectiveDate(p.effective_date);
    setContent(p.content_html);
    setDirty(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v1/admin/content/pages/${slug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (!json?.ok) {
          setError(json?.error?.message ?? "Failed to load page");
          return;
        }
        apply(json.data.page);
        setPath(json.data.path);
      })
      .catch(() => !cancelled && setError("Failed to load page"));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function send(method: "PUT" | "DELETE") {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/v1/admin/content/pages/${slug}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "PUT" ? JSON.stringify({ title, effectiveDate, contentHtml: content }) : undefined,
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Save failed");
      apply(json.data.page);
      setNotice(method === "PUT" ? "Saved — the live page is updated." : "Restored the built-in text.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  if (!page) return <p className="text-sm text-gray-600">{error ?? "Loading page…"}</p>;

  const edit = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setDirty(true);
    setNotice(null);
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/content" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Legal pages
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">
            {page.customized && page.updated_at
              ? `Saved ${timeAgo(page.updated_at)}${page.updated_by_name ? ` by ${page.updated_by_name}` : ""}`
              : "Showing built-in text"}
            {dirty ? " · unsaved changes" : ""}
          </span>
          <Link
            href={path}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View live
          </Link>
          {page.customized ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Discard all edits and restore the built-in text?")) void send("DELETE");
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-2 text-xs font-semibold text-ink hover:border-red-400 hover:text-red-600 disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Restore default
            </button>
          ) : null}
          <button
            type="button"
            disabled={busy || !dirty}
            onClick={() => void send("PUT")}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" /> {busy ? "Saving…" : "Save & publish"}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
      ) : null}
      {notice ? (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">{notice}</p>
      ) : null}

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Page title
          <input value={title} onChange={(e) => edit(setTitle)(e.target.value)} className={`${field} normal-case tracking-normal`} />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Effective date
          <input
            value={effectiveDate}
            onChange={(e) => edit(setEffectiveDate)(e.target.value)}
            placeholder="e.g. October 9, 2026"
            className={`${field} normal-case tracking-normal`}
          />
        </label>
      </div>

      <RichTextEditor value={content} onChange={edit(setContent)} />
    </>
  );
}

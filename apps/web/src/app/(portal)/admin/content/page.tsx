import Link from "next/link";
import { ExternalLink, FileText, PenSquare } from "lucide-react";
import { getLegalPage, LEGAL_META, LEGAL_SLUGS } from "@/lib/content/legal";
import { formatDate } from "@/lib/content/text";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const pages = await Promise.all(LEGAL_SLUGS.map((s) => getLegalPage(s)));

  return (
    <>
      <p className="mb-6 max-w-2xl text-sm text-text-on-light-muted">
        Edit the website&apos;s legal pages. Changes go live as soon as you
        save. Until a page is edited, the website shows its built-in text.
      </p>
      <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
        {pages.map((p) => (
          <li key={p.slug} className="rounded-2xl border border-[#e5e3dc] bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                  p.customized
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-gray-100 text-gray-600"
                }`}
              >
                {p.customized ? "Edited" : "Built-in text"}
              </span>
            </div>
            <h2 className="mt-4 font-serif text-xl text-ink">{p.title}</h2>
            <p className="mt-1 text-xs text-gray-500">
              Effective {p.effective_date}
              {p.updated_at ? ` · last saved ${formatDate(p.updated_at)}` : ""}
              {p.updated_by_name ? ` by ${p.updated_by_name}` : ""}
            </p>
            <div className="mt-5 flex gap-2">
              <Link
                href={`/admin/content/${p.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover"
              >
                <PenSquare className="h-3.5 w-3.5" /> Edit
              </Link>
              <Link
                href={LEGAL_META[p.slug].path}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View page
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

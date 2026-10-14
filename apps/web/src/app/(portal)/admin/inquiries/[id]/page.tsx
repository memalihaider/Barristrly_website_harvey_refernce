"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Globe2,
  Mail,
  MessageSquare,
  Reply,
  Tag,
  Trash2,
  UserRound,
  History,
} from "lucide-react";
import { usePolling } from "@/lib/hooks/use-polling";
import { dateTime, timeAgo } from "@/lib/time";
import {
  INQUIRY_PRIORITIES,
  INQUIRY_STATUSES,
  STATUS_LABEL,
  STATUS_STYLE,
  type Inquiry,
  type InquiryEvent,
  type InquiryPriority,
  type InquiryStatus,
} from "@/lib/inquiries/model";

type Member = { id: string; name: string; email: string; role: string };

const ROLE_LABEL: Record<string, string> = {
  client: "Client / individual",
  lawyer: "Lawyer",
  firm: "Law firm",
  enterprise: "Enterprise / in-house",
  other: "Other",
};

export default function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [events, setEvents] = useState<InquiryEvent[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [meId, setMeId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/v1/admin/inquiries/${id}`, { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (res.status === 404) {
      setNotFound(true);
      return;
    }
    if (!json?.ok) {
      setError(json?.error?.message ?? "Failed to load inquiry");
      return;
    }
    setInquiry(json.data.inquiry);
    setEvents(json.data.events ?? []);
  }, [id]);

  const loadTeam = useCallback(async () => {
    if (members.length) return;
    const json = await fetch("/api/v1/admin/team").then((r) => r.json()).catch(() => null);
    if (json?.ok) {
      setMembers(json.data.members);
      setMeId(json.data.me);
    }
  }, [members.length]);

  usePolling(load, 20_000);
  usePolling(loadTeam, 10 * 60_000);

  async function update(patch: {
    status?: InquiryStatus;
    priority?: InquiryPriority;
    assignedTo?: string | null;
  }) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Update failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/admin/inquiries/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: note }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? "Could not add note");
      setNote("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add note");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Delete this inquiry and its notes permanently?")) return;
    setBusy(true);
    const res = await fetch(`/api/v1/admin/inquiries/${id}`, { method: "DELETE" });
    const json = await res.json().catch(() => null);
    setBusy(false);
    if (!json?.ok) {
      setError(json?.error?.message ?? "Delete failed");
      return;
    }
    router.push("/admin/inquiries");
  }

  if (notFound) {
    return (
      <div className="rounded-2xl border border-[#e5e3dc] bg-white p-10 text-center">
        <p className="text-sm text-gray-600">This inquiry no longer exists.</p>
        <Link href="/admin/inquiries" className="mt-4 inline-block text-sm font-semibold text-primary">
          ← Back to inquiries
        </Link>
      </div>
    );
  }

  if (!inquiry) {
    return <p className="text-sm text-gray-600">{error ?? "Loading inquiry…"}</p>;
  }

  const replySubject = encodeURIComponent("Re: Your Barristrly inquiry");
  const replyBody = encodeURIComponent(
    `Hi ${inquiry.name.split(" ")[0]},\n\nThank you for contacting Barristrly.\n\n`
  );
  const mailto = `mailto:${inquiry.email}?subject=${replySubject}&body=${replyBody}`;

  async function replyAndMark() {
    window.location.href = mailto;
    if (inquiry && (inquiry.status === "new" || inquiry.status === "in_progress")) {
      await update({ status: "contacted" });
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> All inquiries
        </Link>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void replyAndMark()}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover"
          >
            <Reply className="h-3.5 w-3.5" /> Reply by email
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void remove()}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink hover:border-red-400 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6 min-w-0">
          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-serif text-2xl text-ink break-words">{inquiry.name}</h2>
                <a href={mailto} className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover break-all">
                  <Mail className="h-4 w-4 shrink-0" /> {inquiry.email}
                </a>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[inquiry.status]}`}>
                {STATUS_LABEL[inquiry.status]}
              </span>
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2 text-sm">
              {[
                { icon: Building2, label: "Organization", value: inquiry.organization },
                { icon: UserRound, label: "Type", value: inquiry.role ? ROLE_LABEL[inquiry.role] ?? inquiry.role : null },
                { icon: Globe2, label: "Country", value: inquiry.country },
                { icon: Tag, label: "Source", value: inquiry.source?.replace(/_/g, " ") },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-2.5 rounded-xl bg-[#faf9f6] px-3 py-2.5">
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-wider text-gray-500">{f.label}</dt>
                    <dd className="text-ink capitalize break-words">{f.value || "—"}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <MessageSquare className="h-4 w-4" /> Message
              </h3>
              <p className="mt-2 whitespace-pre-wrap rounded-xl border border-[#e5e3dc] p-4 text-sm leading-relaxed text-gray-700">
                {inquiry.message || <span className="italic text-gray-400">No message was included.</span>}
              </p>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Received {dateTime(inquiry.created_at)}
              {inquiry.metadata?.referer ? <> · from <span className="break-all">{inquiry.metadata.referer}</span></> : null}
            </p>
          </section>

          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-6">
            <h3 className="flex items-center gap-2 font-serif text-lg text-ink">
              <History className="h-4 w-4 text-primary" /> Notes & activity
            </h3>
            <form onSubmit={addNote} className="mt-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add an internal note (only admins see this)…"
                className="w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3.5 py-3 text-sm outline-none focus:border-primary focus:bg-white"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={busy || !note.trim()}
                  className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ivory hover:bg-black disabled:opacity-40"
                >
                  Add note
                </button>
              </div>
            </form>

            <ol className="mt-5 space-y-4 list-none p-0">
              {events.map((ev) => (
                <li key={ev.id} className="flex gap-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${ev.type === "note" ? "bg-primary" : "bg-gray-300"}`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${ev.type === "note" ? "whitespace-pre-wrap text-ink" : "text-gray-600"}`}>
                      {ev.body}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500">
                      {ev.author_name ?? "System"} · {timeAgo(ev.created_at)}
                    </p>
                  </div>
                </li>
              ))}
              <li className="flex gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-gray-200" aria-hidden />
                <p className="text-sm text-gray-500">
                  Inquiry submitted · <span className="text-[11px]">{timeAgo(inquiry.created_at)}</span>
                </p>
              </li>
            </ol>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
              <select
                value={inquiry.status}
                disabled={busy}
                onChange={(e) => void update({ status: e.target.value as InquiryStatus })}
                className="mt-1.5 block w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3 py-2.5 text-sm normal-case tracking-normal text-ink"
              >
                {INQUIRY_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Priority
              <select
                value={inquiry.priority ?? "normal"}
                disabled={busy}
                onChange={(e) => void update({ priority: e.target.value as InquiryPriority })}
                className="mt-1.5 block w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3 py-2.5 text-sm capitalize normal-case tracking-normal text-ink"
              >
                {INQUIRY_PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Assigned to
              <select
                value={inquiry.assigned_to ?? ""}
                disabled={busy}
                onChange={(e) => void update({ assignedTo: e.target.value || null })}
                className="mt-1.5 block w-full rounded-xl border border-[#e5e3dc] bg-[#faf9f6] px-3 py-2.5 text-sm normal-case tracking-normal text-ink"
              >
                <option value="">Unassigned</option>
                {inquiry.assigned_to && !members.some((m) => m.id === inquiry.assigned_to) ? (
                  <option value={inquiry.assigned_to}>{inquiry.assigned_name ?? "Former member"}</option>
                ) : null}
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}{m.id === meId ? " (me)" : ""}
                  </option>
                ))}
              </select>
            </label>
            {meId && inquiry.assigned_to !== meId ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void update({ assignedTo: meId, ...(inquiry.status === "new" ? { status: "in_progress" as const } : {}) })}
                className="w-full rounded-full border border-ink/15 py-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary disabled:opacity-50"
              >
                Assign to me
              </button>
            ) : null}
          </section>

          <section className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Quick actions</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                [
                  ["in_progress", "Start"],
                  ["qualified", "Qualify"],
                  ["closed", "Close"],
                  ["spam", "Mark spam"],
                ] as [InquiryStatus, string][]
              ).map(([s, label]) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy || inquiry.status === s}
                  onClick={() => void update({ status: s })}
                  className="rounded-xl border border-[#e5e3dc] py-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary disabled:opacity-40"
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-gray-500">
              Last updated {timeAgo(inquiry.updated_at)}
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import NextBestActionBanner from "@/components/portal/next-best-action";
import type { NextBestAction } from "@/features/intelligence";

type Matter = {
  id: string;
  title: string;
  status: string;
  category: string | null;
  counterpartLabel: string;
  contactRevealed: boolean;
  nextAction?: string;
  description?: string;
};

type Activity = { id: string; activity: string; created_at: string };
type Note = { id: string; note: string; created_at: string };
type Message = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
};
type Escrow = {
  id: string;
  payment_id: string | null;
  amount: number;
  currency: string;
  status: string;
  client_confirmed: boolean;
  lawyer_confirmed: boolean;
};
type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
};

type DocRow = {
  id: string;
  title: string;
  version: number;
  mime_type: string;
  byte_size: number;
  status: string;
  created_at: string;
};

export default function MatterDetail({
  matterId,
  role,
  bookingsHref,
}: {
  matterId: string;
  role: "client" | "lawyer";
  bookingsHref: string;
}) {
  const [matter, setMatter] = useState<Matter | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [needsMeeting, setNeedsMeeting] = useState(false);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [deadlines, setDeadlines] = useState<
    Array<{
      id: string;
      title: string;
      due_at: string;
      status: string;
      kind: string;
    }>
  >([]);
  const [contracts, setContracts] = useState<
    Array<{
      id: string;
      title: string;
      status: string;
      counterparty: string;
      document_id: string | null;
    }>
  >([]);
  const [deadlineTitle, setDeadlineTitle] = useState("");
  const [deadlineDue, setDeadlineDue] = useState("");
  const [deadlineKind, setDeadlineKind] = useState("general");
  const [contractTitle, setContractTitle] = useState("");
  const [contractParty, setContractParty] = useState("");
  const [noteText, setNoteText] = useState("");
  const [msgText, setMsgText] = useState("");
  const [aiAgent, setAiAgent] = useState<"summarize" | "draft">("summarize");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSessionId, setAiSessionId] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{
    text: string;
    gated: boolean;
    requireHumanReview: boolean;
    model: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [nbaPrimary, setNbaPrimary] = useState<NextBestAction | null>(null);
  const [nbaSecondary, setNbaSecondary] = useState<NextBestAction[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, aRes, nRes, msgRes, bRes, dRes, dlRes, cRes] =
        await Promise.all([
          fetch(`/api/v1/matters/${matterId}`),
          fetch(`/api/v1/matters/${matterId}/activity`),
          fetch(`/api/v1/matters/${matterId}/notes`),
          fetch(`/api/v1/matters/${matterId}/messages`),
          fetch(`/api/v1/matters/${matterId}/billing`),
          fetch(`/api/v1/documents?leadId=${matterId}`),
          fetch(`/api/v1/matters/${matterId}/deadlines`),
          fetch(`/api/v1/matters/${matterId}/contracts`),
        ]);
      const [m, a, n, msg, b, d, dl, c] = await Promise.all([
        mRes.json(),
        aRes.json(),
        nRes.json(),
        msgRes.json(),
        bRes.json(),
        dRes.json(),
        dlRes.json(),
        cRes.json(),
      ]);
      if (!m.ok) {
        setError(m.error?.message ?? "Failed to load matter");
        return;
      }
      setMatter(m.data.matter);
      setActivity(a.ok ? a.data.activity ?? [] : []);
      setNotes(n.ok ? n.data.notes ?? [] : []);
      if (msg.ok) {
        setMessages(msg.data.messages ?? []);
        setNeedsMeeting(Boolean(msg.data.needsMeeting));
      }
      if (b.ok) {
        setEscrows(b.data.escrows ?? []);
        setPayments(b.data.payments ?? []);
      }
      if (d.ok) {
        setDocuments(d.data.documents ?? []);
      }
      if (dl.ok) setDeadlines(dl.data.deadlines ?? []);
      if (c.ok) setContracts(c.data.contracts ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [matterId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (role !== "client") return;
    void fetch(`/api/v1/client/insights?leadId=${matterId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setNbaPrimary(json.data.primary ?? null);
          setNbaSecondary(json.data.secondary ?? []);
        }
      })
      .catch(() => {
        setNbaPrimary(null);
        setNbaSecondary([]);
      });
  }, [role, matterId]);

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/matters/${matterId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Note failed");
        return;
      }
      setNoteText("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msgText.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/matters/${matterId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Message failed");
        return;
      }
      setMsgText("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function confirmEscrow(escrow: Escrow) {
    if (!escrow.payment_id) {
      setError("Escrow missing payment id");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/v1/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "release",
          paymentId: escrow.payment_id,
          escrowId: escrow.id,
          clientConfirmed: role === "client" ? true : undefined,
          lawyerConfirmed: role === "lawyer" ? true : undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Release failed");
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function uploadDocument(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("leadId", matterId);
      form.set("file", file);
      const res = await fetch("/api/v1/documents", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Upload failed");
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function downloadDocument(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/documents/${id}`);
      const json = await res.json();
      if (!json.ok || !json.data.downloadUrl) {
        setError(json.error?.message ?? "Download failed");
        return;
      }
      window.open(json.data.downloadUrl, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  }

  async function replaceDocument(id: string, file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch(`/api/v1/documents/${id}/versions`, {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Version upload failed");
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function archiveDocument(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/documents/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Archive failed");
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function runAi(e: React.FormEvent) {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: aiAgent,
          prompt: aiPrompt,
          matterId,
          sessionId: aiSessionId || undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "AI request failed");
        return;
      }
      setAiSessionId(json.data.sessionId as string);
      setAiResult({
        text: json.data.result?.text ?? "",
        gated: Boolean(json.data.gated),
        requireHumanReview: Boolean(json.data.requireHumanReview),
        model: json.data.result?.model ?? "unknown",
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function addDeadline(e: React.FormEvent) {
    e.preventDefault();
    if (!deadlineTitle.trim() || !deadlineDue) return;
    setBusy(true);
    try {
      const dueAt = new Date(deadlineDue).toISOString();
      const res = await fetch(`/api/v1/matters/${matterId}/deadlines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: deadlineTitle,
          dueAt,
          kind: deadlineKind,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Deadline failed");
        return;
      }
      setDeadlineTitle("");
      setDeadlineDue("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function setDeadlineStatus(id: string, status: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/deadlines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Update failed");
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function addContract(e: React.FormEvent) {
    e.preventDefault();
    if (!contractTitle.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/matters/${matterId}/contracts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: contractTitle,
          counterparty: contractParty,
          documentId: documents[0]?.id,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Contract failed");
        return;
      }
      setContractTitle("");
      setContractParty("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function setContractStatus(id: string, status: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/contracts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Contract update failed");
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-text-muted">Loading matter…</p>;
  }

  if (!matter) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {error ?? "Matter not found"}
      </p>
    );
  }

  return (
    <div className="space-y-10 max-w-3xl">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {role === "client" && (
        <NextBestActionBanner
          primary={nbaPrimary}
          secondary={nbaSecondary}
          title="Next step for this matter"
        />
      )}

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-text-muted capitalize">
          {matter.status} · {matter.category ?? "general"}
        </p>
        <h2 className="font-serif text-3xl tracking-tight">{matter.title}</h2>
        <p className="text-sm text-text-on-light-muted">
          With {matter.counterpartLabel}
          {matter.contactRevealed ? "" : " (masked until dual consent)"}
        </p>
        {matter.nextAction && (
          <p className="text-sm text-ink">{matter.nextAction}</p>
        )}
        {matter.description && (
          <p className="text-sm text-text-muted border-t border-black/10 pt-3 mt-3">
            {matter.description}
          </p>
        )}
      </header>

      <section>
        <h3 className="font-serif text-xl mb-3">Timeline</h3>
        {activity.length === 0 ? (
          <p className="text-sm text-text-muted">No activity yet.</p>
        ) : (
          <ol className="space-y-2 border-l border-black/10 pl-4">
            {activity.map((item) => (
              <li key={item.id} className="text-sm">
                <span className="text-ink">{item.activity}</span>
                <span className="block text-xs text-text-muted">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h3 className="font-serif text-xl mb-3">Notes</h3>
        <form onSubmit={addNote} className="flex gap-2 mb-4">
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a shared note…"
            className="flex-1 border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            Add
          </button>
        </form>
        <ul className="space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="border border-black/10 bg-white p-3 text-sm">
              <p>{n.note}</p>
              <p className="text-xs text-text-muted mt-1">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-serif text-xl mb-3">Documents</h3>
        <label className="inline-flex items-center gap-2 mb-4">
          <span className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover cursor-pointer">
            {busy ? "Working…" : "Upload file"}
          </span>
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.docx,.png,.jpg,.jpeg,.txt,application/pdf,image/png,image/jpeg,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={busy}
            onChange={uploadDocument}
          />
        </label>
        <p className="text-xs text-text-muted mb-3">
          PDF, DOCX, PNG, JPEG, TXT · max 15MB
        </p>
        {documents.length === 0 ? (
          <p className="text-sm text-text-muted">No documents yet.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="border border-black/10 bg-white p-3 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-xs text-text-muted">
                    v{doc.version} · {(doc.byte_size / 1024).toFixed(1)} KB ·{" "}
                    {new Date(doc.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => downloadDocument(doc.id)}
                    className="text-xs font-semibold text-primary disabled:opacity-50"
                  >
                    Download
                  </button>
                  <label className="text-xs font-semibold cursor-pointer">
                    Replace
                    <input
                      type="file"
                      className="sr-only"
                      disabled={busy}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = "";
                        if (f) void replaceDocument(doc.id, f);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => archiveDocument(doc.id)}
                    className="text-xs font-semibold text-text-muted disabled:opacity-50"
                  >
                    Archive
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="font-serif text-xl mb-3">Messages</h3>
        {needsMeeting ? (
          <p className="text-sm text-text-muted mb-3">
            Messaging requires a booked consult.{" "}
            <Link href={bookingsHref} className="font-semibold text-primary">
              Go to bookings →
            </Link>
          </p>
        ) : (
          <>
            <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <li className="text-sm text-text-muted">No messages yet.</li>
              ) : (
                messages.map((m) => (
                  <li key={m.id} className="border border-black/10 bg-white p-3 text-sm">
                    <p>{m.message}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </li>
                ))
              )}
            </ul>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Write a message…"
                className="flex-1 border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </>
        )}
      </section>

      <section>
        <h3 className="font-serif text-xl mb-3">AI assistant</h3>
        <p className="text-xs text-text-muted mb-3">
          Summarize the matter or draft a short client message. Live Gemini when
          keyed; otherwise a deterministic stub.
        </p>
        <form onSubmit={runAi} className="space-y-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {(["summarize", "draft"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAiAgent(a)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border ${
                  aiAgent === a
                    ? "bg-primary text-white border-primary"
                    : "border-black/15"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            rows={3}
            placeholder={
              aiAgent === "summarize"
                ? "Optional focus (e.g. key risks, next steps)…"
                : "What should the draft cover?"
            }
            className="w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-primary"
            required
            minLength={3}
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {busy ? "Running…" : "Run assistant"}
          </button>
        </form>
        {aiResult && (
          <div className="border border-black/10 bg-white p-4 space-y-2 text-sm">
            {aiResult.requireHumanReview && (
              <p className="text-xs font-semibold text-amber-800">
                Human review required before using this output externally.
              </p>
            )}
            {aiResult.gated && (
              <p className="text-xs text-text-muted">
                Stub mode (set GEMINI_API_KEY for live inference). Model:{" "}
                {aiResult.model}
              </p>
            )}
            {!aiResult.gated && (
              <p className="text-xs text-text-muted">Model: {aiResult.model}</p>
            )}
            <pre className="whitespace-pre-wrap font-sans text-sm text-ink">
              {aiResult.text}
            </pre>
            {aiSessionId && (
              <p className="text-xs text-text-muted">Session: {aiSessionId}</p>
            )}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-serif text-xl mb-3">Deadlines</h3>
        <form onSubmit={addDeadline} className="grid sm:grid-cols-4 gap-2 mb-4">
          <input
            value={deadlineTitle}
            onChange={(e) => setDeadlineTitle(e.target.value)}
            placeholder="Title"
            className="border border-black/15 px-3 py-2 text-sm sm:col-span-2"
            required
          />
          <input
            type="datetime-local"
            value={deadlineDue}
            onChange={(e) => setDeadlineDue(e.target.value)}
            className="border border-black/15 px-3 py-2 text-sm"
            required
          />
          <select
            value={deadlineKind}
            onChange={(e) => setDeadlineKind(e.target.value)}
            className="border border-black/15 px-3 py-2 text-sm"
          >
            {["hearing", "filing", "limitation", "obligation", "general"].map(
              (k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              )
            )}
          </select>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white sm:col-span-4 disabled:opacity-50"
          >
            Add deadline
          </button>
        </form>
        <ul className="space-y-2">
          {deadlines.length === 0 ? (
            <li className="text-sm text-text-muted">No deadlines yet.</li>
          ) : (
            deadlines.map((d) => (
              <li
                key={d.id}
                className="border border-black/10 bg-white p-3 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-medium">
                    {d.title}{" "}
                    <span className="text-xs text-text-muted capitalize">
                      · {d.kind} · {d.status}
                    </span>
                  </p>
                  <p className="text-xs text-text-muted">
                    Due {new Date(d.due_at).toLocaleString()}
                  </p>
                </div>
                {d.status === "open" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setDeadlineStatus(d.id, "done")}
                      className="text-xs font-semibold text-primary"
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setDeadlineStatus(d.id, "missed")}
                      className="text-xs font-semibold text-text-muted"
                    >
                      Missed
                    </button>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h3 className="font-serif text-xl mb-3">Contracts</h3>
        <form onSubmit={addContract} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            value={contractTitle}
            onChange={(e) => setContractTitle(e.target.value)}
            placeholder="Contract title"
            className="flex-1 border border-black/15 px-3 py-2 text-sm"
            required
          />
          <input
            value={contractParty}
            onChange={(e) => setContractParty(e.target.value)}
            placeholder="Counterparty"
            className="flex-1 border border-black/15 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Add
          </button>
        </form>
        <p className="text-xs text-text-muted mb-2">
          New contracts optionally link the first matter document when present.
        </p>
        <ul className="space-y-2">
          {contracts.length === 0 ? (
            <li className="text-sm text-text-muted">No contracts yet.</li>
          ) : (
            contracts.map((c) => (
              <li
                key={c.id}
                className="border border-black/10 bg-white p-3 text-sm space-y-2"
              >
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-text-muted capitalize">
                    {c.status}
                    {c.counterparty ? ` · ${c.counterparty}` : ""}
                    {c.document_id ? " · linked doc" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.status === "draft" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setContractStatus(c.id, "in_review")}
                      className="text-xs font-semibold text-primary"
                    >
                      → in_review
                    </button>
                  )}
                  {c.status === "in_review" && (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setContractStatus(c.id, "executed")}
                        className="text-xs font-semibold text-primary"
                      >
                        → executed
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setContractStatus(c.id, "draft")}
                        className="text-xs font-semibold"
                      >
                        ← draft
                      </button>
                    </>
                  )}
                  {c.status === "executed" && (
                    <>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setContractStatus(c.id, "expired")}
                        className="text-xs font-semibold"
                      >
                        → expired
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setContractStatus(c.id, "terminated")}
                        className="text-xs font-semibold text-text-muted"
                      >
                        → terminated
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section>
        <h3 className="font-serif text-xl mb-3">Billing</h3>
        {payments.length === 0 && escrows.length === 0 ? (
          <p className="text-sm text-text-muted">
            No payments yet. Pay escrow from bookings after scheduling.
          </p>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="border border-black/10 bg-white p-3 text-sm">
                <p className="font-medium">
                  {p.amount} {p.currency.toUpperCase()} · {p.status}
                </p>
                <p className="text-xs text-text-muted">{p.description}</p>
              </div>
            ))}
            {escrows.map((e) => (
              <div
                key={e.id}
                className="border border-black/10 bg-white p-3 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium capitalize">
                    Escrow {e.status} · {e.amount} {e.currency.toUpperCase()}
                  </p>
                  <p className="text-xs text-text-muted">
                    Client {e.client_confirmed ? "confirmed" : "pending"} · Lawyer{" "}
                    {e.lawyer_confirmed ? "confirmed" : "pending"}
                  </p>
                </div>
                {e.status === "held" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => confirmEscrow(e)}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
                  >
                    Confirm release
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

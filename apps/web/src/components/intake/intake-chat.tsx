"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  intakeOpeningMessage,
  INTAKE_DRAFT_STORAGE_KEY,
  type IntakeChatMessage,
} from "@/features/marketplace/intake-chat";
import type { StructuredIntake } from "@/features/marketplace/intake";

type Mode = "portal" | "public";

type Props = {
  mode: Mode;
  /** When public and complete without session, send here */
  authRedirect?: string;
};

export default function IntakeChat({
  mode,
  authRedirect = "/register?role=client&next=/client/intake",
}: Props) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IntakeChatMessage[]>([
    intakeOpeningMessage(),
  ]);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<StructuredIntake | null>(null);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, complete]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(INTAKE_DRAFT_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        messages?: IntakeChatMessage[];
        draft?: StructuredIntake;
        complete?: boolean;
      };
      if (saved.messages?.length) setMessages(saved.messages);
      if (saved.draft) setDraft(saved.draft);
      if (saved.complete) setComplete(true);
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: {
    messages: IntakeChatMessage[];
    draft: StructuredIntake | null;
    complete: boolean;
  }) {
    try {
      sessionStorage.setItem(INTAKE_DRAFT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: IntakeChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          draft: draft ?? undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Chat failed");
        return;
      }

      const reply = json.data.reply as string;
      const nextDraft = json.data.draft as StructuredIntake;
      const isComplete = Boolean(json.data.complete);

      const withAssistant: IntakeChatMessage[] = [
        ...nextMessages,
        { role: "assistant", content: reply },
      ];
      setMessages(withAssistant);
      setDraft(nextDraft);
      setComplete(isComplete);
      persist({
        messages: withAssistant,
        draft: nextDraft,
        complete: isComplete,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function findLawyers() {
    if (!draft) return;
    setSaving(true);
    setError(null);

    const message =
      draft.summary ||
      messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join("\n");

    try {
      const res = await fetch("/api/v1/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Could not save intake");
        return;
      }

      const leadId = json.data?.lead?.id as string | undefined;
      const leadDraft = (json.data?.leadDraft ?? draft) as StructuredIntake;

      if (leadId) {
        try {
          sessionStorage.removeItem(INTAKE_DRAFT_STORAGE_KEY);
        } catch {
          /* ignore */
        }
        const params = new URLSearchParams({ leadId });
        if (leadDraft.practiceArea) params.set("practiceArea", leadDraft.practiceArea);
        if (leadDraft.jurisdiction) params.set("jurisdiction", leadDraft.jurisdiction);
        router.push(`/client/matches?${params.toString()}`);
        return;
      }

      // Guest / unauthenticated
      persist({ messages, draft, complete: true });
      if (mode === "public") {
        router.push(authRedirect);
        return;
      }
      setError(
        json.data?.message ??
          "Sign in to save your case and see lawyer matches."
      );
    } catch {
      setError("Could not continue to matches.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-ivory shadow-[0_20px_50px_-30px_rgba(15,14,13,0.4)] overflow-hidden min-h-[480px] max-h-[640px]">
      <div className="px-5 py-4 border-b border-gray-100 bg-[#f5f3ef]/80 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            AI Intake
          </p>
          <p className="text-sm text-gray-600 mt-0.5">
            Case interview → structure → lawyer match
          </p>
        </div>
        {draft?.practiceArea || draft?.jurisdiction ? (
          <div className="text-right text-xs text-gray-500 hidden sm:block">
            {draft.practiceArea ? (
              <div className="font-medium text-ink capitalize">
                {draft.practiceArea.replace(/_/g, " ")}
              </div>
            ) : null}
            {draft.jurisdiction ? <div>{draft.jurisdiction}</div> : null}
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gradient-to-b from-ivory to-[#f5f3ef]/60">
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-primary !text-white rounded-br-md"
                  : "bg-[#f5f3ef] text-gray-700 rounded-bl-md"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="text-sm text-gray-500">Thinking…</div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {complete && draft ? (
        <div className="border-t border-gray-100 px-5 py-4 bg-ivory space-y-3">
          <div className="text-sm text-gray-700">
            <span className="font-semibold text-ink">Case ready.</span>{" "}
            {draft.summary.slice(0, 160)}
            {draft.summary.length > 160 ? "…" : ""}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => void findLawyers()}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
            >
              {saving
                ? "Matching…"
                : mode === "public"
                  ? "Continue to lawyer matches"
                  : "Find matched lawyers"}
            </button>
            {mode === "public" ? (
              <Link
                href="/login?next=/client/intake"
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover"
              >
                Already have an account? Log in
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <form
          className="border-t border-gray-100 p-3 flex gap-2 bg-ivory"
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your situation…"
            className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
          >
            Send
          </button>
        </form>
      )}

      {error ? (
        <p className="px-5 pb-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Volume2, VolumeX, X } from "lucide-react";
import {
  INTAKE_DRAFT_STORAGE_KEY,
  type IntakeChatMessage,
  type PersistedIntakeChat,
} from "@/features/marketplace/intake-chat";
import type { StructuredIntake } from "@/features/marketplace/intake";
import type { ChatSessionData } from "@/lib/intake/types";
import { HARDCODED_QUICK_QUESTIONS } from "@/lib/intake/hardcoded-questions";
import { speakSequence, speakText, stopSpeech } from "@/lib/intake/speech";

type Mode = "portal" | "public";

type Props = {
  mode: Mode;
  authRedirect?: string;
  /** Show voice toggle in header (unified BARRI agent). Voice defaults off. */
  showVoiceToggle?: boolean;
  onClose?: () => void;
};

export default function IntakeChat({
  mode,
  authRedirect = "/register?role=client&next=/client/intake",
  showVoiceToggle = false,
  onClose,
}: Props) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const voiceEnabledRef = useRef(false);
  const [messages, setMessages] = useState<IntakeChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<StructuredIntake | null>(null);
  const [session, setSession] = useState<ChatSessionData | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Voice is off by default */
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
    if (!voiceEnabled) stopSpeech();
  }, [voiceEnabled]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  const maybeSpeak = useCallback((text: string) => {
    if (!voiceEnabledRef.current) return;
    speakText(text);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, complete, options, loading]);

  const persist = useCallback((next: PersistedIntakeChat) => {
    try {
      sessionStorage.setItem(INTAKE_DRAFT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const applyServerResult = useCallback(
    (
      json: {
        reply?: string;
        botMessages?: string[];
        options?: string[];
        draft?: StructuredIntake;
        session?: ChatSessionData;
        complete?: boolean;
      },
      priorUser?: string
    ) => {
      const botParts =
        json.botMessages?.length
          ? json.botMessages
          : json.reply
            ? [json.reply]
            : [];
      setMessages((prev) => {
        const base = priorUser
          ? [...prev, { role: "user" as const, content: priorUser }]
          : prev;
        const withBot: IntakeChatMessage[] = [
          ...base,
          ...botParts.map((content) => ({
            role: "assistant" as const,
            content,
          })),
        ];
        const nextDraft = json.draft ?? null;
        const nextComplete = Boolean(json.complete);
        persist({
          messages: withBot,
          draft: nextDraft,
          session: json.session ?? null,
          options: json.options ?? [],
          complete: nextComplete,
        });
        return withBot;
      });
      if (json.draft) setDraft(json.draft);
      if (json.session) setSession(json.session);
      setOptions(json.options ?? []);
      setComplete(Boolean(json.complete));
    },
    [persist]
  );

  const startChat = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Could not start intake");
        return;
      }
      setMessages([]);
      applyServerResult(json.data);
      const greeting =
        json.data.botMessages?.join(" ") || json.data.reply || "";
      if (greeting) maybeSpeak(greeting);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [applyServerResult, maybeSpeak]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    try {
      const raw = sessionStorage.getItem(INTAKE_DRAFT_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PersistedIntakeChat;
        if (saved.session && saved.messages?.length) {
          setMessages(saved.messages);
          setDraft(saved.draft);
          setSession(saved.session);
          setOptions(saved.options ?? []);
          setComplete(Boolean(saved.complete));
          return;
        }
      }
    } catch {
      /* ignore */
    }

    void startChat();
  }, [startChat]);

  async function sendTurn(params: {
    text?: string;
    selectedOption?: string;
  }) {
    const selectedOption = params.selectedOption?.trim();
    const text = params.text?.trim();
    if ((!text && !selectedOption) || loading) return;

    const displayUser = selectedOption || text || "";

    setInput("");
    setLoading(true);
    setError(null);

    // Optimistic user bubble for free text; chips also show as user
    setMessages((prev) => [
      ...prev,
      { role: "user", content: displayUser },
    ]);

    try {
      const res = await fetch("/api/v1/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: selectedOption ? "quick_reply" : "message",
          text: selectedOption ? undefined : text,
          selectedOption: selectedOption || undefined,
          session: session ?? undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Chat failed");
        return;
      }

      const botParts: string[] =
        json.data.botMessages?.length > 0
          ? json.data.botMessages
          : json.data.reply
            ? [json.data.reply]
            : [];

      setMessages((prev) => {
        const withBot: IntakeChatMessage[] = [
          ...prev,
          ...botParts.map((content) => ({
            role: "assistant" as const,
            content,
          })),
        ];
        persist({
          messages: withBot,
          draft: json.data.draft ?? null,
          session: json.data.session ?? null,
          options: json.data.options ?? [],
          complete: Boolean(json.data.complete),
        });
        return withBot;
      });
      setDraft(json.data.draft ?? null);
      setSession(json.data.session ?? null);
      setOptions(json.data.options ?? []);
      setComplete(Boolean(json.data.complete));

      if (voiceEnabledRef.current) {
        // Read clicked option/question, then the assistant reply
        speakSequence([displayUser, botParts.join(" ")].filter(Boolean));
      }
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
        body: JSON.stringify({ message, draft }),
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
        if (leadDraft.practiceArea)
          params.set("practiceArea", leadDraft.practiceArea);
        if (leadDraft.jurisdiction)
          params.set("jurisdiction", leadDraft.jurisdiction);
        router.push(`/client/matches?${params.toString()}`);
        return;
      }

      persist({
        messages,
        draft,
        session,
        options,
        complete: true,
      });
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
            BARRI
          </p>
          <p className="text-sm text-gray-600 mt-0.5">
            Chat intake · voice optional
          </p>
        </div>
        <div className="flex items-center gap-2">
          {draft?.practiceArea || draft?.jurisdiction ? (
            <div className="text-right text-xs text-gray-500 hidden sm:block mr-1">
              {draft.practiceArea ? (
                <div className="font-medium text-ink capitalize">
                  {draft.practiceArea.replace(/_/g, " ")}
                </div>
              ) : null}
              {draft.jurisdiction ? <div>{draft.jurisdiction}</div> : null}
            </div>
          ) : null}
          {showVoiceToggle ? (
            <button
              type="button"
              onClick={() => setVoiceEnabled((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
                voiceEnabled
                  ? "bg-primary text-on-primary"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-primary/40"
              }`}
              aria-pressed={voiceEnabled}
              title={
                voiceEnabled
                  ? "Voice on — click to mute"
                  : "Voice off — click to enable system speech"
              }
            >
              {voiceEnabled ? (
                <Volume2 className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <VolumeX className="h-3.5 w-3.5" aria-hidden />
              )}
              {voiceEnabled ? "Voice on" : "Voice off"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              stopSpeech();
              try {
                sessionStorage.removeItem(INTAKE_DRAFT_STORAGE_KEY);
              } catch {
                /* ignore */
              }
              startedRef.current = true;
              void startChat();
            }}
            className="text-xs font-semibold text-primary hover:text-primary-hover"
          >
            Restart
          </button>
          {onClose ? (
            <button
              type="button"
              onClick={() => {
                stopSpeech();
                onClose();
              }}
              className="p-1.5 rounded-full text-ink/60 hover:text-ink hover:bg-gray-100 transition-colors"
              aria-label="Close BARRI"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
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
          <div className="text-sm text-gray-500" aria-live="polite">
            Thinking…
          </div>
        ) : null}

        {/* Hardcoded quick questions */}
        {!complete && !loading && messages.length > 0 ? (
          <div className="pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 mb-2">
              Quick questions
            </p>
            <div className="flex flex-wrap gap-2">
              {HARDCODED_QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={loading}
                  onClick={() => void sendTurn({ text: q })}
                  className="rounded-full border border-[#e5e3dc] bg-white px-3 py-1.5 text-left text-xs font-medium text-ink hover:border-primary hover:bg-primary/5 transition-colors max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {!complete && options.length > 0 && !loading ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <p className="w-full text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
              Choose an option
            </p>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                disabled={loading}
                onClick={() => void sendTurn({ selectedOption: opt })}
                className="rounded-full border border-primary/30 bg-white px-3.5 py-1.5 text-left text-xs sm:text-sm font-medium text-ink hover:border-primary hover:bg-primary/5 transition-colors max-w-full"
              >
                {opt}
              </button>
            ))}
          </div>
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
            void sendTurn({ text: input });
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or choose an option below…"
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

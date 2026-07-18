"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import IntakeChat from "@/components/intake/intake-chat";

function shouldHideFab(pathname: string): boolean {
  if (pathname === "/ai/intake") return true;
  if (
    pathname.startsWith("/client") ||
    pathname.startsWith("/lawyer") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return true;
  }
  return false;
}

export default function FloatingIntakeBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hidden = shouldHideFab(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (hidden) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="intake-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(100vw-2rem,400px)] max-h-[min(72vh,640px)] flex flex-col rounded-2xl border border-gray-200 bg-ivory shadow-[0_24px_60px_-20px_rgba(15,14,13,0.45)] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-ivory">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  AI Intake
                </p>
                <p className="text-sm text-gray-600">Describe your case</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full text-ink/60 hover:text-ink hover:bg-gray-100 transition-colors"
                aria-label="Close AI Intake"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden [&_>div]:min-h-[420px] [&_>div]:max-h-[520px] [&_>div]:rounded-none [&_>div]:border-0 [&_>div]:shadow-none">
              <IntakeChat mode="public" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((v) => !v)}
        className="h-14 w-14 rounded-full bg-primary text-on-primary shadow-[0_12px_32px_-8px_rgba(232,93,4,0.65)] flex items-center justify-center hover:bg-primary-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={open ? "Close AI Intake bot" : "Open AI Intake bot"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { NavFeatured, NavGroup, NavLink } from "@/lib/marketing/nav";

type MegaMenuProps = {
  groups: NavGroup[];
  onDark?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function LinkColumn({
  items,
  onNavigate,
}: {
  items: NavLink[];
  onNavigate: () => void;
}) {
  return (
    <ul className="space-y-8 list-none p-0 m-0">
      {items.map((item) => (
        <li key={item.href + item.name}>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="group block max-w-[280px]"
          >
            <span className="text-[15px] font-semibold tracking-tight text-white group-hover:text-primary transition-colors">
              {item.name}
            </span>
            {item.description ? (
              <span className="mt-2 block text-[13px] leading-[1.55] text-white/45 group-hover:text-white/60 transition-colors">
                {item.description}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FeaturedMedia({
  featured,
  onNavigate,
}: {
  featured: NavFeatured;
  onNavigate: () => void;
}) {
  const media = featured.media ?? "/bg-video.mp4";
  const isVideo = media.endsWith(".mp4") || media.endsWith(".webm");

  return (
    <Link href={featured.href} onClick={onNavigate} className="group block h-full">
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-[#141413]">
        {isVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-85"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          >
            <source src={media} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-85"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-end p-6 md:p-8">
          <span className="font-serif text-2xl md:text-3xl text-white tracking-tight">
            {featured.badge}
          </span>
        </div>
      </div>
      <h3 className="mt-5 text-[15px] font-semibold text-white group-hover:text-primary transition-colors">
        {featured.title}
      </h3>
      <p className="mt-2 text-[13px] leading-[1.55] text-white/45 max-w-md">
        {featured.description}
      </p>
    </Link>
  );
}

export default function MegaMenu({
  groups,
  onDark = false,
  onOpenChange,
}: MegaMenuProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();

  useEffect(() => setMounted(true), []);

  function clearClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function scheduleClose() {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }

  function openGroup(name: string) {
    clearClose();
    setOpen(name);
  }

  function close() {
    clearClose();
    setOpen(null);
  }

  useEffect(() => {
    onOpenChange?.(Boolean(open));
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => () => clearClose(), []);

  const active = groups.find((g) => g.name === open) ?? null;
  const triggerBase = onDark
    ? "text-sm font-medium !text-white/85 hover:!text-white"
    : "text-sm font-medium text-ink/80 hover:text-ink";

  const panel =
    mounted &&
    createPortal(
      <AnimatePresence>
        {active ? (
          <>
            {/* Full-viewport dim below the black mega surface */}
            <motion.button
              key="mega-backdrop"
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[45] hidden lg:block bg-black/55 backdrop-blur-[2px]"
              onClick={close}
            />

            {/* Edge-to-edge black mega screen under navbar */}
            <motion.div
              key="mega-panel"
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label={`${active.name} menu`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-0 z-[48] hidden lg:block bg-black pt-[72px]"
              onMouseEnter={clearClose}
              onMouseLeave={scheduleClose}
            >
              <div className="w-screen max-w-[100vw] border-b border-white/[0.06]">
                <div className="container-wide py-14 xl:py-16">
                  <div className="grid grid-cols-12 gap-12 xl:gap-20 items-start">
                    <div
                      className={`col-span-12 ${
                        active.featured
                          ? "lg:col-span-7 xl:col-span-7"
                          : "lg:col-span-12"
                      }`}
                    >
                      <div
                        className={`grid gap-12 xl:gap-16 ${
                          (active.columns?.length ?? 0) > 1
                            ? "sm:grid-cols-2"
                            : "grid-cols-1 max-w-sm"
                        }`}
                      >
                        {active.columns
                          ? active.columns.map((col, i) => (
                              <div key={col.title ?? `col-${i}`}>
                                {col.title ? (
                                  <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
                                    {col.title}
                                  </p>
                                ) : null}
                                <LinkColumn
                                  items={col.items}
                                  onNavigate={close}
                                />
                              </div>
                            ))
                          : (
                              <LinkColumn
                                items={active.items ?? []}
                                onNavigate={close}
                              />
                            )}
                      </div>
                    </div>

                    {active.featured ? (
                      <div className="col-span-12 lg:col-span-5 xl:col-span-5">
                        <FeaturedMedia
                          featured={active.featured}
                          onNavigate={close}
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Mega footer — Request a Demo on every panel */}
                  <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-white/45">
                      Prefer a guided walkthrough of Marketplace, AI, and PracticeOS?
                    </p>
                    <Link
                      href="/request-demo"
                      onClick={close}
                      className="inline-flex items-center justify-center self-start rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
                    >
                      Request a Demo
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      <nav
        className="flex items-center gap-0.5 flex-nowrap"
        onMouseLeave={scheduleClose}
        onMouseEnter={clearClose}
      >
        {groups.map((group) => {
          const hasMenu = Boolean(group.columns?.length || group.items?.length);
          const isOpen = open === group.name;

          if (!hasMenu) {
            return (
              <Link
                key={group.name}
                href={group.href ?? "#"}
                className={`${triggerBase} relative px-2.5 xl:px-3.5 py-2 transition-colors whitespace-nowrap`}
              >
                {group.name}
              </Link>
            );
          }

          return (
            <button
              key={group.name}
              type="button"
              className={`${triggerBase} relative inline-flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3.5 py-2 transition-colors whitespace-nowrap ${
                isOpen ? "!text-white" : ""
              }`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onMouseEnter={() => openGroup(group.name)}
              onFocus={() => openGroup(group.name)}
              onClick={() => setOpen(isOpen ? null : group.name)}
            >
              {group.name}
              <ChevronDown
                className={`h-3.5 w-3.5 opacity-60 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
              <span
                className={`absolute left-2.5 right-2.5 xl:left-3.5 xl:right-3.5 bottom-0 h-px bg-white transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </nav>
      {panel}
    </>
  );
}

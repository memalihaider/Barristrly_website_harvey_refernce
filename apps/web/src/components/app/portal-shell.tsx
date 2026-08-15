"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Search,
  Command,
} from "lucide-react";
import {
  PORTAL_META,
  railForPath,
  titleForPath,
  type PortalRole,
} from "@/lib/portal/portal-nav";

type ShellState = {
  contextOpen: boolean;
  pinnedRail: string | null;
};

function loadState(storageKey: string): ShellState {
  if (typeof window === "undefined") {
    return { contextOpen: true, pinnedRail: null };
  }
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { contextOpen: true, pinnedRail: null };
    const parsed = JSON.parse(raw) as Partial<ShellState>;
    return {
      contextOpen: parsed.contextOpen ?? true,
      pinnedRail: parsed.pinnedRail ?? null,
    };
  } catch {
    return { contextOpen: true, pinnedRail: null };
  }
}

export default function PortalShell({
  role,
  children,
}: {
  role: PortalRole;
  children: ReactNode;
}) {
  const meta = PORTAL_META[role];
  const pathname = usePathname();
  const router = useRouter();
  const pathRail = useMemo(
    () => railForPath(role, pathname),
    [role, pathname],
  );
  const pageTitle = useMemo(
    () => titleForPath(role, pathname),
    [role, pathname],
  );

  const [contextOpen, setContextOpen] = useState(true);
  const [activeRailId, setActiveRailId] = useState(pathRail.id);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    const s = loadState(meta.storageKey);
    setContextOpen(s.contextOpen);
  }, [meta.storageKey]);

  useEffect(() => {
    setActiveRailId(pathRail.id);
    setMobileNav(false);
  }, [pathRail.id, pathname]);

  const persist = useCallback(
    (next: Partial<ShellState>) => {
      try {
        const cur = loadState(meta.storageKey);
        localStorage.setItem(
          meta.storageKey,
          JSON.stringify({ ...cur, ...next }),
        );
      } catch {
        /* ignore */
      }
    },
    [meta.storageKey],
  );

  const activeRail =
    meta.rails.find((r) => r.id === activeRailId) ?? pathRail;

  function selectRail(id: string) {
    const rail = meta.rails.find((r) => r.id === id);
    setActiveRailId(id);
    setContextOpen(true);
    persist({ contextOpen: true, pinnedRail: id });
    if (!rail) return;
    const root = `/${role}`;
    const onRail = rail.items.some(
      (item) =>
        pathname === item.href ||
        (item.href !== root && pathname.startsWith(item.href + "/")),
    );
    if (!onRail) {
      router.push(rail.href);
    }
  }

  function toggleContext() {
    setContextOpen((v) => {
      persist({ contextOpen: !v });
      return !v;
    });
  }

  const initials =
    role === "admin" ? "SA" : role === "lawyer" ? "LW" : "CL";

  return (
    <div className="min-h-dvh bg-[#f4f2ee] text-ink flex">
      <aside
        className="fixed inset-y-0 left-0 z-40 w-[56px] bg-[#1c1b19] text-white flex flex-col items-center py-3 gap-1 border-r border-black/40"
        aria-label="Global navigation"
      >
        <Link
          href={meta.homeHref}
          className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary font-serif text-sm font-bold tracking-tight shadow-[0_8px_20px_-8px_rgba(232,93,4,0.7)]"
          title={`Barristrly ${meta.brandLabel}`}
        >
          B
        </Link>

        <nav className="flex flex-1 flex-col items-center gap-0.5 w-full px-1.5">
          {meta.rails.map((rail) => {
            const Icon = rail.icon;
            const active = activeRailId === rail.id;
            return (
              <button
                key={rail.id}
                type="button"
                title={rail.label}
                onClick={() => {
                  selectRail(rail.id);
                  setMobileNav(true);
                }}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/55 hover:bg-white/8 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {active ? (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
                ) : null}
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col items-center gap-2 px-1.5 pb-1">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary-light"
            title={meta.badgeLabel}
          >
            {initials}
          </span>
        </div>
      </aside>

      <aside
        className={`fixed inset-y-0 left-[56px] z-30 flex flex-col border-r border-black/10 bg-white transition-[width,transform] duration-200 ease-out
          ${contextOpen ? "w-[260px] translate-x-0" : "w-0 -translate-x-2 overflow-hidden border-0"}
          ${mobileNav ? "max-md:translate-x-0 max-md:w-[260px]" : "max-md:-translate-x-full max-md:w-[260px]"}
          md:translate-x-0`}
        aria-label="Context sidebar"
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-black/8 px-4">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {activeRail.label}
            </p>
            <p className="truncate text-sm font-semibold text-ink">
              {activeRail.sidebarTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleContext}
            className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-surface-soft hover:text-ink"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 pt-3 pb-2">
          <p className="px-2 text-[11px] leading-relaxed text-gray-500">
            {activeRail.sidebarSubtitle}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          <ul className="space-y-0.5 list-none p-0 m-0">
            {activeRail.items.map((item) => {
              const Icon = item.icon;
              const root = `/${role}`;
              const active =
                pathname === item.href ||
                (item.href !== root && pathname.startsWith(item.href + "/"));
              return (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileNav(false)}
                    className={`group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-ink/80 hover:bg-surface-soft hover:text-ink"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-primary text-on-primary"
                          : "bg-[#f4f2ee] text-gray-500 group-hover:text-ink"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">
                          {item.label}
                        </span>
                        {item.badge ? (
                          <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                            {item.badge}
                          </span>
                        ) : null}
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 block text-[11px] leading-snug text-gray-500">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-black/8 px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {meta.badgeLabel} · live
          </div>
        </div>
      </aside>

      {mobileNav ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNav(false)}
        />
      ) : null}

      <div
        className={`flex min-w-0 flex-1 flex-col transition-[margin] duration-200 ${
          contextOpen ? "md:ml-[316px]" : "md:ml-[56px]"
        } ml-[56px]`}
      >
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-black/8 bg-white/95 px-4 backdrop-blur-md md:px-6">
          {!contextOpen ? (
            <button
              type="button"
              onClick={toggleContext}
              className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-surface-soft hover:text-ink"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setMobileNav(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-surface-soft md:hidden"
            aria-label="Open menu"
          >
            <Command className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span>{meta.brandLabel}</span>
              <span>/</span>
              <span className="truncate">{activeRail.sidebarTitle}</span>
            </div>
            <h1 className="truncate font-serif text-lg tracking-tight text-ink md:text-xl">
              {pageTitle}
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-black/10 bg-[#faf9f6] px-3 py-1.5 text-xs text-gray-500">
            <Search className="h-3.5 w-3.5" />
            <span>Search console</span>
            <kbd className="ml-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-gray-400 border border-black/5">
              ⌘K
            </kbd>
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            <Shield className="h-3.5 w-3.5" />
            {meta.badgeLabel}
          </span>

          <Link
            href="/login"
            className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-ivory hover:bg-black transition-colors"
          >
            Sign out
          </Link>
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

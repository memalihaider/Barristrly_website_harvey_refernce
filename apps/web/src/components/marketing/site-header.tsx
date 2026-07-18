"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GradientButton from "@/components/ui/gradient-button";
import MegaMenu from "@/components/marketing/mega-menu";
import { PRIMARY_NAV } from "@/lib/marketing/nav";

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  const onMegaOpenChange = useCallback((open: boolean) => {
    setMegaOpen(open);
  }, []);

  const onDark = isHome || megaOpen;

  const headerShell =
    megaOpen || (isHome && !isScrolled)
      ? megaOpen
        ? "bg-black py-5"
        : "bg-transparent py-6"
      : isHome && isScrolled
        ? "bg-gray-950/90 backdrop-blur-md border-b border-white/10 shadow-lg py-4"
        : isScrolled
          ? "bg-ivory/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-3"
          : "bg-ivory/90 backdrop-blur-sm border-b border-transparent py-4";

  // Always orange wordmark (home + mega + cream pages)
  const logoClass =
    "font-serif text-2xl font-bold tracking-wider text-primary transition-colors duration-200";

  const loginClass = onDark
    ? "text-sm font-medium !text-white/90 hover:!text-white transition-colors duration-200"
    : "text-sm font-medium text-ink/80 hover:text-ink transition-colors duration-200";

  const mobileBtnClass = onDark
    ? "text-white hover:text-white/80"
    : "text-ink hover:text-primary";

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${headerShell}`}
      >
        <div className="container-wide flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center group shrink-0">
            <span className={logoClass}>BARRISTRLY</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <MegaMenu
              groups={PRIMARY_NAV}
              onDark={onDark}
              onOpenChange={onMegaOpenChange}
            />
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link href="/login" className={loginClass}>
              Log In
            </Link>
            <GradientButton
              size="sm"
              href="/find-lawyers"
              variant="outline"
              className="!text-primary !border-primary hover:!bg-primary/10"
            >
              Match my Lawyer
            </GradientButton>
            <GradientButton size="sm" href="/ai/intake">
              AI Intake
            </GradientButton>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg focus:outline-none transition-colors duration-200 ${mobileBtnClass}`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-40 lg:hidden shadow-xl p-6 flex flex-col gap-6 max-h-[calc(100dvh-72px)] overflow-y-auto bg-black border-b border-white/10"
          >
            <nav className="flex flex-col gap-6">
              {PRIMARY_NAV.map((group) => {
                if (group.href && !group.columns && !group.items) {
                  return (
                    <Link
                      key={group.name}
                      href={group.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-semibold !text-white hover:text-primary"
                    >
                      {group.name}
                    </Link>
                  );
                }
                const links =
                  group.columns?.flatMap((c) => c.items) ?? group.items ?? [];
                const seen = new Set<string>();
                const unique = links.filter((item) => {
                  const key = item.href + item.name;
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                });
                return (
                  <div key={group.name} className="space-y-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                      {group.name}
                    </p>
                    <div className="flex flex-col gap-3">
                      {unique.map((item) => (
                        <Link
                          key={item.href + item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-base font-semibold !text-white hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
            <div className="h-px bg-white/10" />
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-base font-semibold !text-white hover:text-primary"
              >
                Log In
              </Link>
              <GradientButton
                href="/find-lawyers"
                size="md"
                variant="outline"
                className="w-full text-center !border-primary !text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Match my Lawyer
              </GradientButton>
              <GradientButton
                href="/ai/intake"
                size="md"
                className="w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Intake
              </GradientButton>
              <Link
                href="/request-demo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-sm font-medium text-white/60 hover:text-primary py-1"
              >
                Request a Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

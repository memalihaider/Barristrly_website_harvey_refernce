"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Platform", href: "#platform" },
    { name: "Solutions", href: "#solutions" },
    { name: "Capabilities", href: "#platform-bento" },
    { name: "Security", href: "#security" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-950/90 backdrop-blur-md border-b border-white/10 shadow-lg py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container-wide flex items-center justify-between">
          {/* Logo - Bold Golden uppercase without icon */}
          <Link href="/" className="flex items-center group">
            <span className="font-serif text-2xl font-bold tracking-wider text-[#D4AF37] transition-colors duration-200">
              BARRISTRLY
            </span>
          </Link>

          {/* Navigation Links - Desktop White font colors */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold !text-white hover:text-amber-400 transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all hover:after:w-full"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTAs - Desktop White font colors */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/login"
              className="text-sm font-semibold !text-white hover:text-amber-400 transition-colors duration-200"
            >
              Log In
            </Link>
            <GradientButton size="sm" showArrow href="#cta">
              Request a Demo
            </GradientButton>
          </div>

          {/* Mobile Menu Button - White color */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg focus:outline-none transition-colors duration-200 text-white hover:text-amber-400"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer - Dark theme to support white font colors */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden bg-gray-950 border-b border-white/10 shadow-xl p-6 flex flex-col gap-6"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold !text-white hover:text-amber-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="h-px bg-white/10" />
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-base font-semibold !text-white hover:text-amber-400 transition-colors"
              >
                Log In
              </Link>
              <GradientButton
                href="#cta"
                size="md"
                className="w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Request a Demo
              </GradientButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

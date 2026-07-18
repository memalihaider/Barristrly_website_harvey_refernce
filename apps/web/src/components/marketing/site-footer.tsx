import Link from "next/link";
import { FOOTER_COLUMNS } from "@/lib/marketing/nav";

export default function SiteFooter() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-10">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8 mb-16">
          <div className="col-span-2 space-y-5">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-wider !text-primary hover:!text-primary-hover transition-colors inline-block"
            >
              BARRISTRLY
            </Link>
            <p className="text-sm !text-white leading-relaxed max-w-xs">
              The legal operating system — Marketplace, AI, PracticeOS, and
              Enterprise for counsel who move with confidence.
            </p>
          </div>

          {FOOTER_COLUMNS.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] !text-white">
                {group.title}
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm !text-white hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs !text-white">
          <p>© 2026 Barristrly Technologies Inc. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/security" className="!text-white hover:text-primary transition-colors">
              Security
            </Link>
            <Link href="/about" className="!text-white hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/request-demo" className="!text-white hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

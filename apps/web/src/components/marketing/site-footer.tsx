import Link from "next/link";
import { FOOTER_COLUMNS } from "@/lib/marketing/nav";

export default function SiteFooter() {
  return (
    <footer className="bg-primary border-t border-white/15 pt-16 pb-10 text-[#f5f3ef]">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8 mb-16">
          <div className="col-span-2 space-y-5">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-wider !text-[#f5f3ef] hover:!text-white transition-colors inline-block"
            >
              BARRISTRLY
            </Link>
            <p className="text-sm !text-[#f5f3ef]/90 leading-relaxed max-w-xs">
              Premier legal tech marketplace — anonymous directory, COI
              clearance, and confidential meetings with vetted providers.
            </p>
          </div>

          {FOOTER_COLUMNS.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] !text-[#f5f3ef]">
                {group.title}
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm !text-[#f5f3ef] hover:!text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs !text-[#f5f3ef]/90">
          <p className="!text-[#f5f3ef]/90">
            © 2026 Barristrly Technologies Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/terms"
              className="!text-[#f5f3ef] hover:!text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="!text-[#f5f3ef] hover:!text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/security"
              className="!text-[#f5f3ef] hover:!text-white transition-colors"
            >
              Security
            </Link>
            <Link
              href="/about"
              className="!text-[#f5f3ef] hover:!text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/request-demo"
              className="!text-[#f5f3ef] hover:!text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

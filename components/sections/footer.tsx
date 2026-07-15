import Link from "next/link";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { name: "Overview", href: "#platform" },
      { name: "AI Intake", href: "#solutions" },
      { name: "COI Screening", href: "#solutions" },
      { name: "Milestone Escrow", href: "#solutions" },
      { name: "Encrypted Consults", href: "#solutions" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { name: "Law Firms", href: "#solutions" },
      { name: "In-House Counsel", href: "#solutions" },
      { name: "Mid-Sized Firms", href: "#cases" },
      { name: "GCC Corridor", href: "#solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Case Studies", href: "#cases" },
      { name: "Security", href: "#security" },
      { name: "Customers", href: "#customers" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#cta" },
      { name: "Careers", href: "#cta" },
      { name: "Contact", href: "#cta" },
      { name: "Privacy", href: "#" },
    ],
  },
];

export default function Footer() {
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
              Privacy-first legal marketplace — AI intake, double-blind COI
              vetting, and escrow-protected consultations.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] !text-white">
                {group.title}
              </h4>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm !text-white hover:text-amber-400 transition-colors"
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
            <a href="#" className="!text-white hover:text-amber-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="!text-white hover:text-amber-400 transition-colors">
              Terms of Service
            </a>
            <a href="#security" className="!text-white hover:text-amber-400 transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

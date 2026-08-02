"use client";

import LogoTicker from "@/components/ui/logo-ticker";

const partners = [
  { name: "ADGM Registry" },
  { name: "DIFC Courts" },
  { name: "Dubai Land Dept" },
  { name: "UAE Laws Applied" },
  { name: "GCC Arbitration" },
  { name: "Abu Dhabi Courts" },
  { name: "London Commercial Court" },
];

export default function TrustBar() {
  return (
    <section
      id="customers"
      className="border-y border-white/20 py-12 md:py-14"
      aria-label="Trusted partners"
    >
      <div className="container-wide">
        <p className="mb-6 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/75">
          Trusted across forums &amp; corridors
        </p>
        <LogoTicker partners={partners} edgeFrom="#e85d04" />
      </div>
    </section>
  );
}

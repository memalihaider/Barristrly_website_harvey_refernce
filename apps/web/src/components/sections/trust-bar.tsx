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
      className="bg-black border-y border-white/10 py-12 md:py-14"
      aria-label="Trusted partners"
    >
      <div className="container-wide">
        <LogoTicker partners={partners} />
      </div>
    </section>
  );
}

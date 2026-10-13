const BADGES = [
  "Verified MOJ Advocates",
  "DIFC / ADGM Practitioners",
  "FTA-Registered Tax Agents",
  "24-Hour SLA",
  "UAE PDPL Data Protection",
];

export default function TrustBar() {
  return (
    <section
      id="customers"
      className="border-y border-[#e5e3dc] py-12 md:py-14"
      aria-label="Trust and regulatory compliance"
    >
      <div className="container-wide">
        <p className="mb-6 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Trust & regulatory compliance
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-[#e5e3dc] bg-white px-4 py-2 text-xs font-semibold text-ink"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

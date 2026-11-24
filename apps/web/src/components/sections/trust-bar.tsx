const BADGES = [
  "Vetted, licensed UAE lawyers",
  "Mainland, DIFC & ADGM",
  "Reply within 48 hours",
  "Upfront AED pricing",
  "Confidential handling",
  "Free to submit a brief",
];

export default function TrustBar() {
  return (
    <section
      id="customers"
      className="border-y border-[#e5e3dc] py-12 md:py-14"
      aria-label="Why clients trust Barristrly"
    >
      <div className="container-wide">
        <p className="mb-6 text-center text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Why people choose Barristrly
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

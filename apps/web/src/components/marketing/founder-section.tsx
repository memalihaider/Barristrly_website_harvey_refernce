import { FOUNDER } from "@/lib/marketing/founder";

export default function FounderSection() {
  return (
    <section
      id="founder"
      aria-labelledby="founder-name"
      className="relative scroll-mt-28 bg-[#0a0a09] text-ivory"
    >
      <div className="container-wide py-20 md:py-28 lg:py-32">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Founder
          </p>
          <h2
            id="founder-name"
            className="mt-4 font-serif text-[clamp(2rem,5vw,3.75rem)] font-bold tracking-[0.04em] text-primary"
          >
            {FOUNDER.nameDisplay}
          </h2>
          <p className="mt-3 font-serif text-base md:text-lg italic text-[#d4a84b]">
            {FOUNDER.title}
          </p>
        </header>

        <div
          className="mx-auto mt-10 md:mt-12 h-px max-w-3xl bg-gradient-to-r from-transparent via-white/25 to-transparent"
          aria-hidden
        />

        <div className="mx-auto mt-10 md:mt-12 max-w-3xl">
          <ul className="mb-10 flex flex-wrap justify-center gap-2 list-none p-0 m-0">
            {FOUNDER.credentials.map((c) => (
              <li
                key={c}
                className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/70"
              >
                {c}
              </li>
            ))}
          </ul>

          <div className="space-y-6 text-[15px] md:text-base leading-[1.75] text-white/75">
            {FOUNDER.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

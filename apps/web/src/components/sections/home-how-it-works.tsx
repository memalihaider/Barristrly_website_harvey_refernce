import Link from "next/link";
import GradientButton from "@/components/ui/gradient-button";

const STEPS = [
  {
    title: "Tell us what you need",
    body: "Share a short, free brief — a contract, company setup, Will, retainer or dispute. It takes about three minutes.",
  },
  {
    title: "Get matched with vetted lawyers",
    body: "We match you with up to three licensed UAE professionals who fit your matter, jurisdiction and budget.",
  },
  {
    title: "Compare and decide — within 48 hours",
    body: "Receive a clear scope and AED quote. Only proceed when you are comfortable. No obligation, no hidden fees.",
  },
];

export default function HomeHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-padding bg-[#f7f5f1] text-ink"
      aria-labelledby="home-how-heading"
    >
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 md:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
              How it works
            </p>
            <h2
              id="home-how-heading"
              className="font-serif text-[clamp(1.85rem,3.5vw,3rem)] text-ink tracking-tight leading-[1.08]"
            >
              Find a lawyer in Dubai in three simple steps
            </h2>
          </div>
          <Link
            href="/how-it-works"
            className="text-sm font-semibold text-primary hover:underline shrink-0"
          >
            Learn more about the process →
          </Link>
        </div>

        <ol className="grid md:grid-cols-3 gap-8 md:gap-6 list-none p-0 m-0">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-black/15 pt-6">
              <p className="font-serif text-4xl text-primary tracking-tight">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-xl md:text-2xl text-ink tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2.5 text-gray-600 leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <GradientButton href="/ai/intake" size="lg" variant="primary">
            Get a free lawyer match
          </GradientButton>
          <span className="text-sm text-gray-500">
            Free to submit · Confidential · Reply within 48 hours
          </span>
        </div>
      </div>
    </section>
  );
}

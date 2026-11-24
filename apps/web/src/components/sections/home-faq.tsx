import Link from "next/link";
import FaqItem from "@/components/ui/faq-item";
import { HOME_FAQ } from "@/lib/marketing/home-faq";

export default function HomeFaq() {
  return (
    <section
      id="faq"
      className="section-padding bg-white text-ink border-t border-[#e5e3dc]"
      aria-labelledby="home-faq-heading"
    >
      <div className="container-wide grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] gap-10 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-4">
            FAQ
          </p>
          <h2
            id="home-faq-heading"
            className="font-serif text-[clamp(1.85rem,3.5vw,3rem)] text-ink tracking-tight leading-[1.08]"
          >
            Questions about hiring a lawyer in the UAE
          </h2>
          <p className="mt-5 text-base md:text-lg text-gray-600 leading-relaxed">
            Straight answers on cost, coverage and how matching works. Still
            unsure?{" "}
            <Link href="/request-demo" className="font-semibold text-primary hover:underline">
              Ask us directly
            </Link>
            .
          </p>
        </div>
        <div className="border-t border-black/10">
          {HOME_FAQ.map((faq, idx) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={idx}
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

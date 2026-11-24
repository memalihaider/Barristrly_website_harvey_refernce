import type { Metadata } from "next";
import Link from "next/link";
import { MarketingCtaBand, MarketingSection } from "@/components/marketing/section";
import PostCard from "@/components/content/post-card";
import { listPublishedPosts } from "@/lib/content/blog";
import { BLOG_CATEGORIES, blogCategory } from "@/lib/content/blog-categories";
import { formatDate } from "@/lib/content/text";

type Props = { searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const cat = blogCategory((await searchParams).category);
  if (cat) {
    return {
      title: `${cat.label} — UAE Legal Guides`,
      description: `Practical articles on ${cat.label.toLowerCase()} in Dubai and the UAE from the Barristrly team.`,
      alternates: { canonical: `/blog?category=${cat.slug}` },
    };
  }
  return {
    title: "UAE Legal Insights & Guides Blog",
    description:
      "Practical articles on UAE law, company setup, contracts, wills, Corporate Tax and choosing the right lawyer in Dubai and the GCC.",
    alternates: { canonical: "/blog" },
  };
}

export const revalidate = 300;

const chip =
  "rounded-full border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap";

export default async function BlogIndexPage({ searchParams }: Props) {
  const active = blogCategory((await searchParams).category);
  const all = await listPublishedPosts(200);
  const posts = active ? all.filter((p) => p.category === active.slug) : all;
  const used = new Set(all.map((p) => p.category).filter(Boolean));
  const categories = BLOG_CATEGORIES.filter((c) => used.has(c.slug));

  const [featured, ...rest] = active ? [null, ...posts] : posts;
  const featuredCat = featured ? blogCategory(featured.category) : null;

  return (
    <>
      <section className="light-section pt-28 pb-10 md:pt-32 md:pb-12 border-b border-gray-200/80">
        <div className="container-wide">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-5">
            Barristrly Journal
          </p>
          <h1 className="max-w-3xl font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] text-ink tracking-tight leading-[1.08]">
            {active ? active.label : "UAE legal guides & insights"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-gray-600 leading-relaxed">
            {active
              ? `Plain-English articles on ${active.label.toLowerCase()} in Dubai and across the UAE.`
              : "Plain-English articles on company setup, contracts, Wills, Corporate Tax and working with the right lawyer in Dubai and across the UAE."}
          </p>

          {categories.length ? (
            <nav aria-label="Article categories" className="mt-8 flex gap-2 overflow-x-auto pb-1">
              <Link
                href="/blog"
                className={`${chip} ${!active ? "border-primary bg-primary text-on-primary" : "border-[#e5e3dc] bg-white text-ink hover:border-primary/40"}`}
              >
                All articles
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/blog?category=${c.slug}`}
                  className={`${chip} ${active?.slug === c.slug ? "border-primary bg-primary text-on-primary" : "border-[#e5e3dc] bg-white text-ink hover:border-primary/40"}`}
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      <MarketingSection>
        {posts.length === 0 ? (
          <p className="text-gray-600">
            New articles are on their way. Check back soon
            {active ? (
              <>
                , or{" "}
                <Link href="/blog" className="text-primary hover:underline">
                  browse all articles
                </Link>
              </>
            ) : null}
            .
          </p>
        ) : (
          <>
            {featured ? (
              <article className="group mb-12 grid overflow-hidden rounded-3xl border border-gray-200 bg-white md:grid-cols-2">
                <Link href={`/blog/${featured.slug}`} className="block">
                  {featured.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.cover_image_url}
                      alt={featured.title}
                      className="h-full min-h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="h-full min-h-64 w-full bg-gradient-to-br from-primary/20 via-[#fbf6f1] to-white" />
                  )}
                </Link>
                <div className="flex flex-col justify-center p-8 md:p-10">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    Latest{featuredCat ? ` · ${featuredCat.label}` : ""}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl md:text-4xl leading-tight text-ink">
                    <Link href={`/blog/${featured.slug}`} className="hover:text-primary">
                      {featured.title}
                    </Link>
                  </h2>
                  {featured.excerpt ? (
                    <p className="mt-4 line-clamp-4 text-gray-600 leading-relaxed">{featured.excerpt}</p>
                  ) : null}
                  <p className="mt-6 text-sm text-gray-500">
                    {featured.author_name ? `${featured.author_name} · ` : ""}
                    {formatDate(featured.published_at)} · {featured.reading_minutes} min read
                  </p>
                </div>
              </article>
            ) : null}
            {rest.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => p && <PostCard key={p.id} post={p} />)}
              </div>
            ) : null}
          </>
        )}
      </MarketingSection>

      <MarketingCtaBand
        title="Have a legal question about your situation?"
        description="Articles are general guidance. Submit a free brief and get matched with vetted UAE lawyers within 48 hours."
        primaryHref="/ai/intake"
        primaryLabel="Get a free lawyer match"
        secondaryHref="/services"
        secondaryLabel="Browse services"
      />
    </>
  );
}

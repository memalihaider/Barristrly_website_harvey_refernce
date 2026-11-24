import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { MarketingSection } from "@/components/marketing/section";
import PostCard from "@/components/content/post-card";
import JsonLd from "@/components/seo/json-ld";
import GradientButton from "@/components/ui/gradient-button";
import { getPublishedPost, listPublishedPosts } from "@/lib/content/blog";
import { blogCategory } from "@/lib/content/blog-categories";
import { formatDate } from "@/lib/content/text";
import { withHeadingAnchors } from "@/lib/content/toc";
import { SERVICE_CATALOG } from "@/lib/marketing/service-catalog";
import { absoluteUrl, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: post.author_name ? [post.author_name] : undefined,
      tags: post.tags,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
    twitter: {
      card: post.cover_image_url ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const category = blogCategory(post.category);
  const service = category?.service
    ? SERVICE_CATALOG.find((s) => s.id === category.service)
    : null;
  const { html, toc } = withHeadingAnchors(post.content_html);

  // Related: same category first, then most recent.
  const others = (await listPublishedPosts(60)).filter((p) => p.id !== post.id);
  const more = [
    ...others.filter((p) => category && p.category === category.slug),
    ...others.filter((p) => !category || p.category !== category.slug),
  ].slice(0, 3);

  const url = absoluteUrl(`/blog/${post.slug}`);
  const shareText = encodeURIComponent(post.title);
  const shareUrl = encodeURIComponent(url);
  const shares = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${shareText}%20${shareUrl}` },
    { label: "X", href: `https://x.com/intent/post?text=${shareText}&url=${shareUrl}` },
    { label: "Email", href: `mailto:?subject=${shareText}&body=${shareUrl}` },
  ];

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    ...(category ? [{ name: category.label, path: `/blog?category=${category.slug}` }] : []),
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd({
            title: post.seo_title || post.title,
            description: post.seo_description || post.excerpt,
            path: `/blog/${post.slug}`,
            image: post.cover_image_url,
            author: post.author_name,
            publishedAt: post.published_at,
            updatedAt: post.updated_at,
            section: category?.label,
          }),
          breadcrumbJsonLd(crumbs),
        ]}
      />
      <article>
        <header className="light-section pt-28 pb-10 md:pt-32 md:pb-14 border-b border-gray-200/80">
          <div className="container-wide max-w-3xl">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 list-none p-0 m-0">
                {crumbs.slice(0, -1).map((c) => (
                  <li key={c.path} className="inline-flex items-center gap-1">
                    <Link href={c.path} className="hover:text-primary">
                      {c.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  </li>
                ))}
              </ol>
            </nav>
            <h1 className="mt-5 font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-tight text-ink">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 text-lg leading-relaxed text-gray-600">{post.excerpt}</p>
            ) : null}
            <p className="mt-6 text-sm text-gray-500">
              {post.author_name ? (
                <span className="font-semibold text-ink">{post.author_name}</span>
              ) : null}
              {post.author_name ? " · " : ""}
              <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
              {" · "}
              {post.reading_minutes} min read
            </p>
          </div>
        </header>

        <MarketingSection>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 max-w-3xl">
              {post.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="mb-10 aspect-[16/9] w-full rounded-2xl object-cover"
                />
              ) : null}
              <div className="rich-content" dangerouslySetInnerHTML={{ __html: html }} />

              {post.tags?.length ? (
                <ul className="mt-10 flex flex-wrap gap-2 list-none p-0">
                  {post.tags.map((t) => (
                    <li key={t} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      #{t}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6 text-sm">
                <span className="font-semibold text-ink">Share this article:</span>
                {shares.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-gray-700 hover:border-primary hover:text-primary"
                  >
                    {s.label}
                  </a>
                ))}
              </div>

              <div className="mt-8 flex gap-4 rounded-2xl border border-[#e5e3dc] bg-[#faf9f6] p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 font-serif text-xl text-primary">
                  {(post.author_name || "B").charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="font-semibold text-ink">
                    {post.author_name ? `Written by ${post.author_name}` : "Barristrly Editorial Team"}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                    Barristrly connects individuals and businesses in the UAE with vetted
                    lawyers and specialists. This article is general information, not
                    legal advice for your situation.
                  </p>
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {toc.length >= 2 ? (
                <nav aria-label="In this article" className="rounded-2xl border border-[#e5e3dc] bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    In this article
                  </p>
                  <ol className="mt-3 space-y-2 text-sm list-none p-0">
                    {toc.map((t) => (
                      <li key={t.id} className={t.level === 3 ? "pl-4" : ""}>
                        <a href={`#${t.id}`} className="text-gray-700 hover:text-primary leading-snug">
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              <div className="rounded-2xl bg-ink p-6 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  {service ? service.shortName : "Need legal help?"}
                </p>
                <p className="mt-3 font-serif text-2xl leading-snug">
                  {service ? service.tagline : "Get matched with vetted UAE lawyers within 48 hours."}
                </p>
                <div className="mt-5">
                  <GradientButton
                    href={service ? service.ctaHref : "/ai/intake"}
                    size="md"
                    className="w-full justify-center"
                  >
                    {service ? service.ctaLabel : "Get a free lawyer match"}
                  </GradientButton>
                </div>
                <p className="mt-3 text-xs text-white/60">
                  Free to submit · Confidential · Reply within 48 hours
                </p>
              </div>
            </aside>
          </div>
        </MarketingSection>
      </article>

      <MarketingSection tone="soft" tight>
        <div className="flex flex-col gap-6 rounded-3xl border border-[#e5e3dc] bg-white p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl text-ink">
              Every situation is different
            </h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Tell us about yours in a short, free brief and get matched with up to three
              vetted, UAE-licensed lawyers.
            </p>
          </div>
          <Link
            href="/ai/intake"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover"
          >
            Get a free lawyer match <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </MarketingSection>

      {more.length ? (
        <MarketingSection>
          <h2 className="font-serif text-2xl text-ink">
            {category ? `More on ${category.label.toLowerCase()}` : "More from the blog"}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </MarketingSection>
      ) : null}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarketingSection } from "@/components/marketing/section";
import PostCard from "@/components/content/post-card";
import { getPublishedPost, listPublishedPosts } from "@/lib/content/blog";
import { formatDate } from "@/lib/content/text";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Article not found | Barristrly" };
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;
  return {
    title: `${title} | Barristrly`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const more = (await listPublishedPosts(4)).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <article>
        <header className="light-section pt-28 pb-10 md:pt-32 md:pb-14 border-b border-gray-200/80">
          <div className="container-wide max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> All articles
            </Link>
            {post.tags?.length ? (
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {post.tags.join(" · ")}
              </p>
            ) : null}
            <h1 className="mt-3 font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.1] tracking-tight text-ink">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 text-lg leading-relaxed text-gray-600">{post.excerpt}</p>
            ) : null}
            <p className="mt-6 text-sm text-gray-500">
              {post.author_name ? `${post.author_name} · ` : ""}
              {formatDate(post.published_at)} · {post.reading_minutes} min read
            </p>
          </div>
        </header>

        <MarketingSection>
          <div className="mx-auto max-w-3xl">
            {post.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_image_url}
                alt=""
                className="mb-10 aspect-[16/9] w-full rounded-2xl object-cover"
              />
            ) : null}
            <div className="rich-content" dangerouslySetInnerHTML={{ __html: post.content_html }} />
          </div>
        </MarketingSection>
      </article>

      {more.length ? (
        <MarketingSection tone="soft">
          <h2 className="font-serif text-2xl text-ink">More from the blog</h2>
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

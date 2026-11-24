import type { Metadata } from "next";
import { MarketingSection, PageHero } from "@/components/marketing/section";
import PostCard from "@/components/content/post-card";
import { listPublishedPosts } from "@/lib/content/blog";

export const metadata: Metadata = {
  title: "UAE Legal Insights & Guides Blog",
  description:
    "Practical articles on UAE law, company setup, contracts, wills, Corporate Tax and choosing the right lawyer in Dubai and the GCC.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Barristrly Blog"
        description="Practical guidance on legal matters in the UAE and beyond, and how Barristrly matches clients with the right lawyers."
      />
      <MarketingSection>
        {posts.length === 0 ? (
          <p className="text-gray-600">New articles are on their way. Check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </MarketingSection>
    </>
  );
}

import Link from "next/link";
import type { BlogPostSummary } from "@/lib/content/blog";
import { formatDate } from "@/lib/content/text";

export default function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-[16/9] w-full bg-gradient-to-br from-primary/15 via-[#fbf6f1] to-white" />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        {post.tags?.length ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            {post.tags.slice(0, 2).join(" · ")}
          </p>
        ) : null}
        <h3 className="mt-2 font-serif text-xl leading-snug text-ink">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600">{post.excerpt}</p>
        ) : null}
        <p className="mt-auto pt-5 text-xs text-gray-500">
          {formatDate(post.published_at)} · {post.reading_minutes} min read
        </p>
      </div>
    </article>
  );
}

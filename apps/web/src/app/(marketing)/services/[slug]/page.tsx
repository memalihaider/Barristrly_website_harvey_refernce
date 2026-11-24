import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceLanding from "@/components/marketing/service-landing";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { getServiceDetails } from "@/lib/marketing/service-details";
import { listPublishedPosts } from "@/lib/content/blog";
import { categoriesForService } from "@/lib/content/blog-categories";
import {
  SERVICE_CATALOG,
  getServiceBySlug,
} from "@/lib/marketing/service-catalog";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_CATALOG.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Legal Service" };
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: service.href },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: service.href,
    },
  };
}

export default async function ServiceHubPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  const categories: string[] = categoriesForService(service.id);
  const posts = (await listPublishedPosts(60))
    .filter((p) => p.category && categories.includes(p.category))
    .slice(0, 3);
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd({
            name: service.name,
            description: service.metaDescription,
            path: service.href,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.shortName, path: service.href },
          ]),
          faqJsonLd(getServiceDetails(service.id).faqs),
        ]}
      />
      <ServiceLanding service={service} posts={posts} />
    </>
  );
}

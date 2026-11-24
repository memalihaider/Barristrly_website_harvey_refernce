import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceLanding from "@/components/marketing/service-landing";
import JsonLd from "@/components/seo/json-ld";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";
import {
  SERVICE_CATALOG,
  getServiceBySlug,
} from "@/lib/marketing/service-catalog";

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
        ]}
      />
      <ServiceLanding service={service} />
    </>
  );
}

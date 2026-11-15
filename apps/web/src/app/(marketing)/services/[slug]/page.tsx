import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceLanding from "@/components/marketing/service-landing";
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
  if (!service) return { title: "Service | Barristrly" };
  return {
    title: `${service.name} | Barristrly`,
    description: service.tagline,
  };
}

export default async function ServiceHubPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceLanding service={service} />;
}

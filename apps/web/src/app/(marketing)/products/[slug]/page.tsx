import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductLanding from "@/components/marketing/product-page";
import { PRODUCTS, productBySlug } from "@/lib/marketing/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.filter((p) => p.id !== "marketplace").map((p) => ({
    slug: p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) return { title: "Product | Barristrly" };
  return {
    title: `${product.name} | Barristrly`,
    description: product.description,
  };
}

export default async function ProductSlugPage({ params }: Props) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product || product.id === "marketplace") notFound();
  return <ProductLanding product={product} />;
}

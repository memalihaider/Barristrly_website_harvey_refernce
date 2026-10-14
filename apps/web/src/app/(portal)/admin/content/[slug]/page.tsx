import { notFound } from "next/navigation";
import LegalPageForm from "@/components/admin/legal-page-form";
import { isLegalSlug } from "@/lib/content/legal";

export default async function EditLegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();
  return <LegalPageForm slug={slug} />;
}

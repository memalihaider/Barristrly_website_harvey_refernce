import { redirect } from "next/navigation";

type Props = { params: Promise<{ tool: string }> };

/** AI product tools retired — keep intake as matching service form. */
export default async function AiToolRedirect({ params }: Props) {
  const { tool } = await params;
  if (tool === "intake") {
    redirect("/ai/intake");
  }
  if (tool === "draft" || tool === "review") {
    redirect("/services/contract-drafting");
  }
  redirect("/services");
}

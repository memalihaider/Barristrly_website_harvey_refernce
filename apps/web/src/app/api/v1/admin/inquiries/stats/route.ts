import { apiOk, apiError } from "@/lib/api/response";
import { requireSuperAdminService } from "@/features/enterprise/admin";

/** Lightweight counts for the live nav badge. */
export async function GET() {
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { count, error } = await gate.admin
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ new: count ?? 0 });
}

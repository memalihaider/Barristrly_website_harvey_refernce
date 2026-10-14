import { apiOk, apiError } from "@/lib/api/response";
import { requireSuperAdminService } from "@/features/enterprise/admin";

export async function GET() {
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { data, error } = await gate.admin
    .from("users")
    .select("id, email, display_name, role, status, onboarding_completed, created_at")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) return apiError("internal", error.message, 500);
  return apiOk({ users: data ?? [] });
}

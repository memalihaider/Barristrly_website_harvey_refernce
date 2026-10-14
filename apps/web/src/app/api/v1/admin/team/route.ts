import { apiOk, apiError } from "@/lib/api/response";
import { requireSuperAdminService, SUPER_ADMIN_ROLES } from "@/features/enterprise/admin";

/** Admin team members who can be assigned work. */
export async function GET() {
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { data, error } = await gate.admin
    .from("users")
    .select("id, display_name, email, role")
    .in("role", [...SUPER_ADMIN_ROLES, "firm_admin"]);
  if (error) return apiError("internal", error.message, 500);

  const members = (data ?? [])
    .map((u) => ({ id: u.id, name: u.display_name || u.email, email: u.email, role: u.role }))
    .sort((a, b) => String(a.name).localeCompare(String(b.name)));
  return apiOk({ members, me: gate.session.auth.id });
}

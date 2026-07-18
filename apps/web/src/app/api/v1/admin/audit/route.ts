import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";

export async function GET(req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  const { admin } = gate;

  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit") ?? "50") || 50,
    200
  );

  const { data, error } = await admin
    .from("audit_logs")
    .select("id, action, performed_by, details, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ logs: data ?? [], count: data?.length ?? 0 });
}

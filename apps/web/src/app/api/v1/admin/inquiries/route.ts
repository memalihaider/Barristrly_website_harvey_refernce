import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/lib/api/response";
import { requireSuperAdminService } from "@/features/enterprise/admin";

export async function GET(_req: NextRequest) {
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;

  const { data, error } = await gate.admin
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ inquiries: data ?? [], serverTime: new Date().toISOString() });
}

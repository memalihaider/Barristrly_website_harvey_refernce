import { NextRequest } from "next/server";
import { apiOk, apiError } from "@/lib/api/response";
import { requireAdminService } from "@/features/enterprise/admin";

export async function GET(_req: NextRequest) {
  const gate = await requireAdminService();
  if (!gate.ok) return gate.response;
  const { admin } = gate;

  const { data, error } = await admin
    .from("coi_screens")
    .select("id, client_id, opponent_name, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return apiError("internal", error.message, 500);
  return apiOk({ screens: data ?? [], count: data?.length ?? 0 });
}

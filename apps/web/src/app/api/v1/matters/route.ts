import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { toMatterSummary } from "@/features/portal";
import {
  getContactRevealed,
  getDisplayName,
  listMattersForUser,
} from "@/features/portal/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("Matters");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);

  const supabase = await createClient();
  const { leads, error } = await listMattersForUser(
    supabase,
    session.auth.id,
    session.profile.role
  );
  if (error) return apiError("internal", error, 500);

  const matters = await Promise.all(
    leads.map(async (lead) => {
      const lawyerId = lead.assigned_lawyer_id;
      const revealed = await getContactRevealed(supabase, lead.id, lawyerId);
      const isLawyer = session.profile.role === "lawyer";
      const counterpartId = isLawyer ? lead.client_id : lawyerId;
      const counterpartName = counterpartId
        ? await getDisplayName(supabase, counterpartId)
        : null;
      return toMatterSummary(lead, {
        viewerRole: session.profile.role,
        counterpartName: isLawyer ? counterpartName ?? "Client" : counterpartName,
        contactRevealed: revealed,
      });
    })
  );

  return apiOk({ matters, count: matters.length });
}

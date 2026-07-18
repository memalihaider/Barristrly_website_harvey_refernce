import { NextRequest } from "next/server";
import { apiOk, apiError, notConfigured } from "@/lib/api/response";
import { maskDisplayName } from "@/features/marketplace/consent";
import type { CrmClientSummary } from "@/features/crm";
import { listLawyerLeadRows } from "@/features/crm/access";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(_req: NextRequest) {
  if (!isSupabaseConfigured()) return notConfigured("CRM clients");

  const session = await getSessionUser();
  if (!session) return apiError("unauthorized", "Sign in required", 401);
  if (session.profile.role !== "lawyer") {
    return apiError("forbidden", "Lawyer role required", 403);
  }

  const supabase = await createClient();
  const leads = await listLawyerLeadRows(supabase, session.auth.id);

  const clientIds = Array.from(
    new Set(leads.map((l) => l.client_id as string).filter(Boolean))
  );

  const nameById = new Map<string, string>();
  if (clientIds.length > 0) {
    const { data: users } = await supabase
      .from("users")
      .select("id, display_name")
      .in("id", clientIds);
    for (const u of users ?? []) {
      nameById.set(u.id as string, (u.display_name as string) || "Client");
    }
  }

  const consentByClient = new Map<string, boolean>();
  for (const lead of leads) {
    const { data: consent } = await supabase
      .from("dual_consent")
      .select("contact_revealed")
      .eq("lead_id", lead.id)
      .eq("lawyer_id", session.auth.id)
      .maybeSingle();
    if (consent?.contact_revealed) {
      consentByClient.set(lead.client_id as string, true);
    }
  }

  const byClient = new Map<string, CrmClientSummary>();
  for (const lead of leads) {
    const clientId = lead.client_id as string;
    const revealed = consentByClient.get(clientId) ?? false;
    const existing = byClient.get(clientId);
    const isMatter = ["consulting", "engaged", "completed"].includes(
      lead.status as string
    );
    if (!existing) {
      byClient.set(clientId, {
        clientId,
        displayLabel: maskDisplayName(nameById.get(clientId) ?? "Client", revealed),
        contactRevealed: revealed,
        leadCount: 1,
        matterCount: isMatter ? 1 : 0,
        latestStatus: lead.status as string,
        latestLeadId: lead.id as string,
      });
    } else {
      existing.leadCount += 1;
      if (isMatter) existing.matterCount += 1;
      if (revealed) {
        existing.contactRevealed = true;
        existing.displayLabel = maskDisplayName(
          nameById.get(clientId) ?? "Client",
          true
        );
      }
      const prev = existing.latestLeadId
        ? leads.find((l) => l.id === existing.latestLeadId)
        : null;
      if (
        !prev ||
        new Date(lead.updated_at as string) > new Date(prev.updated_at as string)
      ) {
        existing.latestStatus = lead.status as string;
        existing.latestLeadId = lead.id as string;
      }
    }
  }

  const clients = Array.from(byClient.values()).sort((a, b) =>
    a.displayLabel.localeCompare(b.displayLabel)
  );

  return apiOk({ clients, count: clients.length });
}

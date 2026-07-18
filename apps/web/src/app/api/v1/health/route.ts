import { NextRequest } from "next/server";
import { apiOk } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { logger } from "@/lib/observability/logger";
import { JURISDICTIONS, PRACTICE_AREAS, APP_ROLES } from "@/lib/ontology";

export async function GET(_req: NextRequest) {
  logger.info("health_check");
  return apiOk({
    service: "barristrly-api",
    version: "v1",
    status: "ok",
    supabaseConfigured: isSupabaseConfigured(),
    redisConfigured: Boolean(process.env.REDIS_URL),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    ontology: {
      roles: APP_ROLES.length,
      jurisdictions: JURISDICTIONS.length,
      practiceAreas: PRACTICE_AREAS.length,
    },
    timestamp: new Date().toISOString(),
  });
}

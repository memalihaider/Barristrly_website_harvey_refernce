import { NextRequest } from "next/server";
import { apiOk } from "@/lib/api/response";

export async function GET(_req: NextRequest) {
  return apiOk({
    endpoints: [],
    events: [
      "booking.created",
      "meeting.completed",
      "payment.released",
      "matter.updated",
    ],
    message: "Webhook registry — see doc/WEBHOOK_SPEC.md",
  });
}

export async function POST(_req: NextRequest) {
  return apiOk({ registered: false, reason: "Supabase + org auth required" });
}

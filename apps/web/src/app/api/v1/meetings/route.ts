import { NextRequest } from "next/server";
import { z } from "zod";
import { apiOk, apiError } from "@/lib/api/response";
import { createMeetingSessionStub } from "@/features/meetings/mediasoup";

const schema = z.object({
  bookingId: z.string().uuid().or(z.string().min(1)),
  silhouetteMask: z.boolean().optional(),
  voiceMorph: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError("validation_error", "Invalid meeting payload", 400, parsed.error.flatten());
  }

  const session = createMeetingSessionStub(parsed.data.bookingId, {
    silhouetteMask: parsed.data.silhouetteMask,
    voiceMorph: parsed.data.voiceMorph,
  });

  return apiOk({ session, stack: "mediasoup" });
}

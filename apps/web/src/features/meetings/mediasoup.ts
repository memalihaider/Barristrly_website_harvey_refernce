/** mediasoup meeting helpers — see doc/ADR/001-mediasoup-video.md */

export function generateRoomName(bookingId: string): string {
  return `bstr_${bookingId.replace(/-/g, "").slice(0, 16)}`;
}

export interface MeetingSessionStub {
  roomName: string;
  signalingUrl: string | null;
  anonymity: {
    silhouetteMask: boolean;
    voiceMorph: boolean;
  };
}

export function createMeetingSessionStub(
  bookingId: string,
  opts?: { silhouetteMask?: boolean; voiceMorph?: boolean }
): MeetingSessionStub {
  return {
    roomName: generateRoomName(bookingId),
    signalingUrl: process.env.MEDIASOUP_SIGNALING_URL ?? null,
    anonymity: {
      silhouetteMask: opts?.silhouetteMask ?? true,
      voiceMorph: opts?.voiceMorph ?? false,
    },
  };
}

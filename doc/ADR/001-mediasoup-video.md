# ADR-001: Video Meeting Stack — mediasoup

> Status: Accepted  
> Date: July 2026  
> Deciders: Engineering Leadership  
> Relates To: TECH_STACK.md, MEETING_SCHEMA.md, SYSTEM_ARCHITECTURE.md, PROJECT.md

---

## Context

`PROJECT.md` historically referenced Jitsi for encrypted consultations. Architecture docs (`TECH_STACK.md`, `SYSTEM_ARCHITECTURE.md`) specify **mediasoup** as the official SFU for Barristrly video meetings.

Two stacks cannot both be canonical.

## Decision

**Barristrly uses mediasoup as the sole production video SFU.**

- Meeting rooms, signaling, and recording hooks are built against mediasoup.
- Jitsi is not used in new development.
- Dual-consent / anonymity features (silhouette masking, optional voice morphing) are implemented as application-layer overlays on mediasoup streams, not via a third-party meeting product.

## Consequences

- Meeting service owns mediasoup workers and WebRTC signaling endpoints.
- Mobile and web clients use a shared mediasoup client SDK wrapper in `packages/meeting-client` (future) or `lib/meetings`.
- Ops must capacity-plan mediasoup workers separately from the Next.js app.
- Any legacy Jitsi references in docs are obsolete and should point here.

## Alternatives considered

| Option | Why rejected |
| --- | --- |
| Jitsi | Less control for anonymity overlays; conflicts with approved stack |
| Daily/Twilio | Vendor lock-in; higher cost at marketplace scale |
| Peer-only WebRTC | Does not scale for multi-party or recording |

---

## References

- [TECH_STACK.md](../TECH_STACK.md)
- [MEETING_SCHEMA.md](../MEETING_SCHEMA.md)
- [SECURITY_ARCHITECTURE.md](../SECURITY_ARCHITECTURE.md)

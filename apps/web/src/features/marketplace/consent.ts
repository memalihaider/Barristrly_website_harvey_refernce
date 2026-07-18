export type DualConsentState = {
  clientStatus: "pending" | "granted" | "revoked";
  lawyerStatus: "pending" | "granted" | "revoked";
};

export function boolToConsentStatus(
  value: boolean | null | undefined
): DualConsentState["clientStatus"] {
  return value ? "granted" : "pending";
}

export function isIdentityRevealed(state: DualConsentState): boolean {
  return state.clientStatus === "granted" && state.lawyerStatus === "granted";
}

export function maskDisplayName(
  name: string | null | undefined,
  revealed: boolean
): string {
  if (revealed && name) return name;
  return "Anonymous Party";
}

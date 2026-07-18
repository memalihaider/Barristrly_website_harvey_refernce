export interface EscrowState {
  paymentId: string;
  clientConfirmed: boolean;
  lawyerConfirmed: boolean;
  status: "held" | "released" | "pending";
}

export function canReleaseEscrow(state: EscrowState): boolean {
  return state.clientConfirmed && state.lawyerConfirmed && state.status === "held";
}

export function createCheckoutStub(amountCents: number, currency = "AED") {
  return {
    amountCents,
    currency,
    mode: "payment" as const,
    // Stripe session created when STRIPE_SECRET_KEY is present
    requiresStripe: !process.env.STRIPE_SECRET_KEY,
  };
}

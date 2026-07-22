/** Commercial plans — matching loop + capped corporate subscriptions (AED). */

export const INDIVIDUAL_SESSIONS = [
  {
    name: "30-Minute Anonymous Call",
    price: "400 AED",
    period: "per session",
    detail: "On-demand encrypted consult with capped time box.",
  },
  {
    name: "45-Minute Anonymous Call",
    price: "600 AED",
    period: "per session",
    detail: "Extended anonymous VoIP session with conflict-cleared counsel.",
  },
  {
    name: "60-Minute Anonymous Call",
    price: "800 AED",
    period: "+ VAT",
    detail: "Full-hour secure consult for complex matter scoping.",
  },
] as const;

export const INDIVIDUAL_HOOK =
  "Book 3 meetings upfront, unlock the 4th free.";

export const SUBSCRIPTION_PLANS = [
  {
    name: "SME Shield",
    price: "1,500 AED",
    period: "/month",
    detail:
      "Capped meeting allocation for SMEs — every booking runs the 5-node matching and conflict clearance workflow.",
    features: [
      "Max 4 meetings / month",
      "Up to 4 conflict-check cycles",
      "Top-up sessions at 350 AED",
      "No unused balance rollover",
    ],
    cta: { href: "/request-demo", label: "Get SME Shield" },
  },
  {
    name: "Corporate General",
    price: "3,000 AED",
    period: "/month",
    detail:
      "Higher meeting capacity for in-house and multi-matter corporate teams with operational loop limits.",
    features: [
      "Max 8 meetings / month",
      "Up to 8 conflict-check cycles",
      "Top-up sessions at 350 AED",
      "No unused balance rollover",
    ],
    highlight: true,
    cta: { href: "/request-demo", label: "Get Corporate" },
  },
  {
    name: "Enterprise Max",
    price: "7,500 AED",
    period: "/month",
    detail:
      "Highest capped allocation for large legal ops — explicit meeting assets, not unlimited overhead.",
    features: [
      "Max 25 meetings / month",
      "Up to 20 conflict-check cycles",
      "Top-up sessions at 350 AED",
      "No unused balance rollover",
    ],
    cta: { href: "/request-demo", label: "Contact sales" },
  },
] as const;

export const PRICING_RULES = [
  {
    title: "Top-up after cap",
    detail:
      "When monthly meetings are exhausted, unlock additional sessions at 350 AED each — stay connected without unlimited infrastructure risk.",
  },
  {
    title: "Overage expiry",
    detail:
      "Unused meeting balances do not roll over to the next billing cycle.",
  },
  {
    title: "Prepaid hour blocks",
    detail:
      "Buy 6 standalone sessions, get 2 free. Credits expire 12 months from purchase. All sessions use the standard matching workflow.",
  },
] as const;

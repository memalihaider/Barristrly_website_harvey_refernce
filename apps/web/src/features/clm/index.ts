/** Phase 6 — Thin contract lifecycle */

export type ContractStatus =
  | "draft"
  | "in_review"
  | "executed"
  | "expired"
  | "terminated";

export const CONTRACT_STATUSES: ContractStatus[] = [
  "draft",
  "in_review",
  "executed",
  "expired",
  "terminated",
];

const ALLOWED: Record<ContractStatus, ContractStatus[]> = {
  draft: ["in_review", "terminated"],
  in_review: ["draft", "executed", "terminated"],
  executed: ["expired", "terminated"],
  expired: [],
  terminated: [],
};

export function canTransitionContract(
  from: string,
  to: string
): boolean {
  if (!(CONTRACT_STATUSES as readonly string[]).includes(from)) return false;
  if (!(CONTRACT_STATUSES as readonly string[]).includes(to)) return false;
  return ALLOWED[from as ContractStatus].includes(to as ContractStatus);
}

export function isContractActive(status: ContractStatus): boolean {
  return status === "executed";
}

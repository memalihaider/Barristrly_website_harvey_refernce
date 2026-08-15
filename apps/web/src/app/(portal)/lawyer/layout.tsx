import type { ReactNode } from "react";
import PortalShell from "@/components/app/portal-shell";

export default function LawyerLayout({ children }: { children: ReactNode }) {
  return <PortalShell role="lawyer">{children}</PortalShell>;
}

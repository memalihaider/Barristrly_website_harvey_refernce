import type { ReactNode } from "react";
import PortalShell from "@/components/app/portal-shell";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <PortalShell role="client">{children}</PortalShell>;
}

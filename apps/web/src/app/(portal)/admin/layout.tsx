import type { ReactNode } from "react";
import PortalShell from "@/components/app/portal-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <PortalShell role="admin">{children}</PortalShell>;
}

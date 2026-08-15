"use client";

import type { ReactNode } from "react";
import PortalShell from "@/components/app/portal-shell";

/** @deprecated Use PortalShell with role="admin". */
export default function SuperAdminShell({ children }: { children: ReactNode }) {
  return <PortalShell role="admin">{children}</PortalShell>;
}

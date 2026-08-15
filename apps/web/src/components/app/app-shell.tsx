"use client";

import type { ReactNode } from "react";
import type { PortalRole } from "@/lib/portal/portal-nav";

/** @deprecated Prefer route layouts with PortalShell. Kept as a no-op wrapper. */
export type AppShellRole = PortalRole;

export default function AppShell({
  children,
}: {
  role: AppShellRole;
  title: string;
  children: ReactNode;
}) {
  return <>{children}</>;
}

/** @deprecated Import from `@/lib/portal/portal-nav` instead. */
export {
  ADMIN_RAILS as SUPER_ADMIN_RAILS,
  railForPath as railForPathLegacy,
  titleForPath as titleForPathLegacy,
  type RailItem,
  type ContextNavItem,
} from "@/lib/portal/portal-nav";

import {
  railForPath as railForPathRole,
  titleForPath as titleForPathRole,
  type RailItem,
} from "@/lib/portal/portal-nav";

/** Back-compat helpers that assume admin portal. */
export function railForPath(pathname: string): RailItem {
  return railForPathRole("admin", pathname);
}

export function titleForPath(pathname: string): string {
  return titleForPathRole("admin", pathname);
}

export type RailId = string;

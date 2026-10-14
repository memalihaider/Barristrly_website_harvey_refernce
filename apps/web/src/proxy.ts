import { type NextRequest } from "next/server";
import { guardRequest } from "@/lib/auth/proxy-session";

export async function proxy(request: NextRequest) {
  return guardRequest(request);
}

export const config = {
  matcher: ["/client/:path*", "/lawyer/:path*", "/admin/:path*", "/onboarding/:path*", "/onboarding"],
};

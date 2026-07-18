(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__06dlt3w._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/apps/web/src/lib/auth/portal.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_PORTAL_ROLES",
    ()=>ADMIN_PORTAL_ROLES,
    "homeForRole",
    ()=>homeForRole,
    "isSafeNextPath",
    ()=>isSafeNextPath,
    "portalPrefix",
    ()=>portalPrefix,
    "resolvePostAuthRedirect",
    ()=>resolvePostAuthRedirect,
    "roleAllowedForPortal",
    ()=>roleAllowedForPortal
]);
const ADMIN_PORTAL_ROLES = [
    "platform_admin",
    "mediator",
    "firm_admin"
];
function isSafeNextPath(path) {
    if (!path || typeof path !== "string") return false;
    if (!path.startsWith("/")) return false;
    if (path.startsWith("//")) return false;
    if (path.includes("://")) return false;
    if (path.startsWith("/login") || path.startsWith("/register")) return false;
    return true;
}
function homeForRole(role) {
    switch(role){
        case "lawyer":
            return "/lawyer";
        case "platform_admin":
        case "mediator":
        case "firm_admin":
            return "/admin";
        case "client":
        default:
            return "/client";
    }
}
function portalPrefix(pathname) {
    if (pathname === "/client" || pathname.startsWith("/client/")) return "client";
    if (pathname === "/lawyer" || pathname.startsWith("/lawyer/")) return "lawyer";
    if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
    return null;
}
function roleAllowedForPortal(role, portal) {
    if (!role) return false;
    if (portal === "client") return role === "client";
    if (portal === "lawyer") return role === "lawyer";
    return ADMIN_PORTAL_ROLES.includes(role);
}
function resolvePostAuthRedirect(role, next) {
    const home = homeForRole(role);
    if (!isSafeNextPath(next)) return home;
    const portal = portalPrefix(next);
    if (!portal) return next.startsWith("/api") ? home : next;
    if (roleAllowedForPortal(role, portal)) return next;
    return home;
}
}),
"[project]/apps/web/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$portal$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/portal.ts [middleware-edge] (ecmascript)");
;
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://cyugcthvnlhmvxewjstt.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "sb_publishable_UfJX6TrLGXpYoG_-f6vUoA_FoYrS_9f");
async function updateSession(request) {
    let supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request: {
            headers: request.headers
        }
    });
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseKey, {
        cookies: {
            getAll () {
                return request.cookies.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value })=>request.cookies.set(name, value));
                supabaseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request
                });
                cookiesToSet.forEach(({ name, value, options })=>supabaseResponse.cookies.set(name, value, options));
            }
        }
    });
    const pathname = request.nextUrl.pathname;
    // Skip auth refresh for health / static-like API probes
    if (pathname === "/api/v1/health") {
        return supabaseResponse;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const portal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$portal$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["portalPrefix"])(pathname);
    if (portal) {
        if (!user) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = "/login";
            loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
        }
        const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
        const role = profile?.role ?? "client";
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$portal$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["roleAllowedForPortal"])(role, portal)) {
            const dest = request.nextUrl.clone();
            dest.pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$portal$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["homeForRole"])(role);
            dest.search = "";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(dest);
        }
    }
    return supabaseResponse;
}
}),
"[project]/apps/web/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase/middleware.ts [middleware-edge] (ecmascript)");
;
async function middleware(request) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2f$middleware$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["updateSession"])(request);
}
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|woff2)$).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__06dlt3w._.js.map
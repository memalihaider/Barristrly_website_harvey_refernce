"use client";

import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { usePolling } from "@/lib/hooks/use-polling";
import { timeAgo } from "@/lib/time";

type UserRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: string;
  status: string | null;
  onboarding_completed: boolean | null;
  created_at: string | null;
};

const ROLE_LABEL: Record<string, string> = {
  client: "Client",
  lawyer: "Lawyer",
  firm_admin: "Firm admin",
  platform_admin: "Super admin",
  mediator: "Mediator",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [role, setRole] = useState("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const json = await fetch("/api/v1/admin/users", { cache: "no-store" }).then((r) => r.json()).catch(() => null);
    setLoading(false);
    if (!json?.ok) {
      setError(json?.error?.message ?? "Failed to load users");
      return;
    }
    setError(null);
    setUsers(json.data.users ?? []);
  }, []);

  usePolling(load, 60_000);

  const roles = useMemo(() => {
    const c: Record<string, number> = {};
    for (const u of users) c[u.role] = (c[u.role] ?? 0) + 1;
    return c;
  }, [users]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter(
      (u) =>
        (role === "all" || u.role === role) &&
        (!needle ||
          (u.email ?? "").toLowerCase().includes(needle) ||
          (u.display_name ?? "").toLowerCase().includes(needle))
    );
  }, [users, role, query]);

  return (
    <>
      <p className="mb-6 max-w-2xl text-sm text-text-on-light-muted">
        Everyone with a Barristrly account, newest first.
      </p>
      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["all", ...Object.keys(roles).sort()].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
              role === r ? "border-primary bg-primary text-on-primary" : "border-ink/15 text-ink hover:border-primary"
            }`}
          >
            {r === "all" ? "All" : ROLE_LABEL[r] ?? r} ({r === "all" ? users.length : roles[r]})
          </button>
        ))}
        <label className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="w-full rounded-xl border border-[#e5e3dc] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
      </div>

      {loading ? (
        <p className="text-sm text-gray-600">Loading users…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#e5e3dc] bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[#e5e3dc] text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Onboarding</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id} className="border-b border-[#e5e3dc]/70 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{u.display_name || "—"}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">{ROLE_LABEL[u.role] ?? u.role}</td>
                  <td className="px-4 py-3">
                    <span className={u.onboarding_completed ? "text-emerald-700" : "text-amber-700"}>
                      {u.onboarding_completed ? "Complete" : "In progress"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{timeAgo(u.created_at)}</td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No users match.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

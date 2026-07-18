"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app/app-shell";

type Booking = {
  id: string;
  clientId: string;
  leadId: string;
  startsAt: string;
  status: string;
  roomName: string;
};

const NEXT: Record<string, string[]> = {
  scheduled: ["ongoing", "completed", "missed"],
  ongoing: ["completed", "missed"],
  completed: [],
  missed: ["scheduled"],
};

export default function LawyerCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/bookings");
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Failed to load");
        return;
      }
      setBookings(json.data.bookings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch(`/api/v1/meetings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Update failed");
        return;
      }
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <AppShell role="lawyer" title="Calendar">
      <p className="text-sm text-text-on-light-muted mb-6">
        Scheduled consults. Update status and open the linked matter.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-text-muted">No scheduled meetings yet.</p>
      ) : (
        <ul className="space-y-3 max-w-2xl">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="border border-black/10 bg-white p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <p className="font-medium">
                    {new Date(b.startsAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-text-muted mt-1 capitalize">
                    {b.status} · room {b.roomName}
                  </p>
                </div>
                <Link
                  href={`/lawyer/matters/${b.leadId}`}
                  className="text-sm font-semibold text-primary"
                >
                  Matter →
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {(NEXT[b.status] ?? []).map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busy === b.id}
                    onClick={() => setStatus(b.id, s)}
                    className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
                  >
                    Mark {s}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

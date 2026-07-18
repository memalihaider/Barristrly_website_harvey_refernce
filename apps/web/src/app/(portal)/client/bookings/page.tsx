"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/app/app-shell";

type Booking = {
  id: string;
  lawyerId: string;
  leadId: string;
  startsAt: string;
  status: string;
  roomName: string;
};

function BookingsInner() {
  const search = useSearchParams();
  const leadId = search.get("leadId");
  const lawyerId = search.get("lawyerId");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/bookings");
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Failed to load bookings");
        return;
      }
      setBookings(json.data.bookings ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createBooking() {
    if (!leadId || !lawyerId) {
      setError("Open this page from Matches with leadId and lawyerId.");
      return;
    }
    setError(null);
    setMessage(null);
    const starts = new Date(Date.now() + 86400000);
    const ends = new Date(starts.getTime() + 3600000);
    const res = await fetch("/api/v1/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lawyerId,
        leadId,
        startsAt: starts.toISOString(),
        endsAt: ends.toISOString(),
      }),
    });
    const json = await res.json();
    if (!json.ok) {
      setError(json.error?.message ?? "Booking failed");
      return;
    }
    setMessage(`Meeting scheduled · room ${json.data.booking.roomName}`);
    await load();
  }

  async function payEscrow(booking: Booking) {
    setPaying(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: booking.leadId,
          lawyerId: booking.lawyerId,
          amount: 500,
          currency: "usd",
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Payment failed");
        return;
      }
      setMessage(
        `Escrow held · payment ${json.data.payment.id.slice(0, 8)} · escrow ${json.data.escrow.id.slice(0, 8)}`
      );
    } finally {
      setPaying(false);
    }
  }

  return (
    <>
      <p className="text-sm text-text-on-light-muted mb-6">
        Schedule a consult, pay via escrow, join a mediasoup room.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {message && <p className="text-sm text-green-700 mb-4">{message}</p>}
      {leadId && lawyerId && (
        <button
          type="button"
          onClick={createBooking}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover mb-8"
        >
          Book consult (tomorrow)
        </button>
      )}
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-text-muted">No scheduled consults yet.</p>
      ) : (
        <ul className="space-y-3 max-w-2xl">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="border border-black/10 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium text-ink">
                  {new Date(b.startsAt).toLocaleString()}
                </p>
                <p className="text-xs text-text-muted mt-1 capitalize">
                  {b.status} · room {b.roomName}
                </p>
              </div>
              <button
                type="button"
                disabled={paying}
                onClick={() => payEscrow(b)}
                className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                Pay escrow
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function ClientBookingsPage() {
  return (
    <AppShell role="client" title="Bookings">
      <Suspense fallback={<p className="text-sm text-text-muted">Loading…</p>}>
        <BookingsInner />
      </Suspense>
    </AppShell>
  );
}

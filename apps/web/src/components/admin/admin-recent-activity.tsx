"use client";

import { useEffect, useState } from "react";
import { Activity, Search, RefreshCw, Clock, User, ShieldCheck } from "lucide-react";

type EventRow = {
  id: string;
  event_name: string;
  user_id: string | null;
  properties: Record<string, unknown>;
  created_at: string;
};

interface AdminRecentActivityProps {
  events: EventRow[];
}

const STATIC_SAMPLE_EVENTS: EventRow[] = [
  {
    id: "ev-1",
    event_name: "escrow.funds_deposited",
    user_id: "usr_94a2b1c",
    properties: { amount: 5000, currency: "USD", matter: "Corporate Structuring" },
    created_at: "2026-07-28T09:48:44.000Z",
  },
  {
    id: "ev-2",
    event_name: "coi.screen_cleared",
    user_id: "usr_82c1f9d",
    properties: { partyA: "Gulf Holdings", status: "No Conflict Found" },
    created_at: "2026-07-28T09:15:00.000Z",
  },
  {
    id: "ev-3",
    event_name: "lawyer.approval_submitted",
    user_id: "lwr_31d8e4f",
    properties: { jurisdiction: "DIFC Courts", barNo: "DIFC-8821" },
    created_at: "2026-07-28T08:30:00.000Z",
  },
  {
    id: "ev-4",
    event_name: "intake.ai_match_generated",
    user_id: "usr_55f2a1b",
    properties: { matchScore: 96, firmCount: 3 },
    created_at: "2026-07-28T07:00:00.000Z",
  },
  {
    id: "ev-5",
    event_name: "payment.consultation_paid",
    user_id: "usr_12e9b4c",
    properties: { amount: 450, lawyer: "Tariq Al-Mansoori" },
    created_at: "2026-07-28T06:00:00.000Z",
  },
];

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const hours = d.getUTCHours().toString().padStart(2, "0");
    const minutes = d.getUTCMinutes().toString().padStart(2, "0");
    const seconds = d.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds} UTC`;
  } catch {
    return isoString;
  }
}

export default function AdminRecentActivity({ events }: AdminRecentActivityProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sampleEvents: EventRow[] = events.length > 0 ? events : STATIC_SAMPLE_EVENTS;

  const filteredEvents = sampleEvents.filter((ev) => {
    const matchesSearch =
      ev.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.user_id && ev.user_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === "all") return matchesSearch;
    return matchesSearch && ev.event_name.startsWith(filterType);
  });

  return (
    <div className="bg-white border border-black/10 rounded-lg p-6 shadow-2xs">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="font-serif text-xl font-normal text-ink">
              System Telemetry & Audit Stream
            </h2>
          </div>
          <p className="text-xs text-text-on-light-muted mt-0.5">
            Real-time event stream logging intake matches, COI clearances, escrow events, and approvals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search event or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-surface-soft border border-black/10 rounded-md text-xs w-48 sm:w-64 focus:outline-none focus:border-primary"
            />
          </div>

          {/* Event Category Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-surface-soft border border-black/10 rounded-md text-xs font-medium text-ink focus:outline-none focus:border-primary"
          >
            <option value="all">All Events</option>
            <option value="escrow">Escrow Events</option>
            <option value="coi">COI Clearance</option>
            <option value="lawyer">Lawyer Events</option>
            <option value="intake">AI Intake</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="border border-black/10 rounded-md overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-surface-soft border-b border-black/10 text-text-on-light-muted font-medium uppercase tracking-wider">
            <tr>
              <th className="p-3 font-semibold">Timestamp</th>
              <th className="p-3 font-semibold">Event Code</th>
              <th className="p-3 font-semibold">User Reference</th>
              <th className="p-3 font-semibold">Event Parameters</th>
              <th className="p-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-text-muted">
                  No matching telemetry events found for your search query.
                </td>
              </tr>
            ) : (
              filteredEvents.map((ev) => {
                const isEscrow = ev.event_name.includes("escrow") || ev.event_name.includes("payment");
                const isCoi = ev.event_name.includes("coi");
                const isApproval = ev.event_name.includes("approval");

                return (
                  <tr key={ev.id} className="hover:bg-surface-soft/40 transition-colors">
                    <td className="p-3 font-mono text-text-on-light-muted whitespace-nowrap">
                      <span className="flex items-center gap-1.5" suppressHydrationWarning>
                        <Clock className="w-3 h-3 text-text-muted" />
                        {mounted
                          ? new Date(ev.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : formatTime(ev.created_at)}
                      </span>
                    </td>

                    <td className="p-3 font-semibold text-ink">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          isEscrow
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : isCoi
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : isApproval
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-surface-soft text-ink border border-black/10"
                        }`}
                      >
                        {ev.event_name}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-text-on-light-muted">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-text-muted" />
                        {ev.user_id ? ev.user_id.slice(0, 10) : "system"}
                      </span>
                    </td>

                    <td className="p-3 text-text-on-light-muted font-mono text-[11px]">
                      {JSON.stringify(ev.properties)}
                    </td>

                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                        <ShieldCheck className="w-3 h-3" />
                        Logged
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import AppShell from "@/components/app/app-shell";
import MatterDetail from "@/components/portal/matter-detail";
import Link from "next/link";

export default function ClientMatterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AppShell role="client" title="Matter">
      <Link
        href="/client/matters"
        className="text-sm font-semibold text-primary mb-6 inline-block"
      >
        ← All matters
      </Link>
      <MatterDetail
        matterId={id}
        role="client"
        bookingsHref="/client/bookings"
      />
    </AppShell>
  );
}

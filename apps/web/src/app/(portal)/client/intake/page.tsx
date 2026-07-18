"use client";

import AppShell from "@/components/app/app-shell";
import IntakeChat from "@/components/intake/intake-chat";

export default function ClientIntakePage() {
  return (
    <AppShell role="client" title="AI Intake">
      <div className="max-w-2xl">
        <p className="text-sm text-black/60 mb-6 leading-relaxed">
          Chat with the intake assistant to structure your case. When ready, we
          match verified lawyers by practice area and jurisdiction.
        </p>
        <IntakeChat mode="portal" />
      </div>
    </AppShell>
  );
}

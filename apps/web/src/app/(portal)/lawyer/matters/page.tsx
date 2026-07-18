"use client";

import MattersListPage from "@/components/portal/matters-list";

export default function LawyerMattersPage() {
  return <MattersListPage role="lawyer" detailBase="/lawyer/matters" />;
}

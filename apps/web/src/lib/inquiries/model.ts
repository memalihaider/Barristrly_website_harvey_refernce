/** Shared inquiry workflow vocabulary (API + admin UI). */

export const INQUIRY_STATUSES = [
  "new",
  "in_progress",
  "contacted",
  "qualified",
  "closed",
  "spam",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type InquiryPriority = (typeof INQUIRY_PRIORITIES)[number];

export const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  in_progress: "In progress",
  contacted: "Contacted",
  qualified: "Qualified",
  closed: "Closed",
  spam: "Spam",
};

export const STATUS_STYLE: Record<InquiryStatus, string> = {
  new: "bg-primary/10 text-primary border-primary/30",
  in_progress: "bg-sky-50 text-sky-700 border-sky-200",
  contacted: "bg-violet-50 text-violet-700 border-violet-200",
  qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  spam: "bg-red-50 text-red-700 border-red-200",
};

export const PRIORITY_STYLE: Record<InquiryPriority, string> = {
  low: "text-gray-500",
  normal: "text-ink",
  high: "text-amber-700",
  urgent: "text-red-700 font-semibold",
};

/** Statuses that still need someone to act. */
export const OPEN_STATUSES: InquiryStatus[] = ["new", "in_progress", "contacted", "qualified"];

export type Inquiry = {
  id: string;
  source: string;
  name: string;
  email: string;
  organization: string | null;
  role: string | null;
  country: string | null;
  message: string | null;
  status: InquiryStatus;
  priority: InquiryPriority;
  assigned_to: string | null;
  assigned_name: string | null;
  admin_notes: string | null;
  metadata: { userAgent?: string | null; referer?: string | null } | null;
  handled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type InquiryEvent = {
  id: string;
  inquiry_id: string;
  type: "note" | "status" | "priority" | "assignment" | "created";
  body: string;
  author_id: string | null;
  author_name: string | null;
  created_at: string;
};

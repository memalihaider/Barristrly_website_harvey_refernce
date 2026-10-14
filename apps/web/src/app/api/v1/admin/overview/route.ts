import { apiOk } from "@/lib/api/response";
import { requireSuperAdminService } from "@/features/enterprise/admin";
import { OPEN_STATUSES, type InquiryStatus } from "@/lib/inquiries/model";

const DAYS = 14;

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

/** Daily counts for the last DAYS days (UTC), oldest first. */
function daily(rows: { created_at?: string | null }[]) {
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (r.created_at) counts.set(dayKey(r.created_at), (counts.get(dayKey(r.created_at)) ?? 0) + 1);
  }
  const out: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    const key = d.toISOString().slice(0, 10);
    out.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return out;
}

/** Real platform numbers for the Super Admin home. No placeholders. */
export async function GET() {
  const gate = await requireSuperAdminService();
  if (!gate.ok) return gate.response;
  const db = gate.admin;

  const [inquiriesRes, usersRes, postsRes, approvalsRes, subsRes] = await Promise.all([
    db.from("inquiries").select("id, name, email, organization, status, priority, created_at"),
    db.from("users").select("id, role, display_name, email, created_at"),
    db.from("blog_posts").select("id, title, status, slug, updated_at"),
    db.from("lawyer_approvals").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db
      .from("subscription_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_approval"),
  ]);

  const inquiries = inquiriesRes.data ?? [];
  const users = usersRes.data ?? [];
  const posts = postsRes.data ?? [];
  const weekAgo = Date.now() - 7 * 864e5;

  const byStatus: Record<string, number> = {};
  for (const q of inquiries) byStatus[q.status] = (byStatus[q.status] ?? 0) + 1;
  const byRole: Record<string, number> = {};
  for (const u of users) byRole[u.role] = (byRole[u.role] ?? 0) + 1;

  const newest = <T extends { created_at?: string | null }>(rows: T[], n: number) =>
    [...rows].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, n);

  return apiOk({
    inquiries: {
      total: inquiries.length,
      new: byStatus.new ?? 0,
      open: inquiries.filter((q) => OPEN_STATUSES.includes(q.status as InquiryStatus)).length,
      lastWeek: inquiries.filter((q) => Date.parse(q.created_at) >= weekAgo).length,
      urgent: inquiries.filter(
        (q) => (q.priority === "urgent" || q.priority === "high") && OPEN_STATUSES.includes(q.status as InquiryStatus)
      ).length,
      byStatus,
      daily: daily(inquiries),
      recent: newest(inquiries, 6),
    },
    users: {
      total: users.length,
      byRole,
      lastWeek: users.filter((u) => u.created_at && Date.parse(u.created_at) >= weekAgo).length,
      daily: daily(users),
      recent: newest(users, 6).map((u) => ({
        id: u.id,
        name: u.display_name || u.email,
        email: u.email,
        role: u.role,
        created_at: u.created_at,
      })),
    },
    content: {
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status !== "published").length,
    },
    queues: {
      lawyerApprovals: approvalsRes.count ?? 0,
      subscriptionRequests: subsRes.count ?? 0,
    },
    generatedAt: new Date().toISOString(),
  });
}

import { randomUUID } from "node:crypto";
import type {
  CollectionReference,
  DocumentData,
  Firestore,
  Query as FsQuery,
} from "firebase-admin/firestore";
import { getAdminBucket, getAdminFirestore } from "@/lib/firebase/admin";
import tableDefaults from "@/lib/firebase/table-defaults.json";

/**
 * Firestore-backed data client with the query-builder shape the app was
 * written against (`db.from("table").select().eq().order()...`).
 *
 * Each former Postgres table is a top-level collection; each row is a
 * document whose id equals the row's `id` column. Equality filters run in
 * Firestore (no composite indexes needed); `in`, ordering and limits are
 * applied in memory, which is fine at this app's data volumes.
 */

// Rows are schemaless documents, typed loosely like untyped PostgREST rows.
export type Row = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type DbError = {
  message: string;
  code: string;
  details?: string | null;
  hint?: string | null;
};

export type DbResult<T = Row[]> =
  | { data: T; error: null; count: number | null }
  | { data: null; error: DbError; count: number | null };

type Op = "select" | "insert" | "update" | "upsert" | "delete";
type Order = { column: string; ascending: boolean; nullsFirst: boolean };

const DEFAULTS = tableDefaults as Record<string, Row>;

function dbError(message: string, code = "internal"): DbError {
  return { message, code, details: null, hint: null };
}

function clone<T>(v: T): T {
  return v === undefined ? v : (JSON.parse(JSON.stringify(v)) as T);
}

function withDefaults(table: string, row: Row): Row {
  const now = new Date().toISOString();
  return {
    ...clone(DEFAULTS[table] ?? {}),
    created_at: now,
    updated_at: now,
    ...row,
    id: row.id ?? randomUUID(),
  };
}

function compare(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a) < String(b) ? -1 : 1;
}

/** Splits a select list on top-level commas (ignores commas inside `()`). */
function splitColumns(columns: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of columns) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

type Embed = { alias: string; table: string; fk: string; columns: string };

/** Parses `alias:table!hint(cols)` → many-to-one embed via `<singular>_id`. */
function parseEmbed(col: string): Embed | null {
  const m = col.match(/^(?:(\w+):)?(\w+)(?:!(\w+))?\(([\s\S]*)\)$/);
  if (!m) return null;
  const table = m[2];
  const fk = m[3] ?? `${table.replace(/s$/, "")}_id`;
  return { alias: m[1] ?? table, table, fk, columns: m[4] };
}

function project(row: Row, columns: string): Row {
  const cols = splitColumns(columns);
  const out: Row = cols.length === 0 || cols.includes("*") ? { ...row } : {};
  for (const c of cols) {
    if (c === "*") continue;
    const embed = parseEmbed(c);
    if (embed) {
      out[embed.alias] = row[embed.alias] ?? null;
      continue;
    }
    const [alias, source] = c.includes(":")
      ? c.split(":").map((s) => s.trim())
      : [c, c];
    out[alias] = row[source] ?? null;
  }
  return out;
}

export class QueryBuilder<T = Row[]> implements PromiseLike<DbResult<T>> {
  private op: Op = "select";
  private payload: Row | Row[] | null = null;
  private returning = false;
  private columns = "*";
  private eqs: [string, unknown][] = [];
  private ins: [string, unknown[]][] = [];
  private orders: Order[] = [];
  private limitN: number | null = null;
  private rangeFrom = 0;
  private mode: "many" | "single" | "maybe" = "many";
  private wantCount = false;
  private head = false;
  private onConflict = "id";

  constructor(
    private readonly fs: Firestore,
    private readonly table: string
  ) {}

  select(
    columns = "*",
    opts?: { count?: "exact" | "planned" | "estimated"; head?: boolean }
  ): QueryBuilder<Row[]> {
    if (this.op === "select") {
      this.columns = columns;
      this.wantCount = Boolean(opts?.count);
      this.head = Boolean(opts?.head);
    } else {
      this.returning = true;
      this.columns = columns;
    }
    return this as unknown as QueryBuilder<Row[]>;
  }

  insert(values: Row | Row[]) {
    this.op = "insert";
    this.payload = values;
    return this;
  }

  upsert(values: Row | Row[], opts?: { onConflict?: string }) {
    this.op = "upsert";
    this.payload = values;
    if (opts?.onConflict) this.onConflict = opts.onConflict;
    return this;
  }

  update(values: Row) {
    this.op = "update";
    this.payload = values;
    return this;
  }

  delete() {
    this.op = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.eqs.push([column, value]);
    return this;
  }

  in(column: string, values: readonly unknown[]) {
    this.ins.push([column, [...values]]);
    return this;
  }

  match(query: Row) {
    for (const [k, v] of Object.entries(query)) this.eqs.push([k, v]);
    return this;
  }

  order(column: string, opts?: { ascending?: boolean; nullsFirst?: boolean }) {
    this.orders.push({
      column,
      ascending: opts?.ascending ?? true,
      nullsFirst: opts?.nullsFirst ?? false,
    });
    return this;
  }

  limit(n: number) {
    this.limitN = n;
    return this;
  }

  range(from: number, to: number) {
    this.rangeFrom = from;
    this.limitN = to - from + 1;
    return this;
  }

  single(): QueryBuilder<Row> {
    this.mode = "single";
    return this as unknown as QueryBuilder<Row>;
  }

  maybeSingle(): QueryBuilder<Row | null> {
    this.mode = "maybe";
    return this as unknown as QueryBuilder<Row | null>;
  }

  then<R1 = DbResult<T>, R2 = never>(
    onfulfilled?: ((value: DbResult<T>) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: unknown) => R2 | PromiseLike<R2>) | null
  ): PromiseLike<R1 | R2> {
    return (this.execute() as Promise<DbResult<T>>).then(onfulfilled, onrejected);
  }

  private get collection(): CollectionReference<DocumentData> {
    return this.fs.collection(this.table);
  }

  private matchesMemory(row: Row): boolean {
    for (const [c, v] of this.eqs) {
      if ((row[c] ?? null) !== (v ?? null)) return false;
    }
    for (const [c, vs] of this.ins) {
      if (!vs.includes(row[c])) return false;
    }
    return true;
  }

  /** Loads rows matching the filters (unordered, unlimited). */
  private async loadMatching(): Promise<Row[]> {
    const idEq = this.eqs.find(([c]) => c === "id");
    if (idEq && typeof idEq[1] === "string") {
      const snap = await this.collection.doc(idEq[1]).get();
      const row = snap.exists ? (snap.data() as Row) : null;
      return row && this.matchesMemory(row) ? [row] : [];
    }

    let q: FsQuery<DocumentData> = this.collection;
    for (const [c, v] of this.eqs) {
      if (v !== null && v !== undefined) q = q.where(c, "==", v);
    }
    const snap = await q.get();
    return snap.docs.map((d) => d.data() as Row).filter((r) => this.matchesMemory(r));
  }

  private shape(rows: Row[], count: number | null): DbResult<unknown> {
    const projected = rows.map((r) => project(r, this.columns));
    if (this.mode === "single") {
      if (projected.length !== 1) {
        return {
          data: null,
          count,
          error: dbError(
            `JSON object requested, multiple (or no) rows returned`,
            "PGRST116"
          ),
        };
      }
      return { data: projected[0], error: null, count };
    }
    if (this.mode === "maybe") {
      if (projected.length > 1) {
        return {
          data: null,
          count,
          error: dbError("Multiple rows returned", "PGRST116"),
        };
      }
      return { data: projected[0] ?? null, error: null, count };
    }
    return { data: projected, error: null, count };
  }

  private async execute(): Promise<DbResult<unknown>> {
    try {
      switch (this.op) {
        case "select":
          return await this.runSelect();
        case "insert":
          return await this.runInsert();
        case "upsert":
          return await this.runUpsert();
        case "update":
          return await this.runUpdate();
        case "delete":
          return await this.runDelete();
      }
    } catch (err) {
      const e = err as { message?: string; code?: unknown };
      const already = e.code === 6 || /already exists/i.test(e.message ?? "");
      return {
        data: null,
        count: null,
        error: dbError(
          e.message ?? "Database error",
          already ? "23505" : "internal"
        ),
      };
    }
  }

  private async runSelect(): Promise<DbResult<unknown>> {
    let rows = await this.loadMatching();
    const total = rows.length;
    if (this.orders.length) {
      rows = [...rows].sort((a, b) => {
        for (const o of this.orders) {
          const av = a[o.column] ?? null;
          const bv = b[o.column] ?? null;
          if (av === null && bv !== null) return o.nullsFirst ? -1 : 1;
          if (bv === null && av !== null) return o.nullsFirst ? 1 : -1;
          const c = compare(av, bv);
          if (c !== 0) return o.ascending ? c : -c;
        }
        return 0;
      });
    }
    rows = rows.slice(
      this.rangeFrom,
      this.limitN === null ? undefined : this.rangeFrom + this.limitN
    );
    const count = this.wantCount ? total : null;
    if (this.head) return { data: null, error: null, count };
    return this.shape(await this.attachEmbeds(rows), count);
  }

  /** Resolves `rel(cols)` select entries as many-to-one lookups. */
  private async attachEmbeds(rows: Row[]): Promise<Row[]> {
    const embeds = splitColumns(this.columns)
      .map(parseEmbed)
      .filter((e): e is Embed => e !== null);
    if (!embeds.length || !rows.length) return rows;
    const out = rows.map((r) => ({ ...r }));
    for (const e of embeds) {
      const ids = [...new Set(out.map((r) => r[e.fk]).filter(Boolean))].map(String);
      const refs = ids.map((id) => this.fs.collection(e.table).doc(id));
      const snaps = refs.length ? await this.fs.getAll(...refs) : [];
      const byId = new Map(
        snaps.filter((d) => d.exists).map((d) => [d.id, d.data() as Row])
      );
      for (const r of out) {
        const hit = r[e.fk] ? byId.get(String(r[e.fk])) : undefined;
        r[e.alias] = hit ? project(hit, e.columns) : null;
      }
    }
    return out;
  }

  private rowsFromPayload(): Row[] {
    const p = this.payload;
    return Array.isArray(p) ? p : p ? [p] : [];
  }

  private async runInsert(): Promise<DbResult<unknown>> {
    const rows = this.rowsFromPayload().map((r) => withDefaults(this.table, r));
    const batch = this.fs.batch();
    for (const r of rows) batch.create(this.collection.doc(String(r.id)), r);
    await batch.commit();
    return this.returning ? this.shape(rows, null) : { data: null, error: null, count: null };
  }

  private async runUpsert(): Promise<DbResult<unknown>> {
    const keys = this.onConflict.split(",").map((k) => k.trim());
    const out: Row[] = [];
    for (const input of this.rowsFromPayload()) {
      let existing: Row | null = null;
      if (keys.length === 1 && keys[0] === "id" && input.id) {
        const snap = await this.collection.doc(String(input.id)).get();
        existing = snap.exists ? (snap.data() as Row) : null;
      } else {
        let q: FsQuery<DocumentData> = this.collection;
        for (const k of keys) q = q.where(k, "==", input[k] ?? null);
        const snap = await q.limit(1).get();
        existing = snap.empty ? null : (snap.docs[0].data() as Row);
      }

      if (existing) {
        const merged = {
          ...existing,
          ...input,
          id: existing.id,
          updated_at: input.updated_at ?? new Date().toISOString(),
        };
        await this.collection.doc(String(existing.id)).set(merged);
        out.push(merged);
      } else {
        const row = withDefaults(this.table, input);
        await this.collection.doc(String(row.id)).set(row);
        out.push(row);
      }
    }
    return this.returning ? this.shape(out, null) : { data: null, error: null, count: null };
  }

  private async runUpdate(): Promise<DbResult<unknown>> {
    const patch = (this.payload ?? {}) as Row;
    const rows = await this.loadMatching();
    const out: Row[] = [];
    const batch = this.fs.batch();
    for (const r of rows) {
      const merged = { ...r, ...patch, id: r.id };
      batch.set(this.collection.doc(String(r.id)), merged);
      out.push(merged);
    }
    if (out.length) await batch.commit();
    return this.returning ? this.shape(out, null) : { data: null, error: null, count: null };
  }

  private async runDelete(): Promise<DbResult<unknown>> {
    const rows = await this.loadMatching();
    const batch = this.fs.batch();
    for (const r of rows) batch.delete(this.collection.doc(String(r.id)));
    if (rows.length) await batch.commit();
    return this.returning ? this.shape(rows, null) : { data: null, error: null, count: null };
  }
}

export type AuthUser = {
  id: string;
  email: string | null;
  user_metadata: Record<string, unknown>;
};

type StorageResult<T> = { data: T | null; error: DbError | null };

/** Firebase Storage with the bucket API the documents routes use. */
function storageBucket(bucket: string) {
  const files = getAdminBucket();
  const file = (p: string) => files.file(`${bucket}/${p}`);
  const fail = (err: unknown): StorageResult<never> => ({
    data: null,
    error: dbError(err instanceof Error ? err.message : "Storage error"),
  });
  return {
    async upload(
      p: string,
      body: Buffer | Uint8Array,
      opts?: { contentType?: string; upsert?: boolean }
    ): Promise<StorageResult<{ path: string }>> {
      try {
        await file(p).save(Buffer.from(body), {
          contentType: opts?.contentType,
          resumable: false,
          ...(opts?.upsert ? {} : { preconditionOpts: { ifGenerationMatch: 0 } }),
        });
        return { data: { path: p }, error: null };
      } catch (err) {
        return fail(err);
      }
    },
    async createSignedUrl(
      p: string,
      expiresInSeconds: number
    ): Promise<StorageResult<{ signedUrl: string }>> {
      try {
        const [signedUrl] = await file(p).getSignedUrl({
          action: "read",
          expires: Date.now() + expiresInSeconds * 1000,
        });
        return { data: { signedUrl }, error: null };
      } catch (err) {
        return fail(err);
      }
    },
    async remove(paths: string[]): Promise<StorageResult<{ path: string }[]>> {
      try {
        await Promise.all(
          paths.map((p) => file(p).delete({ ignoreNotFound: true }))
        );
        return { data: paths.map((path) => ({ path })), error: null };
      } catch (err) {
        return fail(err);
      }
    },
  };
}

export type DbClient = {
  from(table: string): QueryBuilder;
  storage: { from: typeof storageBucket };
  auth: {
    getUser(): Promise<{ data: { user: AuthUser | null }; error: null }>;
  };
};

export function createDb(
  getUser: () => Promise<AuthUser | null> = async () => null
): DbClient {
  const fs = getAdminFirestore();
  return {
    from: (table: string) => new QueryBuilder(fs, table),
    storage: { from: storageBucket },
    auth: {
      async getUser() {
        return { data: { user: await getUser() }, error: null };
      },
    },
  };
}

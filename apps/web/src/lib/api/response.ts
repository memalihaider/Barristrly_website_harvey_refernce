import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation_error"
  | "conflict"
  | "not_configured"
  | "internal";

export function apiOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, { status: 200, ...init });
}

export function apiCreated<T>(data: T) {
  return NextResponse.json({ ok: true, data }, { status: 201 });
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json(
    { ok: false, error: { code, message, details } },
    { status }
  );
}

export function notConfigured(feature: string) {
  return apiError(
    "not_configured",
    `${feature} requires Supabase/env configuration. See .env.example.`,
    503
  );
}

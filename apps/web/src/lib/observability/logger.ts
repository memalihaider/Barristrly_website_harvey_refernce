/**
 * Lightweight structured logger (Phase 0 observability stub).
 * Replace with OpenTelemetry exporters in production.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string, fields?: Record<string, unknown>) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    service: "barristrly-web",
    ...fields,
  };
  // Never log secrets / PII — callers must redact
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, fields?: Record<string, unknown>) =>
    log("debug", message, fields),
  info: (message: string, fields?: Record<string, unknown>) =>
    log("info", message, fields),
  warn: (message: string, fields?: Record<string, unknown>) =>
    log("warn", message, fields),
  error: (message: string, fields?: Record<string, unknown>) =>
    log("error", message, fields),
};

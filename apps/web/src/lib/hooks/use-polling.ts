"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `fn` now and then every `intervalMs` while the tab is visible,
 * and immediately when the tab becomes visible again.
 */
export function usePolling(fn: () => Promise<unknown>, intervalMs: number) {
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const run = () => fnRef.current().catch(() => undefined);
    const tick = async () => {
      if (!document.hidden) await run();
      if (!stopped) timer = setTimeout(tick, intervalMs);
    };
    timer = setTimeout(tick, 0);
    const onVisible = () => {
      if (!document.hidden) void run();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs]);
}

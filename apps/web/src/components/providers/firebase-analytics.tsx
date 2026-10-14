"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/firebase/browser";

/** Initializes Firebase Analytics once in the browser. */
export default function FirebaseAnalytics() {
  useEffect(() => {
    void initAnalytics().catch(() => undefined);
  }, []);
  return null;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INTRO_SESSION_KEY, ROOM_TIMING } from "../config";

/** Storage is optional; the room still works in privacy modes. */
export function useRoomIntro(reduced: boolean, hidden: boolean) {
  const [phase, setPhase] = useState<"ready" | "entering" | "settled">("ready");
  const remaining = useRef<number>(ROOM_TIMING.introMs);
  const finish = useCallback(() => {
    try { sessionStorage.setItem(INTRO_SESSION_KEY, "1"); } catch { /* optional */ }
    setPhase("settled");
  }, []);

  useEffect(() => {
    if (reduced || hidden || phase !== "ready") return;
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_SESSION_KEY) === "1"; } catch { /* optional */ }
    // Schedule setup outside the effect body; SSR and hydration both start static.
    const frame = requestAnimationFrame(() => setPhase(seen ? "settled" : "entering"));
    return () => cancelAnimationFrame(frame);
  }, [reduced, hidden, phase]);

  useEffect(() => {
    if (phase !== "entering") return;
    if (reduced) { finish(); return; }
    if (hidden) return;
    const started = performance.now();
    const timer = window.setTimeout(finish, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [phase, reduced, hidden, finish]);

  return { entering: phase === "entering" && !reduced, finish };
}

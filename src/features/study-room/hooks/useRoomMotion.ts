"use client";

import { useSyncExternalStore } from "react";

const REDUCED = 1;
const HIDDEN = 2;
const LIMITED = 4;

function subscribe(onChange: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.addEventListener("visibilitychange", onChange);
  preference.addEventListener("change", onChange);
  return () => {
    document.removeEventListener("visibilitychange", onChange);
    preference.removeEventListener("change", onChange);
  };
}

function getSnapshot() {
  const device = navigator as Navigator & { connection?: { saveData?: boolean } };
  return (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? REDUCED : 0)
    | (document.hidden ? HIDDEN : 0)
    | (device.connection?.saveData || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2) ? LIMITED : 0);
}

export function useRoomMotion() {
  // Static SSR artwork remains visible before hydration and without JavaScript.
  const flags = useSyncExternalStore(subscribe, getSnapshot, () => REDUCED);
  return {
    reduced: Boolean(flags & REDUCED),
    hidden: Boolean(flags & HIDDEN),
    limited: Boolean(flags & LIMITED),
  };
}

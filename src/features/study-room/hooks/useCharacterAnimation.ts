"use client";

import { useEffect, useRef, useState } from "react";
import { ROOM_TIMING, type CharacterAnimation } from "../config";

const actions = ["idle", "thinking", "stretching"] as const;
type SpecialAction = (typeof actions)[number];

/** One timer and one state: gestures can never overlap. Hidden tabs cancel the timer. */
export function useCharacterAnimation(active: boolean, restRequest = 0): CharacterAnimation {
  const [animation, setAnimation] = useState<CharacterAnimation>({ state: "typing", phase: "working" });
  const previous = useRef<SpecialAction | null>(null);
  const clock = useRef({ key: "", remaining: 0 });
  const consumedRequest = useRef(0);
  const { state, phase } = animation;

  useEffect(() => {
    if (!active) return;
    const key = `${state}:${phase}`;
    if (clock.current.key !== key) {
      clock.current = {
        key,
        remaining: state === "typing"
          ? ROOM_TIMING.typingMinMs + Math.random() * (ROOM_TIMING.typingMaxMs - ROOM_TIMING.typingMinMs)
          : state === "idle" ? ROOM_TIMING.idleMs
          : phase === "preparing" ? ROOM_TIMING.prepareMs
          : phase === "returning" ? ROOM_TIMING.returnMs
          : ROOM_TIMING[`${state === "drinking" ? "thinking" : state}Ms`] - ROOM_TIMING.prepareMs - ROOM_TIMING.returnMs,
      };
    }
    const started = performance.now();
    const requestedRest = state === "typing" && restRequest > consumedRequest.current;
    const timer = window.setTimeout(() => {
      if (requestedRest) {
        consumedRequest.current = restRequest;
        setAnimation({ state: "idle", phase: "holding" });
        return;
      }
      if (state === "idle" || phase === "returning") {
        setAnimation({ state: "typing", phase: "working" });
        return;
      }
      if (phase === "preparing") {
        setAnimation({ state, phase: "holding" });
        return;
      }
      if (phase === "holding") {
        setAnimation({ state, phase: "returning" });
        return;
      }
      const candidates = actions.filter(action => action !== previous.current);
      const next = candidates[Math.floor(Math.random() * candidates.length)];
      previous.current = next;
      setAnimation({ state: next, phase: next === "idle" ? "holding" : "preparing" });
    }, requestedRest ? 120 : clock.current.remaining);
    return () => {
      window.clearTimeout(timer);
      clock.current.remaining = Math.max(0, clock.current.remaining - (performance.now() - started));
    };
  }, [active, state, phase, restRequest]);

  // CSS pauses the existing pose instead of snapping back to idle.
  return animation;
}

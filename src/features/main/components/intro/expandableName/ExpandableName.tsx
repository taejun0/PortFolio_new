/**
 * The hero name is immediately visible and only reacts to pointer proximity.
 * Keeping the interaction imperative avoids a React render on every pointer move.
 */
"use client";

import { useEffect, useMemo, useRef } from "react";

import * as S from "./ExpandableName.styled";

const MIN_SCALE_X = 0.2;
const MAX_SCALE_X = 1.08;
const MIN_SCALE_Y = 0.94;
const MAX_SCALE_Y = 1.14;
const MAX_LIFT = -14;
const Y_WEIGHT = 0.55;

const influenceRadius = () =>
  Math.min(280, Math.max(150, window.innerWidth * 0.145));

const hitPad = () => Math.min(160, Math.max(96, window.innerWidth * 0.09));

type ExpandableNameProps = {
  text: string;
};

const ExpandableName = ({ text }: ExpandableNameProps) => {
  const letters = useMemo(() => Array.from(text), [text]);
  const rootRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerRef = useRef({ x: 0, y: 0, inside: false });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = Array.from(text);
    const glyphs = glyphRefs.current;

    const paint = (
      scalesX: number[],
      scalesY: number[],
      lifts: number[],
      tints: number[]
    ) => {
      scalesX.forEach((scaleX, index) => {
        const glyph = glyphs[index];
        if (!glyph || chars[index] === " ") return;
        glyph.style.setProperty("--sx", scaleX.toFixed(3));
        glyph.style.setProperty("--sy", scalesY[index].toFixed(3));
        glyph.style.setProperty("--ty", `${lifts[index].toFixed(2)}px`);
        glyph.style.setProperty("--tint", tints[index].toFixed(3));
      });
    };

    const paintIdle = () => {
      paint(
        chars.map((char) => (char === " " ? 1 : MIN_SCALE_X)),
        chars.map((char) => (char === " " ? 1 : MIN_SCALE_Y)),
        chars.map(() => 0),
        chars.map(() => 0)
      );
    };

    const tick = () => {
      rafRef.current = null;
      const { x, y, inside } = pointerRef.current;

      if (!inside) {
        paintIdle();
        return;
      }

      const scalesX: number[] = [];
      const scalesY: number[] = [];
      const lifts: number[] = [];
      const tints: number[] = [];

      chars.forEach((char, index) => {
        if (char === " ") {
          scalesX.push(1);
          scalesY.push(1);
          lifts.push(0);
          tints.push(0);
          return;
        }

        const slot = slotRefs.current[index];
        if (!slot) {
          scalesX.push(MIN_SCALE_X);
          scalesY.push(MIN_SCALE_Y);
          lifts.push(0);
          tints.push(0);
          return;
        }

        const rect = slot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(x - cx, (y - cy) * Y_WEIGHT);
        const proximity = Math.max(0, 1 - distance / influenceRadius());
        const eased = proximity * proximity * (3 - 2 * proximity);
        const amount = Math.pow(eased, 0.85);

        scalesX.push(MIN_SCALE_X + (MAX_SCALE_X - MIN_SCALE_X) * amount);
        scalesY.push(MIN_SCALE_Y + (MAX_SCALE_Y - MIN_SCALE_Y) * amount);
        lifts.push(MAX_LIFT * amount);
        tints.push(amount * 0.4);
      });

      paint(scalesX, scalesY, lifts, tints);
    };

    const requestTick = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const onMove = (event: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;

      const bounds = root.getBoundingClientRect();
      const pad = hitPad();
      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        inside:
          event.clientX >= bounds.left - pad &&
          event.clientX <= bounds.right + pad &&
          event.clientY >= bounds.top - pad &&
          event.clientY <= bounds.bottom + pad,
      };
      requestTick();
    };

    const onLeave = () => {
      pointerRef.current.inside = false;
      requestTick();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  return (
    <S.Name ref={rootRef} role="img" aria-label={text}>
      {letters.map((char, index) =>
        char === " " ? (
          <S.Space key={`space-${index}`} aria-hidden />
        ) : (
          <S.Slot
            key={`${char}-${index}`}
            ref={(node) => {
              slotRefs.current[index] = node;
            }}
          >
            <S.Fall aria-hidden>
              <S.Glyph
                ref={(node) => {
                  glyphRefs.current[index] = node;
                }}
                $interactive
              >
                {char}
              </S.Glyph>
            </S.Fall>
          </S.Slot>
        )
      )}
    </S.Name>
  );
};

export default ExpandableName;

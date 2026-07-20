/**
 * 생성 이유: Thomas Eduardo식 가변 폭 이름 연출을 히어로 본문과 분리한다.
 * 역할: 커서 근접에 반응하는 디스플레이 네임이다.
 * 책임: scale·리프트·액센트 틴트로 렌즈형 반응을 보간한다.
 *
 * 심미 원칙 (Pretendard는 wdth 축이 없음):
 * - 슬롯 폭은 고정 → 레이아웃이 덜렁거리지 않음
 * - 근접 글자만 scaleX/Y·색·그림자로 강조
 * - 완만한 falloff로 2~3글자가 같이 숨 쉬듯 반응
 */
"use client";

import { useEffect, useRef, useState } from "react";

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
  const letters = Array.from(text);
  const rootRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pointerRef = useRef<{ x: number; y: number; inside: boolean }>({
    x: 0,
    y: 0,
    inside: false,
  });
  const rafRef = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
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

    if (reducedMotion) {
      const ones = chars.map(() => 1);
      const zeros = chars.map(() => 0);
      paint(
        chars.map(() => MAX_SCALE_X),
        ones,
        zeros,
        zeros
      );
      return;
    }

    const idle = () => {
      paint(
        chars.map((char) => (char === " " ? 1 : MIN_SCALE_X)),
        chars.map((char) => (char === " " ? 1 : MIN_SCALE_Y)),
        chars.map(() => 0),
        chars.map(() => 0)
      );
    };

    idle();

    const tick = () => {
      rafRef.current = null;
      const { x, y, inside } = pointerRef.current;

      if (!inside) {
        idle();
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
        const t = Math.max(0, 1 - distance / influenceRadius());
        // 중심은 더 세게, 가장자리는 부드럽게
        const eased = t * t * (3 - 2 * t);
        const punch = Math.pow(eased, 0.85);

        scalesX.push(MIN_SCALE_X + (MAX_SCALE_X - MIN_SCALE_X) * punch);
        scalesY.push(MIN_SCALE_Y + (MAX_SCALE_Y - MIN_SCALE_Y) * punch);
        lifts.push(MAX_LIFT * punch);
        tints.push(punch);
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
      const inside =
        event.clientX >= bounds.left - pad &&
        event.clientX <= bounds.right + pad &&
        event.clientY >= bounds.top - pad &&
        event.clientY <= bounds.bottom + pad;

      pointerRef.current = {
        x: event.clientX,
        y: event.clientY,
        inside,
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
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [text, reducedMotion]);

  return (
    <S.Name ref={rootRef} aria-label={text}>
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
            <S.Glyph
              ref={(node) => {
                glyphRefs.current[index] = node;
              }}
              aria-hidden
            >
              {char}
            </S.Glyph>
          </S.Slot>
        )
      )}
    </S.Name>
  );
};

export default ExpandableName;

/**
 * 생성 이유: Thomas Eduardo식 가변 폭 이름 연출을 히어로 본문과 분리한다.
 * 역할: 커서 근접에 따라 주변 글자 가로 폭이 늘어나는 디스플레이 네임이다.
 * 책임: 슬롯 고정 + 넓은 영향 반경의 scaleX 보간, rAF 기반 갱신을 담당한다.
 */
"use client";

import { useEffect, useRef, useState } from "react";

import * as S from "./ExpandableName.styled";

const MIN_SCALE = 0.18;
const MAX_SCALE = 1;
/** 커서에서 이 거리(px) 안이면 글자가 펼쳐지기 시작 */
const INFLUENCE_RADIUS = 200;
/** 이름 영역 바깥에서도 반응을 받기 위한 여유 */
const HIT_PAD = 96;
const Y_WEIGHT = 0.7;

type ExpandableNameProps = {
  text: string;
};

const ExpandableName = ({ text }: ExpandableNameProps) => {
  const letters = Array.from(text);
  const rootRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const scalesRef = useRef<number[]>(
    letters.map((char) => (char === " " ? 1 : MIN_SCALE))
  );
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

    const paint = (values: number[]) => {
      values.forEach((scale, index) => {
        const glyph = glyphs[index];
        if (!glyph || chars[index] === " ") return;
        glyph.style.setProperty("--sx", scale.toFixed(3));
      });
    };

    if (reducedMotion) {
      const full = chars.map(() => MAX_SCALE);
      scalesRef.current = full;
      paint(full);
      return;
    }

    const reset = () => {
      const next = chars.map((char) => (char === " " ? 1 : MIN_SCALE));
      scalesRef.current = next;
      paint(next);
    };

    reset();

    const tick = () => {
      rafRef.current = null;
      const { x, y, inside } = pointerRef.current;

      if (!inside) {
        reset();
        return;
      }

      const next = chars.map((char, index) => {
        if (char === " ") return 1;
        const slot = slotRefs.current[index];
        if (!slot) return MIN_SCALE;

        const rect = slot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(x - cx, (y - cy) * Y_WEIGHT);
        const t = Math.max(0, 1 - distance / INFLUENCE_RADIUS);
        // 부드러운 falloff — 근처만 가도 여러 글자가 함께 반응
        const eased = t * t * (3 - 2 * t);
        return MIN_SCALE + (MAX_SCALE - MIN_SCALE) * eased;
      });

      scalesRef.current = next;
      paint(next);
    };

    const requestTick = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const onMove = (event: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      const bounds = root.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left - HIT_PAD &&
        event.clientX <= bounds.right + HIT_PAD &&
        event.clientY >= bounds.top - HIT_PAD &&
        event.clientY <= bounds.bottom + HIT_PAD;

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

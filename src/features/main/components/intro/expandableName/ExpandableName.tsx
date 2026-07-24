/**
 * 생성 이유: Thomas Eduardo식 가변 폭 이름 연출을 히어로 본문과 분리한다.
 * 역할: 커서 근접에 반응하는 디스플레이 네임이다.
 * 책임: 진입 낙하→안착→압축 후 scale·리프트·액센트 틴트 렌즈형 반응을 보간한다.
 *
 * 심미 원칙 (Pretendard는 wdth 축이 없음):
 * - 슬롯 폭은 고정 → 레이아웃이 덜렁거리지 않음
 * - 진입: 위→아래로 글자가 하나씩 떨어져 자리를 잡은 뒤 얇은 idle로 압축
 * - 근접 글자만 scaleX/Y·색·그림자로 강조
 */
"use client";

import { useEffect, useRef, useState } from "react";

import * as S from "./ExpandableName.styled";
import { SPLASH_UI } from "@/components/layout/splash/constants";

const MIN_SCALE_X = 0.2;
const MAX_SCALE_X = 1.08;
const MIN_SCALE_Y = 0.94;
const MAX_SCALE_Y = 1.14;
const MAX_LIFT = -14;
const Y_WEIGHT = 0.55;

const ENTER_STAGGER = 0.07;
const ENTER_DURATION = 0.72;
const COMPRESS_MS = 520;

const influenceRadius = () =>
  Math.min(280, Math.max(150, window.innerWidth * 0.145));

const hitPad = () => Math.min(160, Math.max(96, window.innerWidth * 0.09));

const fallOffset = (index: number) => -210 - (index % 3) * 28;
const fallRotate = (index: number) =>
  (index % 2 === 0 ? -1 : 1) * (14 + (index % 4) * 5);

type Phase = "waiting" | "enter" | "compress" | "ready";

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
  const [phase, setPhase] = useState<Phase>("waiting");
  const interactive = phase === "ready";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const preferReduce = media.matches;
      setReducedMotion(preferReduce);
      if (preferReduce) setPhase("ready");
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setTimeout(
      () => setPhase((current) => (current === "waiting" ? "enter" : current)),
      SPLASH_UI.minMs
    );
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || phase !== "enter") return;

    const letterCount = Array.from(text).filter((char) => char !== " ").length;
    const totalMs =
      (Math.max(letterCount - 1, 0) * ENTER_STAGGER + ENTER_DURATION) * 1000 +
      80;

    const timer = window.setTimeout(() => setPhase("compress"), totalMs);
    return () => window.clearTimeout(timer);
  }, [text, reducedMotion, phase]);

  useEffect(() => {
    if (phase !== "compress") return;

    const chars = Array.from(text);
    const glyphs = glyphRefs.current;
    const started = performance.now();
    let frame = 0;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    chars.forEach((char, index) => {
      const glyph = glyphs[index];
      if (!glyph || char === " ") return;
      glyph.style.setProperty("--sx", "1");
      glyph.style.setProperty("--sy", "1");
      glyph.style.setProperty("--ty", "0px");
      glyph.style.setProperty("--tint", "0");
    });

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / COMPRESS_MS);
      const eased = easeOut(progress);
      const scaleX = 1 - (1 - MIN_SCALE_X) * eased;
      const scaleY = 1 - (1 - MIN_SCALE_Y) * eased;

      chars.forEach((char, index) => {
        const glyph = glyphs[index];
        if (!glyph || char === " ") return;
        glyph.style.setProperty("--sx", scaleX.toFixed(3));
        glyph.style.setProperty("--sy", scaleY.toFixed(3));
      });

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      setPhase("ready");
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phase, text]);

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
      paint(
        chars.map(() => MAX_SCALE_X),
        chars.map(() => 1),
        chars.map(() => 0),
        chars.map(() => 0)
      );
      return;
    }

    if (!interactive) return;

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
        const eased = t * t * (3 - 2 * t);
        const punch = Math.pow(eased, 0.85);

        scalesX.push(MIN_SCALE_X + (MAX_SCALE_X - MIN_SCALE_X) * punch);
        scalesY.push(MIN_SCALE_Y + (MAX_SCALE_Y - MIN_SCALE_Y) * punch);
        lifts.push(MAX_LIFT * punch);
        tints.push(punch * 0.4);
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
  }, [text, reducedMotion, interactive]);

  let visualIndex = 0;

  return (
    <S.Name ref={rootRef} aria-label={text} data-phase={phase}>
      {letters.map((char, index) => {
        if (char === " ") {
          return <S.Space key={`space-${index}`} aria-hidden />;
        }

        const staggerIndex = visualIndex;
        visualIndex += 1;

        return (
          <S.Slot
            key={`${char}-${index}`}
            ref={(node) => {
              slotRefs.current[index] = node;
            }}
          >
            <S.Fall
              aria-hidden
              initial={
                reducedMotion
                  ? { y: 0, opacity: 1, rotate: 0 }
                  : {
                      y: fallOffset(staggerIndex),
                      opacity: 0,
                      rotate: fallRotate(staggerIndex),
                    }
              }
              animate={
                reducedMotion || phase === "ready" || phase === "compress"
                  ? { y: 0, opacity: 1, rotate: 0 }
                  : phase === "waiting"
                    ? {
                        y: fallOffset(staggerIndex),
                        opacity: 0,
                        rotate: fallRotate(staggerIndex),
                      }
                    : {
                        y: 0,
                        opacity: 1,
                        rotate: 0,
                      }
              }
              transition={
                phase === "enter"
                  ? {
                      delay: staggerIndex * ENTER_STAGGER,
                      duration: ENTER_DURATION,
                      ease: [0.16, 1, 0.3, 1],
                      opacity: {
                        delay: staggerIndex * ENTER_STAGGER,
                        duration: ENTER_DURATION * 0.5,
                      },
                    }
                  : { duration: 0 }
              }
            >
              <S.Glyph
                ref={(node) => {
                  glyphRefs.current[index] = node;
                }}
                $interactive={interactive}
              >
                {char}
              </S.Glyph>
            </S.Fall>
          </S.Slot>
        );
      })}
    </S.Name>
  );
};

export default ExpandableName;

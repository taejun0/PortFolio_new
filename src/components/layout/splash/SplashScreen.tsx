/**
 * 생성 이유: 초기 로드 동안 빈 화면 대신 OHTAEJUN 브랜드 스플래시를 보여 준다.
 * 역할: 앱 준비 완료 전 전체 화면 로딩 오버레이다.
 * 책임: 글자 빠른 조립→일제 폭파 퇴장, fonts/load 게이트, dismiss 시그널을 관리한다.
 */
"use client";

import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import * as S from "./SplashScreen.styled";
import {
  SPLASH_BURST,
  SPLASH_DISMISS_EVENT,
  SPLASH_UI,
} from "./constants";

type SplashScreenProps = {
  onReady?: () => void;
};

type Phase = "enter" | "hold" | "shatter";

const waitDoubleFrame = () =>
  new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });

const waitWindowLoad = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }
    window.addEventListener("load", () => resolve(), { once: true });
  });

const waitFonts = () => {
  if (typeof document === "undefined" || !document.fonts?.ready) {
    return Promise.resolve();
  }
  return document.fonts.ready.then(() => undefined);
};

const SplashScreen = ({ onReady }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>("enter");
  const [gateOpen, setGateOpen] = useState(false);
  const finishedRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const letters = Array.from(SPLASH_UI.name);

  const dismiss = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.documentElement.dataset.splashDone = "1";
    window.dispatchEvent(new Event(SPLASH_DISMISS_EVENT));
    onReady?.();
    setVisible(false);
  };

  useEffect(() => {
    if (reduceMotion) {
      setPhase("hold");
      return;
    }
    const enterMs =
      (Math.max(letters.length - 1, 0) * SPLASH_UI.enterStagger +
        SPLASH_UI.enterDuration) *
        1000 +
      80;
    const timer = window.setTimeout(() => setPhase("hold"), enterMs);
    return () => window.clearTimeout(timer);
  }, [letters.length, reduceMotion]);

  useEffect(() => {
    let cancelled = false;
    let minTimer = 0;
    const started = performance.now();

    const openGate = () => {
      if (cancelled) return;
      setGateOpen(true);
    };

    const run = async () => {
      await Promise.all([waitWindowLoad(), waitFonts()]);
      if (cancelled) return;
      await waitDoubleFrame();
      if (cancelled) return;

      const elapsed = performance.now() - started;
      const wait = Math.max(0, SPLASH_UI.minMs - elapsed);
      minTimer = window.setTimeout(openGate, wait);
    };

    void run();

    const failSafe = window.setTimeout(openGate, SPLASH_UI.failSafeMs);

    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
      window.clearTimeout(minTimer);
    };
  }, []);

  useEffect(() => {
    if (!gateOpen || phase === "enter") return;

    if (reduceMotion) {
      dismiss();
      return;
    }

    if (phase === "hold") {
      setPhase("shatter");
      return;
    }

    if (phase !== "shatter") return;
    const timer = window.setTimeout(dismiss, SPLASH_UI.shatterMs);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateOpen, phase, reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <S.Overlay
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-busy="true"
          aria-live="polite"
          aria-label={SPLASH_UI.name}
        >
          <S.Brand>
            {letters.map((char, index) => {
              const burst =
                SPLASH_BURST[index % SPLASH_BURST.length] ?? SPLASH_BURST[0];
              const shattering = !reduceMotion && phase === "shatter";
              const settled =
                reduceMotion || phase === "enter" || phase === "hold";

              return (
                <S.Slot key={`${char}-${index}`}>
                  <S.Fall
                    aria-hidden
                    initial={
                      reduceMotion
                        ? {
                            y: 0,
                            x: 0,
                            opacity: 1,
                            rotate: 0,
                            scale: 1,
                            filter: "blur(0px)",
                          }
                        : {
                            y: -40,
                            x: 0,
                            opacity: 0,
                            rotate: 0,
                            scale: 0.92,
                            filter: "blur(0px)",
                          }
                    }
                    animate={
                      shattering
                        ? {
                            x: burst.x,
                            y: burst.y,
                            rotate: burst.rotate,
                            opacity: 0,
                            scale: burst.scale,
                            filter: "blur(10px)",
                          }
                        : settled
                          ? {
                              y: 0,
                              x: 0,
                              opacity: 1,
                              rotate: 0,
                              scale: 1,
                              filter: "blur(0px)",
                            }
                          : {
                              y: -40,
                              opacity: 0,
                              scale: 0.92,
                              filter: "blur(0px)",
                            }
                    }
                    transition={
                      shattering
                        ? {
                            // 딜레이 없이 한 번에 터짐
                            duration: SPLASH_UI.shatterMs / 1000,
                            ease: [0.15, 0.85, 0.25, 1],
                          }
                        : {
                            delay: index * SPLASH_UI.enterStagger,
                            duration: SPLASH_UI.enterDuration,
                            ease: [0.22, 1, 0.36, 1],
                          }
                    }
                  >
                    <S.Glyph>{char}</S.Glyph>
                  </S.Fall>
                </S.Slot>
              );
            })}
          </S.Brand>
        </S.Overlay>
      ) : null}
    </AnimatePresence>
  );
};

export default SplashScreen;

/**
 * 생성 이유: 초기 로드 동안 빈 화면 대신 브랜드 스플래시를 보여 준다.
 * 역할: 앱 준비 완료 전 전체 화면 로딩 오버레이다.
 * 책임: 최소 노출 시간·페이드아웃·reduced-motion 대응을 관리한다.
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import * as S from "./SplashScreen.styled";
import { SPLASH_UI } from "./constants";

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const started = performance.now();
    let cancelled = false;
    let frame = 0;

    const finish = () => {
      if (cancelled) return;
      const elapsed = performance.now() - started;
      const wait = Math.max(0, SPLASH_UI.minMs - elapsed);
      window.setTimeout(() => {
        if (!cancelled) setVisible(false);
      }, wait);
    };

    const waitReady = () => {
      if (document.readyState === "complete") {
        finish();
        return;
      }
      window.addEventListener("load", finish, { once: true });
    };

    frame = window.requestAnimationFrame(() => {
      waitReady();
    });

    const failSafe = window.setTimeout(() => {
      if (!cancelled) setVisible(false);
    }, SPLASH_UI.failSafeMs);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(failSafe);
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <S.Overlay
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-busy="true"
          aria-live="polite"
        >
          <S.Wash />
          <S.Brand>
            <S.Mark
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
            <S.Name
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.45 }}
            >
              {SPLASH_UI.name}
            </S.Name>
            <S.Sub
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.4 }}
            >
              {SPLASH_UI.sub}
            </S.Sub>
          </S.Brand>
          <S.Progress aria-hidden />
        </S.Overlay>
      ) : null}
    </AnimatePresence>
  );
};

export default SplashScreen;

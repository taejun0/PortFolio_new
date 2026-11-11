/**
 * 역할: 첫 화면의 준비를 확인해 부트 스플래시에 알린다. 아무것도 렌더링하지 않는다.
 * 책임: React 커밋 뒤 DOM·폰트·첫 화면 이미지와 렌더 프레임을 기다린다.
 *       최소 표시 시간과 퇴장은 splashBoot가 소유하고, 페이지 준비와 재생 완료 신호를 구분한다.
 *       각 페이지의 클라이언트 루트 안에 둔다. 전역 Provider만 먼저 준비돼도 종료되는 것을 방지한다.
 *       이벤트 이름은 splash/events에서 가져온다 — 스플래시 상수(문구·타이밍·DOM 훅)는 클라이언트 번들에 싣지 않는다.
 */
"use client";

import { useEffect } from "react";

import { SPLASH_DISMISS_EVENT, SPLASH_READY_EVENT } from "./events";
import { waitForInitialView } from "./readiness";

const SplashScreen = () => {
  useEffect(() => {
    const root = document.documentElement;
    const { splash, splashDone } = root.dataset;

    if (splash === "play" && splashDone !== "1") {
      const controller = new AbortController();
      void waitForInitialView(controller.signal).then((ready) => {
        if (ready && root.dataset.splash === "play") {
          window.dispatchEvent(new Event(SPLASH_READY_EVENT));
        }
      });
      return () => controller.abort();
    }

    // 별도 인트로 경로, 이미 끝난 스플래시, 부트 스크립트 오류에서도 본문 효과를 해제한다.
    if (splashDone !== "1") {
      root.dataset.splashDone = "1";
      window.dispatchEvent(new Event(SPLASH_DISMISS_EVENT));
    }
  }, []);

  return null;
};

export default SplashScreen;

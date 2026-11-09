/**
 * 생성 이유: CSS로만 도는 부트 스플래시와 React 트리(히어로 인트로 등)를 잇기 위함이다.
 * 역할: 스플래시 dismiss 시그널을 React 쪽에 보장하는 브리지다. 아무것도 렌더링하지 않는다.
 * 책임: 스킵 경로(세션 재방문·동작 줄이기)와 hydration보다 커튼이 먼저 걷힌 경우에
 *       SPLASH_DISMISS_EVENT를 즉시 발행한다. 재생 중이면 head 스크립트가 퇴장 시작 순간에 발행한다.
 *       시각·타이밍·스크롤 잠금은 splashBoot(CSS·head 스크립트)가 소유하므로 framer-motion을 쓰지 않는다.
 *       이벤트 이름은 splash/events에서 가져온다 — 스플래시 상수(문구·타이밍·DOM 훅)는 클라이언트 번들에 싣지 않는다.
 */
"use client";

import { useEffect } from "react";

import { SPLASH_DISMISS_EVENT } from "./events";

const SplashScreen = () => {
  useEffect(() => {
    const root = document.documentElement;
    const { splash, splashDone } = root.dataset;

    // 재생 중 — head 스크립트가 커튼이 걷히기 시작하는 순간 직접 발행하고 스크롤 잠금을 푼다.
    if (splash === "play" && splashDone !== "1") return;

    // 스킵 경로, hydration 전에 이미 걷힘, head 스크립트가 돌지 못함(차단·오류):
    // 늦게 마운트된 구독자도 같은 계약(data-splash-done + 이벤트 1회)을 보게 한다.
    // head 스크립트가 없으면 잠금도 걸리지 않았고 CSS 연출은 스스로 끝난다.
    root.dataset.splashDone = "1";
    window.dispatchEvent(new Event(SPLASH_DISMISS_EVENT));
  }, []);

  return null;
};

export default SplashScreen;

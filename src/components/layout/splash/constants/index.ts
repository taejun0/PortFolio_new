/**
 * 생성 이유: 스플래시 문구·타이밍·dismiss 시그널을 JSX에서 분리한다.
 * 역할: SplashScreen·히어로 진입 연동 상수다.
 * 책임: 브랜드명·조립/폭파 타이밍·dismiss 이벤트 이름만 관리한다.
 */
export const SPLASH_DISMISS_EVENT = "portfolio:splash-dismiss";

export const SPLASH_UI = {
  name: "OHTAEJUN",
  /** 글자가 모인 뒤 바로 폭파될 수 있게 */
  minMs: 650,
  failSafeMs: 1800,
  enterStagger: 0.03,
  enterDuration: 0.42,
  shatterMs: 420,
} as const;

/** 인덱스별 폭파 방향 — 한 번에 사방으로 흩어지게 */
export const SPLASH_BURST = [
  { x: -320, y: -180, rotate: -110, scale: 0.25 },
  { x: -140, y: -290, rotate: 85, scale: 0.2 },
  { x: 40, y: -310, rotate: -70, scale: 0.28 },
  { x: 260, y: -200, rotate: 125, scale: 0.22 },
  { x: -300, y: 120, rotate: 95, scale: 0.3 },
  { x: -60, y: 280, rotate: -140, scale: 0.18 },
  { x: 180, y: 250, rotate: 160, scale: 0.24 },
  { x: 340, y: 90, rotate: -100, scale: 0.26 },
] as const;

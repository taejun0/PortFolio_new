/**
 * 생성 이유: 스플래시 문구·타이밍·세션 키·DOM 훅을 마크업·부트 스크립트에서 분리한다.
 * 역할: 부트 스플래시(정적 HTML·CSS·head 스크립트, 모두 서버에서 쓰임)가 공유하는 상수다.
 * 책임: 브랜드명·스윕 타이밍·세션 키·DOM 훅 이름만 관리한다.
 *       dismiss 이벤트 이름은 ../events가 소유한다(클라이언트 코드는 그쪽에서 직접 가져와 이 파일이
 *       공용 청크에 실리지 않게 한다). 여기서는 서버 쪽 편의를 위해 다시 내보내기만 한다.
 */
export { SPLASH_DISMISS_EVENT } from "../events";

export const SPLASH_UI = {
  name: "OHTAEJUN",
} as const;

/**
 * 첫 방문 연출 타이밍(ms). 등장 와이프 → 짧은 정지 → 옆으로 걷히는 커튼, 합계 1.04s.
 * 곡선은 cubic-bezier(0.16, 1, 0.3, 1)라 앞 1/3에서 대부분 움직이고 나머지는 안착 꼬리다
 * (등장 꼬리가 곧 짧은 정지다).
 */
export const SPLASH_TIMING = {
  enterMs: 560,
  exitDelayMs: 560,
  exitMs: 480,
  /** 애니메이션 이벤트가 끝내 오지 않을 때(애니메이션 차단 등) 스플래시를 강제로 치우는 시점 */
  failSafeMs: 4000,
} as const;

/** 세션당 한 번만 재생 — 같은 탭의 새로고침·재방문은 첫 페인트 전에 스킵을 결정한다. */
export const SPLASH_SESSION_KEY = "portfolio-splash-seen";

/** 부트 CSS·head 스크립트·SplashScreen이 함께 쓰는 DOM 훅 */
export const SPLASH_DOM = {
  rootId: "boot-splash",
  markClass: "boot-splash__mark",
  wordClass: "boot-splash__word",
  enterAnimation: "boot-splash-enter",
  exitAnimation: "boot-splash-exit",
} as const;

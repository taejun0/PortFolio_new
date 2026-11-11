/**
 * 생성 이유: 스플래시 문구·타이밍·DOM 훅을 마크업·부트 스크립트에서 분리한다.
 * 역할: 부트 스플래시(정적 HTML·CSS·head 스크립트, 모두 서버에서 쓰임)가 공유하는 상수다.
 * 책임: 브랜드명·최소 표시 시간·스윕 타이밍·DOM 훅 이름만 관리한다.
 *       dismiss 이벤트 이름은 ../events가 소유한다(클라이언트 코드는 그쪽에서 직접 가져와 이 파일이
 *       공용 청크에 실리지 않게 한다). 여기서는 서버 쪽 편의를 위해 다시 내보내기만 한다.
 */
export { SPLASH_DISMISS_EVENT } from "../events";

export const SPLASH_UI = {
  name: "OHTAEJUN",
  loadingLabel: "페이지 로딩 중",
} as const;

/**
 * 문서 첫 진입 타이밍(ms). 최소 2초 표시하고, 첫 화면 준비가 끝나면 커튼을 걷는다.
 * 곡선은 cubic-bezier(0.16, 1, 0.3, 1)라 앞 1/3에서 대부분 움직이고 나머지는 안착 꼬리다
 * (등장 꼬리가 곧 짧은 정지다).
 */
export const SPLASH_TIMING = {
  enterMs: 560,
  minVisibleMs: 2000,
  exitMs: 480,
  /** JS·리소스 로드 오류로 준비 신호가 오지 않아도 페이지를 영구히 가두지 않는다. */
  failSafeMs: 20000,
} as const;

/** 부트 CSS·head 스크립트·SplashScreen이 함께 쓰는 DOM 훅 */
export const SPLASH_DOM = {
  rootId: "boot-splash",
  markClass: "boot-splash__mark",
  wordClass: "boot-splash__word",
  enterAnimation: "boot-splash-enter",
  exitAnimation: "boot-splash-exit",
} as const;

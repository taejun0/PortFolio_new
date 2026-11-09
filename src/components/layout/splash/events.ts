/**
 * 생성 이유: 공용 모션 청크(revealController)가 스플래시 dismiss 신호 이름만 가져가게 하기 위함이다.
 *           splash/constants를 통째로 import하면 스플래시 문구·타이밍·세션 키·DOM 훅까지 클라이언트 공용 청크에 실린다.
 * 역할: 스플래시와 React 트리(리빌 컨트롤러·SplashScreen)가 공유하는 window 이벤트 이름이다.
 * 책임: dismiss 이벤트 이름 한 가지만 소유한다. 의미(언제 발행되는지)는 아래 주석이 계약이다.
 */

/**
 * 스플래시가 걷히기 시작할 때(퇴장 커튼 시작, 또는 스킵 경로 즉시) window에 한 번 발행된다.
 * 같은 순간 html[data-splash-done="1"]이 붙는다 — 히어로 인트로 스윕과 첫 화면 커튼이 이 신호로 시작한다.
 */
export const SPLASH_DISMISS_EVENT = "portfolio:splash-dismiss";

/**
 * 생성 이유: 스플래시 문구를 JSX에서 분리한다.
 * 역할: SplashScreen 카피·타이밍 상수다.
 * 책임: 브랜드명·부제·최소/최대 노출 시간만 관리한다.
 */
export const SPLASH_UI = {
  name: "Taejun0",
  sub: "Portfolio",
  minMs: 1200,
  failSafeMs: 3200,
} as const;

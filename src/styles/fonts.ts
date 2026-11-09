/**
 * 생성 이유: 로컬 Pretendard를 앱 전역 서체로 제공한다.
 * 역할: 지원할 폰트 굵기와 전역 CSS 변수 이름을 선언한다.
 * 책임: Pretendard 경로·굵기 매핑만 관리한다.
 */
import localFont from "next/font/local";

/*
 * 두 굵기 모두 preload(기본값)를 유지한다 — 측정으로 고른 값이다.
 * preload를 끄면 @font-face로 발견된 폰트가 최우선 순위가 되어 첫 페인트 경로로 계산되고
 * (Lighthouse 모바일 FCP 0.8s→1.7s), LCP는 그대로였다. display swap과 기본 Arial 대체 메트릭
 * (adjustFontFallback)은 폰트가 늦어도 글자가 바로 보이고 덜 흔들리게 한다.
 */
export const pretendard = localFont({
  src: [
    {
      path: "../fonts/Pretendard-Regular.subset.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Pretendard-Bold.subset.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-pretendard",
});

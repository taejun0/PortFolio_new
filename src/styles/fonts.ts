/**
 * 생성 이유: 로컬 Pretendard 폰트를 Next.js 최적화 파이프라인으로 제공한다.
 * 역할: 지원할 폰트 굵기와 전역 CSS 변수 이름을 선언한다.
 * 책임: 사용자가 제공한 Pretendard 파일 경로·굵기 매핑·로딩 전략만 관리한다.
 */
import localFont from "next/font/local";

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
  display: "fallback",
  variable: "--font-pretendard",
});

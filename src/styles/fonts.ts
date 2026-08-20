/**
 * 생성 이유: 로컬 Pretendard를 앱 전역 서체로 제공한다.
 * 역할: 지원할 폰트 굵기와 전역 CSS 변수 이름을 선언한다.
 * 책임: Pretendard 경로·굵기 매핑만 관리한다.
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
  display: "swap",
  variable: "--font-pretendard",
});

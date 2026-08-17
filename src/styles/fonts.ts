/**
 * 생성 이유: 로컬 Pretendard와 명함 슬로건용 손글씨 폰트를 제공한다.
 * 역할: 지원할 폰트 굵기와 전역 CSS 변수 이름을 선언한다.
 * 책임: Pretendard 경로·굵기 매핑과 슬로건용 Nanum Pen Script 로딩만 관리한다.
 */
import localFont from "next/font/local";
import { Nanum_Pen_Script } from "next/font/google";

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

export const nanumPen = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-nanum-pen",
});

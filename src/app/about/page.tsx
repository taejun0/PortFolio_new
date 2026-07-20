/**
 * 생성 이유: /about 경로를 About feature에 연결한다.
 * 역할: 자기소개 상세 라우트 진입점이다.
 * 책임: 메타데이터 정의와 AboutPage 렌더링만 담당한다.
 */
import type { Metadata } from "next";

import AboutPage from "@/features/about/AboutPage";

export const metadata: Metadata = {
  title: "About",
};

export default function Page() {
  return <AboutPage />;
}

/**
 * 생성 이유: 공통 레이아웃을 라우트마다 중복하지 않기 위함이다.
 * 역할: 사이트 공통 셸을 제공한다.
 * 책임: Header·페이지 전환·main·Footer를 모든 라우트에 조합한다.
 *       main은 헤더 본문 바로가기의 대상이다(id + tabIndex -1 — 링크를 따라가면 포커스가 본문으로 옮겨 오고,
 *       다음 Tab이 본문 첫 링크다. 포커스 링은 GlobalStyle이 감춘다).
 */
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isStudyRoomPath } from "@/features/study-room/config";

import Header from "@/components/layout/header/Header";
import { MAIN_CONTENT_ID } from "@/components/layout/header/constants";
import Footer from "@/components/layout/footer/Footer";
import PageTransition from "@/components/layout/pageTransition/PageTransition";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Experimental room routes own their shell; all existing routes keep this layout.
  if (isStudyRoomPath(pathname)) return <>{children}</>;

  return (
    <>
      <Header />
      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}

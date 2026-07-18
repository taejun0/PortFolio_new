/**
 * 생성 이유: 공통 레이아웃을 라우트마다 중복하지 않기 위함이다.
 * 역할: 사이트 공통 셸을 제공한다.
 * 책임: Header·페이지 전환·main·Footer를 모든 라우트에 조합한다.
 */
"use client";

import type { ReactNode } from "react";

import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import PageTransition from "@/components/layout/pageTransition/PageTransition";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}

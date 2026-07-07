/**
 * 생성 이유: 공통 레이아웃을 라우트마다 중복하지 않기 위함이다.
 * 역할: 사이트 공통 셸을 제공한다.
 * 책임: 상단 Header와 children 영역을 모든 라우트에 조합한다.
 */
"use client";

import type { ReactNode } from "react";

import Header from "@/components/layout/header/Header";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}

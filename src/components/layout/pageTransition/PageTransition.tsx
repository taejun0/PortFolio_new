/**
 * 생성 이유: 라우트 전환 시 본문이 끊기지 않고 이어지게 한다.
 * 역할: pathname 기준 가벼운 진입 페이드다.
 * 책임: 경로 변경 시 스크롤 리셋과 exit 없는 짧은 fade-in만 소유한다.
 *       (exit opacity 0은 네비 전환 시 깜빡임 원인이라 쓰지 않는다.)
 */
"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} style={{ minHeight: "100%" }}>
      {children}
    </div>
  );
};

export default PageTransition;

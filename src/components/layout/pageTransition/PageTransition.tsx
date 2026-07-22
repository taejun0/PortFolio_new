/**
 * 생성 이유: 라우트 전환 시 본문이 끊기지 않고 이어지게 한다.
 * 역할: pathname 기준 가벼운 진입 페이드다.
 * 책임: 경로 변경 시 스크롤 리셋과 exit 없는 짧은 fade-in만 소유한다.
 *       (exit opacity 0은 네비 전환 시 깜빡임 원인이라 쓰지 않는다.)
 */
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";

const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (reduceMotion) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0.92 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

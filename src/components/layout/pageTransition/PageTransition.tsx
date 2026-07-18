/**
 * 생성 이유: 라우트 전환 시 본문이 끊기지 않고 이어지게 한다.
 * 역할: pathname 기준 페이드 페이지 트랜지션이다.
 * 책임: 경로 변경 시 스크롤 리셋과 짧은 페이드만 소유한다.
 */
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";

import { useTheme } from "@emotion/react";

const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const theme = useTheme();
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (reduceMotion) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: theme.motion.duration.ui,
          ease: theme.motion.ease.out,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;

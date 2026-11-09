/**
 * 생성 이유: 테마 모드를 읽기만 하는 화면(블로그 댓글 등)이 Provider 구현(Emotion ThemeProvider·
 *           flushSync·뷰 전환 코드)까지 자기 라우트 번들에 끌고 가지 않게 하기 위함이다.
 * 역할: 테마 모드 Context 객체·값 타입과 useThemeMode 훅만 담은 가벼운 모듈이다.
 * 책임: react와 ThemeMode 타입 외에는 아무것도 가져오지 않는다. 값은 ThemeModeProvider가 채우고,
 *       mode를 알아야 하는 클라이언트 컴포넌트는 이 모듈에서 훅을 가져온다.
 */
"use client";

import { createContext, useContext } from "react";

import type { ThemeMode } from "@/styles/theme";

/** 원형 리빌 전환이 퍼져 나갈 기준점(뷰포트 px) — 보통 토글 버튼의 클릭 좌표다. */
export type ThemeTransitionOrigin = {
  x: number;
  y: number;
};

export type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleMode: (origin?: ThemeTransitionOrigin) => void;
  setMode: (mode: ThemeMode) => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue | null>(
  null
);

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return ctx;
};

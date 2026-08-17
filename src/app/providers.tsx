/**
 * 생성 이유: 클라이언트 전용 전역 Provider를 서버 레이아웃과 분리한다.
 * 역할: Emotion 캐시, 테마 모드, 전역 스타일, 스플래시를 하나의 경계에서 조합한다.
 * 책임: 스플래시 동안 본문을 가리고, 준비 완료 후 공개하도록 보장한다.
 */
"use client";

import type { ReactNode } from "react";

import EmotionRegistry from "@/lib/EmotionRegistry";
import ThemeBootScript from "@/components/theme/ThemeBootScript";
import { ThemeModeProvider } from "@/components/theme/ThemeModeProvider";
import GlobalStyle from "@/styles/GlobalStyle";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionRegistry>
      <ThemeBootScript />
      <ThemeModeProvider>
        <GlobalStyle />
        {children}
      </ThemeModeProvider>
    </EmotionRegistry>
  );
}

/**
 * 생성 이유: 클라이언트 전용 전역 Provider를 서버 레이아웃과 분리한다.
 * 역할: Emotion 캐시, 테마, 전역 스타일을 하나의 경계에서 조합한다.
 * 책임: 하위 컴포넌트가 동일한 스타일링 환경을 사용하도록 보장한다.
 */
"use client";

import { ThemeProvider } from "@emotion/react";
import type { ReactNode } from "react";

import EmotionRegistry from "@/lib/EmotionRegistry";
import GlobalStyle from "@/styles/GlobalStyle";
import { theme } from "@/styles/theme";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </EmotionRegistry>
  );
}

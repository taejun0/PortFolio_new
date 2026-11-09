/**
 * 생성 이유: 클라이언트 전용 전역 Provider를 서버 레이아웃과 분리한다.
 * 역할: Emotion 캐시, head 부트 태그(ThemeBootScript), 테마 모드, 전역 스타일, 스플래시 브리지를 하나의 경계에서 조합한다.
 * 책임: 본문은 SSR 그대로 즉시 상호작용 가능하게 둔다(no-JS 방문자도 막히지 않음).
 *       스플래시가 덮는 동안의 포인터 차단·스크롤 잠금은 부트 스플래시(CSS)가 맡는다.
 */
"use client";

import type { ReactNode } from "react";

import EmotionRegistry from "@/lib/EmotionRegistry";
import SplashScreen from "@/components/layout/splash/SplashScreen";
import ThemeBootScript from "@/components/theme/ThemeBootScript";
import { ThemeModeProvider } from "@/components/theme/ThemeModeProvider";
import GlobalStyle from "@/styles/GlobalStyle";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <EmotionRegistry>
      <ThemeBootScript />
      <ThemeModeProvider>
        <GlobalStyle />
        <SplashScreen />
        <div style={{ minHeight: "100%" }}>{children}</div>
      </ThemeModeProvider>
    </EmotionRegistry>
  );
}

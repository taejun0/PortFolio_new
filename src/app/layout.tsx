/**
 * 생성 이유: 애플리케이션 전체에 공통 HTML 구조와 전역 환경을 제공한다.
 * 역할: App Router의 최상위 레이아웃으로 메타데이터, 폰트, Provider, 사이트 셸, 부트 스플래시를 연결한다.
 * 책임: 모든 페이지를 동일한 문서 구조와 전역 설정 안에서 렌더링한다.
 *       서버 HTML은 테마 모드와 무관하다 — 색은 html[data-theme]별 팔레트 변수(THEME_BOOT_CSS)가 정하고,
 *       data-theme은 head의 테마 부트 스크립트가 첫 페인트 전에 저장된 모드로 맞춘다.
 *       첫 페인트 전에 필요한 부트 태그(팔레트·스플래시 CSS, 스플래시 재생/스킵·테마 스크립트)는 여기서 렌더하지 않고
 *       ThemeBootScript가 SSR 스트림 head에 한 번만 끼워 넣는다 — 서버 레이아웃이 렌더하면 같은 문자열이
 *       RSC 페이로드(self.__next_f)에 한 벌 더 실린다.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import Providers from "./providers";
import SiteShell from "@/components/layout/SiteShell";
import BootSplash from "@/components/layout/splash/BootSplash";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { pretendard } from "@/styles/fonts";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={pretendard.variable}
      data-theme="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body>
        <BootSplash />
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}

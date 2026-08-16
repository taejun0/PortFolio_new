/**
 * 생성 이유: 애플리케이션 전체에 공통 HTML 구조와 전역 환경을 제공한다.
 * 역할: App Router의 최상위 레이아웃으로 메타데이터, 폰트, Provider, 사이트 셸을 연결한다.
 * 책임: 모든 페이지를 동일한 문서 구조와 전역 설정 안에서 렌더링한다.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";

import Providers from "./providers";
import SiteShell from "@/components/layout/SiteShell";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { pretendard, nanumPen } from "@/styles/fonts";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
};

/**
 * React/Emotion은 SSR에서 dark로 그려질 수 있다.
 * 스플래시·body는 --canvas-* 만 보고, cookie/boot 스크립트가 맞춘 data-theme을 따른다.
 */
const themeBootCss = `
html{
  --canvas-bg:#000000;
  --canvas-fg:#ffffff;
  background-color:var(--canvas-bg);
  color-scheme:dark;
}
html[data-theme="light"]{
  --canvas-bg:#f3f3f4;
  --canvas-fg:#0c0c0c;
  background-color:var(--canvas-bg);
  color-scheme:light;
}
html[data-theme="dark"]{
  --canvas-bg:#000000;
  --canvas-fg:#ffffff;
  background-color:var(--canvas-bg);
  color-scheme:dark;
}
html,body{min-height:100%}
body{
  margin:0;
  background-color:var(--canvas-bg);
  color:var(--canvas-fg);
}
html:not([data-theme-ready="1"]) body{transition:none!important}
`;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${nanumPen.variable}`}
      data-theme="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <style
          id="theme-boot-css"
          dangerouslySetInnerHTML={{ __html: themeBootCss }}
        />
      </head>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}

/**
 * 생성 이유: 애플리케이션 전체에 공통 HTML 구조와 전역 환경을 제공한다.
 * 역할: App Router의 최상위 레이아웃으로 메타데이터, 폰트, Provider, 사이트 셸을 연결한다.
 * 책임: 모든 페이지를 동일한 문서 구조와 전역 설정 안에서 렌더링한다.
 */
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import Providers from "./providers";
import SiteShell from "@/components/layout/SiteShell";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { pretendard } from "@/styles/fonts";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
};

const themeBootScript = `
(function(){
  try {
    var m = localStorage.getItem('portfolio-theme-mode');
    if (m !== 'light' && m !== 'dark') m = 'dark';
    document.documentElement.dataset.theme = m;
    document.documentElement.style.colorScheme = m;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
  }
})();
`;

/** React/Emotion hydrate 전에 캔버스 색을 맞춰 라이트 모드 검정 플래시를 막는다. */
const themeBootCss = `
html{background-color:#000000;color-scheme:dark}
html[data-theme="light"]{background-color:#f3f3f4;color-scheme:light}
html,body{min-height:100%}
body{margin:0;background-color:inherit}
html[data-theme="dark"] body{background-color:#000000;color:#ffffff}
html[data-theme="light"] body{background-color:#f3f3f4;color:#0c0c0c}
html:not([data-theme-ready="1"]) body{transition:none!important}
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <head>
        <style
          id="theme-boot-css"
          dangerouslySetInnerHTML={{ __html: themeBootCss }}
        />
      </head>
      <body>
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}

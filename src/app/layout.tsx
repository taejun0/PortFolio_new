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
import { pretendard } from "@/styles/fonts";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}

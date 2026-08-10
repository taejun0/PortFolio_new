/**
 * 생성 이유: React 19는 컴포넌트 트리 안의 script 렌더를 경고한다.
 * 역할: 테마 FOUC 방지 스크립트를 SSR 스트림에만 주입하는 부트스트랩이다.
 * 책임: useServerInsertedHTML로 theme-boot 스크립트를 넣고, 클라이언트 트리에는 렌더하지 않는다.
 */
"use client";

import { useServerInsertedHTML } from "next/navigation";

import { THEME_BOOT_SCRIPT } from "./themeBoot";

const ThemeBootScript = () => {
  useServerInsertedHTML(() => (
    <script
      id="theme-boot"
      dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
    />
  ));

  return null;
};

export default ThemeBootScript;

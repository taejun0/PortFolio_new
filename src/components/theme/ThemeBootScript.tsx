/**
 * 생성 이유: React 19는 컴포넌트 트리 안의 script 렌더를 경고하고, 서버 레이아웃이 직접 렌더한 부트 문자열은
 *           RSC 페이로드(self.__next_f)에 한 번 더 실린다.
 * 역할: 첫 페인트 전에 필요한 부트 태그(팔레트·스플래시 CSS, 스플래시 재생/스킵 스크립트, 테마·모션 스크립트)를
 *       SSR 스트림 head에만 주입하는 부트스트랩이다.
 * 책임: useServerInsertedHTML로 style#theme-boot-css → script#splash-boot → script#theme-boot 순서의 태그를
 *       요청당 한 번(첫 플러시 = head, body·#boot-splash보다 앞)만 넣고, 클라이언트 트리에는 렌더하지 않는다.
 *       (스트림 청크마다 넣으면 같은 스크립트가 body 끝에 여러 번 붙는다.)
 *       - RSC 페이로드에는 실리지 않는다(서버 컴포넌트 출력이 아니라 서버가 HTML에 직접 끼워 넣는 태그다).
 *       - 브라우저 번들에도 싣지 않는다: 부트 문자열 모듈은 서버에서만 남는 typeof window 분기 안에서 가져온다.
 *       - head 태그는 React가 관리하지 않으므로 클라이언트 이동·hydration에서 다시 그리거나 지우지 않는다.
 */
"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

type BootMarkup = {
  css: string;
  splashScript: string;
  themeScript: string;
};

/**
 * 부트 문자열(수 KB)은 서버 HTML에만 필요하다. 정적 import로 가져오면 "use client" 모듈이라 레이아웃 JS 청크에
 * 그대로 실리므로, Next 컴파일러가 브라우저 번들에서 typeof window를 "object"로 바꿔 지우는 분기 안에서만 읽는다
 * (분기와 함께 require 대상 모듈도 브라우저 번들에서 빠진다). 서버(SSR)에서는 항상 이 분기를 탄다.
 */
const readBootMarkup = (): BootMarkup | null => {
  if (typeof window === "undefined") {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const themeBoot = require("./themeBoot") as typeof import("./themeBoot");
    const splashBoot =
      require("@/components/layout/splash/splashBoot") as typeof import("@/components/layout/splash/splashBoot");
    /* eslint-enable @typescript-eslint/no-require-imports */
    return {
      css: themeBoot.THEME_BOOT_CSS + splashBoot.SPLASH_BOOT_CSS,
      splashScript: splashBoot.SPLASH_BOOT_SCRIPT,
      themeScript: themeBoot.THEME_BOOT_SCRIPT,
    };
  }
  return null;
};

const ThemeBootScript = () => {
  const insertedRef = useRef(false);

  useServerInsertedHTML(() => {
    if (insertedRef.current) return null;
    const boot = readBootMarkup();
    if (!boot) return null;
    insertedRef.current = true;
    return (
      <>
        <style
          id="theme-boot-css"
          dangerouslySetInnerHTML={{ __html: boot.css }}
        />
        <script
          id="splash-boot"
          dangerouslySetInnerHTML={{ __html: boot.splashScript }}
        />
        <script
          id="theme-boot"
          dangerouslySetInnerHTML={{ __html: boot.themeScript }}
        />
      </>
    );
  });

  return null;
};

export default ThemeBootScript;

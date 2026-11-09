/**
 * 생성 이유: 테마 부트 CSS·스크립트·키를 layout/Provider가 공유하게 한다.
 * 역할: 테마 모드 저장 키, 팔레트 CSS 변수 부트 CSS, FOUC 방지 인라인 스크립트 상수다.
 * 책임: 페인트 전에 색 변수와 html 속성을 맞추는 부트 문자열과 테마 속성 계약만 소유한다.
 *       - THEME_BOOT_CSS: 루트 레이아웃 head <style>에 들어간다. html[data-theme]별 --color-* 팔레트 변수 —
 *         Emotion 테마의 색(var(--color-*))이 이 값을 따르므로 첫 페인트부터 저장된 모드로 칠해진다.
 *       - data-theme·colorScheme: 부트 스크립트가 localStorage와 동기화한다(이후 토글은 ThemeModeProvider).
 *       - data-motion="armed": JS가 켜져 있고 동작 줄이기가 아니면 켠다. 커튼 리빌이 첫 페인트부터
 *         내용을 덮게 하는 신호다(JS가 없으면 이 속성이 없어 아무것도 가려지지 않는다).
 *         이후 revealController가 "live"로 넘겨받는다.
 */
import {
  MOTION_ARMED,
  MOTION_ATTR,
} from "@/components/common/motion/constants";
import { LIGHT_MODE, THEME_ATTR, paletteCssVars } from "@/styles/theme";

export const THEME_STORAGE_KEY = "portfolio-theme-mode";

/**
 * 팔레트 변수 — 기본(속성 없음·JS 없음)은 다크, html[data-theme="light"]면 라이트.
 * --canvas-bg·--canvas-fg는 예전 이름을 쓰는 스타일을 위한 별칭이다(같은 값을 가리킨다).
 * hydration 전에는 body 색 전환을 끈다 — 부트 스크립트가 data-theme-ready를 붙인 뒤부터 전환이 돈다.
 */
export const THEME_BOOT_CSS = [
  `:root{${paletteCssVars("dark")}--canvas-bg:var(--color-background);--canvas-fg:var(--color-text);color-scheme:dark;background-color:var(--color-background)}`,
  `${LIGHT_MODE}{${paletteCssVars("light")}color-scheme:light}`,
  `html,body{min-height:100%}`,
  `body{margin:0;background-color:var(--color-background);color:var(--color-text)}`,
  `html:not([data-theme-ready="1"]) body{transition:none!important}`,
].join("");

/** SSR 스트림 head에 주입되어 paint 전에 data-theme·data-motion을 맞춘다. */
export const THEME_BOOT_SCRIPT = `(function(){
  var d = document.documentElement;
  try {
    var k = '${THEME_STORAGE_KEY}';
    var m = localStorage.getItem(k);
    if (m !== 'light' && m !== 'dark') {
      m = d.getAttribute('${THEME_ATTR}');
    }
    if (m !== 'light' && m !== 'dark') m = 'dark';
    d.setAttribute('${THEME_ATTR}', m);
    d.dataset.themeReady = '1';
    d.style.colorScheme = m;
  } catch (e) {
    d.setAttribute('${THEME_ATTR}', 'dark');
    d.dataset.themeReady = '1';
    d.style.colorScheme = 'dark';
  }
  try {
    if ('IntersectionObserver' in window &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.setAttribute('${MOTION_ATTR}', '${MOTION_ARMED}');
    }
  } catch (e) {}
})();`;

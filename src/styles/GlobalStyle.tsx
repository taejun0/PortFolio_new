/**
 * 생성 이유: 브라우저 기본 스타일 차이를 줄이고 전역 기반 스타일을 일관되게 적용한다.
 * 역할: Emotion Global을 통해 리셋·캔버스·타이포·한글 줄바꿈·키보드 포커스·모션 리빌 기반을 주입한다.
 * 책임: 페이지별 구성을 침범하지 않는 전역 분위기(배경·잉크·선택 색·포커스 링)와 문서 단위 계약
 *       (고정 헤더 높이의 scroll-padding-top, 사용자 기본 글자 크기를 따르는 rem 기준, 인쇄용 라이트 팔레트)만 관리한다.
 *       overflow-x는 sticky pin을 깨뜨리지 않도록 html/body에 두지 않는다.
 *       포커스 링은 specificity 0이라 컴포넌트의 :focus-visible 스타일이 항상 이긴다.
 *       전역 스타일은 정적이다(테마 함수 없음). 색은 theme.colors의 CSS 변수(var(--color-*))라
 *       html[data-theme]를 따라 hydration 전에도, 토글 직후에도 현재 모드 값이고, 전환 때 전역 시트를 다시 만들지 않는다.
 */
"use client";

import { Global, css } from "@emotion/react";

import { motionGlobalStyles } from "@/components/common/motion/motionGlobalStyles";
import { paletteCssVars, theme } from "@/styles/theme";

const { colors, fonts, typography, motion, layout } = theme;

const globalStyles = css`
  /* 포커스 링 — 컴포넌트 스타일(MarqueeSection 등)도 이 변수를 쓴다. */
  :root {
    --focus-ring: ${colors.accent};
  }

  @keyframes theme-reveal {
    from {
      clip-path: circle(
        0px at var(--theme-transition-x) var(--theme-transition-y)
      );
    }
    to {
      clip-path: circle(
        var(--theme-transition-radius) at var(--theme-transition-x)
          var(--theme-transition-y)
      );
    }
  }

  html[data-theme-transition="active"] *,
  html[data-theme-transition="active"] *::before,
  html[data-theme-transition="active"] *::after {
    transition: none !important;
  }

  html[data-theme-transition="active"]::view-transition-group(root) {
    animation-duration: 0.72s;
    animation-timing-function: ${motion.curve.out};
  }

  html[data-theme-transition="active"]::view-transition-old(root),
  html[data-theme-transition="active"]::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
    width: 100%;
    height: 100%;
  }

  html[data-theme-transition="active"]::view-transition-old(root) {
    z-index: 1;
  }

  html[data-theme-transition="active"]::view-transition-new(root) {
    z-index: 2;
    animation: theme-reveal 0.72s ${motion.curve.out} both;
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    width: 100%;
    max-width: 100%;
    /*
     * 가로 뷰포트에 따라 rem 기준이 함께 스케일한다. 퍼센트(브라우저 기본 글자 크기 기준)라 사용자가 기본 크기를
     * 키우면 함께 커진다(WCAG 1.4.4) — 기본 16px에서는 14px·0.28vw + 13.1px·17px과 같다.
     */
    font-size: clamp(87.5%, 0.28vw + 81.875%, 106.25%);
    scroll-behavior: auto;
    /*
     * 고정 헤더 높이만큼 스크롤 기준선을 내린다 — 키보드 포커스 이동·#해시 이동·목차 링크가
     * 대상을 헤더 아래(헤더 바로 밑)에 멈추게 한다(WCAG 2.4.11). 섹션별 scroll-margin-top은 두지 않는다.
     */
    scroll-padding-top: ${layout.headerHeight};
  }

  /*
   * 동작 줄이기: 길이와 함께 지연도 0으로 둔다 — 지연이 남으면 backwards 채움 애니메이션이 지연 동안
   * 내용을 가린 채 멈춰 있고, 지연된 visibility 전환은 상태 사이에 빈 프레임을 남긴다.
   * transition-property는 그대로 둬 transitionend에 기대는 코드가 끊기지 않는다.
   */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-delay: 0s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      transition-delay: 0s !important;
    }
  }

  body {
    width: 100%;
    max-width: 100%;
    font-family: ${fonts.body};
    font-size: ${typography.body.fontSize};
    line-height: ${typography.body.lineHeight};
    color: ${colors.text};
    background-color: ${colors.background};
    /* 한글은 어절 단위로만 줄바꿈하고, 긴 URL·이메일은 넘칠 때만 끊어 320px에서도 넘치지 않게 한다 */
    word-break: keep-all;
    overflow-wrap: break-word;
    -webkit-font-smoothing: antialiased;
    text-rendering: auto;
    transition:
      background-color ${motion.duration.ui}s ease,
      color ${motion.duration.ui}s ease;
  }

  /* 선택 색 — 글자색과 같은 팔레트 변수를 따라 섹션 글자와 늘 같은 모드다. */
  ::selection {
    background: color-mix(in srgb, ${colors.accent} 28%, transparent);
    color: ${colors.text};
  }

  /* 키보드 포커스 기본 링. :where()로 감싸 specificity 0 — 컴포넌트 스타일이 우선한다. */
  :where(
      a,
      button,
      input,
      textarea,
      select,
      summary,
      [tabindex]:not([tabindex="-1"])
    ):where(:focus-visible) {
    outline: 2px solid var(--focus-ring);
    outline-offset: 3px;
  }

  /* 본문 바로가기(#main, tabindex -1)로 옮겨 온 포커스 — 영역 전체를 감싸는 링은 그리지 않는다. */
  main:focus {
    outline: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font: inherit;
    border: none;
    background: none;
    cursor: pointer;
  }

  ul,
  ol {
    list-style: none;
  }

  img {
    display: block;
    max-width: 100%;
  }

  /*
   * 인쇄는 화면 모드와 상관없이 라이트 팔레트 — 다크 방문자가 검은 종이를 뽑지 않게 한다.
   * :root:root는 부트 CSS의 :root·html[data-theme] 팔레트보다 구체성이 높다. color-scheme은 부트 스크립트가
   * html 인라인 스타일로 넣으므로 !important로만 덮을 수 있다.
   */
  @media print {
    :root:root {
      ${paletteCssVars("light")}
      color-scheme: light !important;
    }
  }
`;

const GlobalStyle = () => (
  <>
    <Global styles={globalStyles} />
    <Global styles={motionGlobalStyles} />
  </>
);

export default GlobalStyle;

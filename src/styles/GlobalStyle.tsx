/**
 * 생성 이유: 브라우저 기본 스타일 차이를 줄이고 전역 기반 스타일을 일관되게 적용한다.
 * 역할: Emotion Global을 통해 리셋·캔버스·타이포 기반을 주입한다.
 * 책임: 페이지별 구성을 침범하지 않는 전역 분위기(배경·잉크·선택 색)만 관리한다.
 *       overflow-x는 sticky pin을 깨뜨리지 않도록 html/body에 두지 않는다.
 */
"use client";

import { Global, css, type Theme } from "@emotion/react";

const globalStyles = (theme: Theme) => css`
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
    scroll-behavior: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  body {
    width: 100%;
    max-width: 100%;
    font-family: ${theme.fonts.body};
    font-size: ${theme.typography.body.fontSize};
    line-height: ${theme.typography.body.lineHeight};
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  ::selection {
    background: color-mix(in srgb, ${theme.colors.accent} 28%, transparent);
    color: ${theme.colors.text};
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
`;

const GlobalStyle = () => <Global styles={globalStyles} />;

export default GlobalStyle;

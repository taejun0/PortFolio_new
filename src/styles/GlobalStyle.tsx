/**
 * 생성 이유: 브라우저 기본 스타일 차이를 줄이고 전역 기반 스타일을 일관되게 적용한다.
 * 역할: Emotion Global을 통해 리셋과 기본 폰트 설정을 주입한다.
 * 책임: 페이지별 디자인을 침범하지 않는 최소한의 전역 스타일만 관리한다.
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
    scroll-behavior: smooth;
  }

  html,
  body {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }

  body {
    font-family: ${theme.fonts.body};
    -webkit-font-smoothing: antialiased;
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

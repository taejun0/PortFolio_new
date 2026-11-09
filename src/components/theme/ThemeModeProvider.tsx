/**
 * 생성 이유: 다크/라이트 전환 상태를 html 테마 속성과 동기화한다.
 * 역할: 테마 모드 Provider다(Emotion ThemeProvider도 여기서 주입한다).
 * 책임: html data-theme(팔레트 변수가 따르는 단일 출처)·localStorage 외부 상태와 토글(원형 리빌 전환)을 관리한다.
 *       Emotion 테마는 모드와 무관한 상수(색 = CSS 변수)라 전환해도 바뀌지 않는다 — 토글은 속성만 바꾸고
 *       스타일을 다시 만들지 않는다. mode 값은 Giscus처럼 JS가 모드를 알아야 하는 곳에만 쓴다
 *       (헤더 토글의 아이콘·이름은 CSS가 html[data-theme]로 고른다 — hydration 전에도 맞다).
 *       Context 객체·타입·useThemeMode는 themeModeContext로 나눴다 — 모드를 읽기만 하는 라우트(블로그 댓글)가
 *       이 파일(ThemeProvider·flushSync·뷰 전환)을 자기 번들에 복사하지 않게 한다. 기존 경로 호환으로 훅을 다시 내보낸다.
 *       부트 스크립트가 붙인 속성이 지워진 문서(오류 셸을 클라이언트가 새로 그린 경우)는 마운트 때 되살린다.
 */
"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { ThemeProvider } from "@emotion/react";

import { THEME_ATTR, themes, type ThemeMode } from "@/styles/theme";
import { THEME_STORAGE_KEY } from "./themeBoot";
import {
  ThemeModeContext,
  type ThemeModeContextValue,
  type ThemeTransitionOrigin,
} from "./themeModeContext";

export { useThemeMode } from "./themeModeContext";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => {
    finished: Promise<void>;
  };
};

const themeListeners = new Set<() => void>();

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === "light" || value === "dark";

/** 지금 칠해진 모드 — 부트 스크립트가 첫 페인트 전에 맞춘 html 속성을 읽는다. */
const readMode = (): ThemeMode =>
  document.documentElement.getAttribute(THEME_ATTR) === "light"
    ? "light"
    : "dark";

const getServerMode = (): ThemeMode => "dark";

/** 화면 색을 바꾸는 유일한 지점 — 팔레트 변수가 이 속성을 따른다. */
const applyMode = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.setAttribute(THEME_ATTR, mode);
  root.style.colorScheme = mode;
};

const subscribeToTheme = (listener: () => void) => {
  themeListeners.add(listener);

  // 다른 탭에서 바꾼 모드도 이 탭의 html 속성(=화면 색)에 반영한다.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY || !isThemeMode(event.newValue)) {
      return;
    }
    applyMode(event.newValue);
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const persistMode = (mode: ThemeMode) => {
  applyMode(mode);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* 브라우저 저장소가 차단돼도 현재 탭의 테마 전환은 유지한다. */
  }
  themeListeners.forEach((listener) => listener());
};

/**
 * 프리렌더되지 않은 동적 세그먼트의 404처럼 Next가 오류 셸(html#__next_error__)을 보내면 클라이언트가 문서를 새로 그리고,
 * React가 html 속성을 레이아웃 기본값(다크)으로 다시 쓴다 — 부트 스크립트가 맞춘 저장 모드와 data-theme-ready
 * (헤더 토글을 보이게 하는 신호)가 사라진다. 페인트 전에 둘을 되살린다. 보통의 hydration은 속성을 그대로 두므로 하는 일이 없다.
 */
const restoreBootAttributes = () => {
  const root = document.documentElement;
  if (root.dataset.themeReady === "1") return;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeMode(stored)) applyMode(stored);
  } catch {
    /* 저장소가 막혀 있으면 레이아웃 기본값(다크)을 그대로 쓴다. */
  }
  root.dataset.themeReady = "1";
  themeListeners.forEach((listener) => listener());
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const mode = useSyncExternalStore(subscribeToTheme, readMode, getServerMode);

  useLayoutEffect(restoreBootAttributes, []);

  const setMode = useCallback((next: ThemeMode) => {
    persistMode(next);
  }, []);

  const toggleMode = useCallback((origin?: ThemeTransitionOrigin) => {
    const nextMode = mode === "dark" ? "light" : "dark";
    const transitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      !origin ||
      !transitionDocument.startViewTransition ||
      prefersReducedMotion
    ) {
      setMode(nextMode);
      return;
    }

    const root = document.documentElement;
    const viewport = window.visualViewport;
    const width = Math.max(
      window.innerWidth,
      root.clientWidth,
      viewport?.width ?? 0
    );
    const height = Math.max(
      window.innerHeight,
      root.clientHeight,
      viewport?.height ?? 0
    );

    root.style.setProperty("--theme-transition-x", `${origin.x}px`);
    root.style.setProperty("--theme-transition-y", `${origin.y}px`);
    root.style.setProperty(
      "--theme-transition-radius",
      `${Math.hypot(
        Math.max(origin.x, width - origin.x),
        Math.max(origin.y, height - origin.y)
      )}px`
    );
    root.dataset.themeTransition = "active";

    // 새 화면(토글 아이콘·이름 포함)은 속성 변경으로 이미 칠해진다. flushSync는 mode 구독자(Giscus 테마 등)도
    // 새 스냅숏에 담기 위함이다.
    const transition = transitionDocument.startViewTransition(() => {
      flushSync(() => setMode(nextMode));
    });

    void transition.finished.finally(() => {
      delete root.dataset.themeTransition;
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
      root.style.removeProperty("--theme-transition-radius");
    });
  }, [mode, setMode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({ mode, toggleMode, setMode }),
    [mode, toggleMode, setMode]
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={themes[mode]}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

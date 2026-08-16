/**
 * 생성 이유: 다크/라이트 전환 상태를 Emotion Theme과 동기화한다.
 * 역할: 테마 모드 Context와 Provider다.
 * 책임: localStorage·html data-theme 외부 상태와 ThemeProvider 주입을 관리한다.
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { ThemeProvider } from "@emotion/react";

import { themes, type ThemeMode, type AppTheme } from "@/styles/theme";
import { THEME_STORAGE_KEY } from "./themeBoot";

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const themeListeners = new Set<() => void>();

const readStoredMode = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return "dark";
};

const getServerMode = (): ThemeMode => "dark";

const subscribeToTheme = (listener: () => void) => {
  themeListeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const persistMode = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    /* 브라우저 저장소가 차단돼도 현재 탭의 테마 전환은 유지한다. */
  }
  themeListeners.forEach((listener) => listener());
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const mode = useSyncExternalStore(
    subscribeToTheme,
    readStoredMode,
    getServerMode
  );

  const setMode = useCallback((next: ThemeMode) => {
    persistMode(next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  const value = useMemo(
    () => ({ mode, toggleMode, setMode }),
    [mode, toggleMode, setMode]
  );

  const activeTheme = themes[mode] as AppTheme;

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={activeTheme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return ctx;
};

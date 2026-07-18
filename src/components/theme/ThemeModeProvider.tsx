/**
 * 생성 이유: 다크/라이트 전환 상태를 Emotion Theme과 동기화한다.
 * 역할: 테마 모드 Context와 Provider다.
 * 책임: 로컬 스토리지 유지, html data-theme, ThemeProvider 주입을 관리한다.
 */
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider } from "@emotion/react";

import { themes, type ThemeMode, type AppTheme } from "@/styles/theme";

const STORAGE_KEY = "portfolio-theme-mode";

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const readStoredMode = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return "dark";
};

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = readStoredMode();
    setModeState(initial);
    document.documentElement.dataset.theme = initial;
    document.documentElement.style.colorScheme = initial;
    setReady(true);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
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
      <ThemeProvider theme={activeTheme}>
        <span hidden aria-hidden data-theme-ready={ready ? "1" : "0"} />
        {children}
      </ThemeProvider>
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

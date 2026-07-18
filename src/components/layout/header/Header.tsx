/**
 * 생성 이유: 전역 네비게이션을 페이지 feature와 분리한다.
 * 역할: 세부 페이지 라우트 네비 + 우측 테마 토글 헤더다.
 * 책임: 활성 라우트 pill 위치 계산과 테마 전환 UI를 담당한다.
 */
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import * as S from "./Header.styled";
import { HEADER_NAV_ITEMS, HEADER_UI } from "./constants";
import { useThemeMode } from "@/components/theme/ThemeModeProvider";
import { ROUTES } from "@/constants/routes";
import { useTheme } from "@emotion/react";

type PillRect = {
  left: number;
  width: number;
};

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M19.5 13.2A7.4 7.4 0 0 1 10.8 4.5 7.5 7.5 0 1 0 19.5 13.2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const Header = () => {
  const pathname = usePathname();
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const { mode, toggleMode } = useThemeMode();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Partial<Record<string, HTMLSpanElement>>>({});
  const [pill, setPill] = useState<PillRect>({ left: 0, width: 0 });

  const isActive = useCallback(
    (item: (typeof HEADER_NAV_ITEMS)[number]) => {
      if (item.match === "exact") {
        return pathname === item.href;
      }
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    },
    [pathname]
  );

  const syncPill = useCallback(() => {
    const nav = navRef.current;
    const activeItem = HEADER_NAV_ITEMS.find(isActive);
    if (!nav || !activeItem) return;

    const activeEl = itemRefs.current[activeItem.href];
    if (!activeEl) return;

    setPill({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
    });
  }, [isActive]);

  useLayoutEffect(() => {
    syncPill();
    window.addEventListener("resize", syncPill);
    return () => window.removeEventListener("resize", syncPill);
  }, [syncPill, pathname]);

  return (
    <S.Wrapper>
      <S.Bar>
        <Link href={ROUTES.MAIN}>
          <S.Logo>{HEADER_UI.logo}</S.Logo>
        </Link>
        <S.Nav ref={navRef} aria-label="Primary">
          {pill.width > 0 ? (
            <S.ActivePill
              aria-hidden
              animate={{
                left: pill.left,
                width: pill.width,
              }}
              initial={false}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 420,
                      damping: 36,
                      mass: 0.75,
                    }
              }
            />
          ) : null}
          {HEADER_NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link key={item.href + item.label} href={item.href}>
                <S.NavItem
                  ref={(node) => {
                    if (node) itemRefs.current[item.href] = node;
                  }}
                  $active={active}
                >
                  <S.NavLabel>{item.label}</S.NavLabel>
                </S.NavItem>
              </Link>
            );
          })}
        </S.Nav>
        <S.Actions>
          <S.ThemeToggle
            type="button"
            onClick={toggleMode}
            aria-label={
              mode === "dark"
                ? HEADER_UI.themeToggle.toLight
                : HEADER_UI.themeToggle.toDark
            }
            title={
              mode === "dark"
                ? HEADER_UI.themeToggle.toLight
                : HEADER_UI.themeToggle.toDark
            }
          >
            <S.ThemeIcon
              key={mode}
              initial={
                reduceMotion ? false : { opacity: 0, rotate: -20, scale: 0.85 }
              }
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{
                duration: theme.motion.duration.ui,
                ease: theme.motion.ease.out,
              }}
            >
              {mode === "dark" ? <SunIcon /> : <MoonIcon />}
            </S.ThemeIcon>
          </S.ThemeToggle>
        </S.Actions>
      </S.Bar>
    </S.Wrapper>
  );
};

export default Header;

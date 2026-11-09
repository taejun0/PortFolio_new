/**
 * 생성 이유: 전역 네비게이션을 페이지 feature와 분리한다.
 * 역할: 본문 바로가기 + 세부 페이지 라우트 네비 + 우측 테마 토글 헤더다.
 * 책임: 활성 라우트 표시(CSS 정적 pill + 라우트가 바뀔 때만 clip-path로 옮겨 가는 반전 잉크 pill),
 *       스크롤 임계 감지(스크림 on/off), 호버 롤 라벨, 테마 전환 UI, 첫 Tab 정거장(본문 바로가기)을 담당한다.
 *       토글의 아이콘·이름은 두 모드를 모두 렌더하고 CSS(html[data-theme])가 고른다 — hydration 전에도 맞다.
 */
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import * as S from "./Header.styled";
import { HEADER_NAV_ITEMS, HEADER_UI, MAIN_CONTENT_ID } from "./constants";
import { RollText } from "@/components/common/motion";
import { VisuallyHidden } from "@/components/common/visuallyHidden/VisuallyHidden.styled";
import { useThemeMode } from "@/components/theme/themeModeContext";
import { ROUTES } from "@/constants/routes";
import { motionTokens, type ThemeMode } from "@/styles/theme";

type NavItem = (typeof HEADER_NAV_ITEMS)[number];

/** 잉크 레이어 기준 박스(px) */
type PillBox = { x: number; y: number; w: number; h: number };

const isItemActive = (item: NavItem, pathname: string) =>
  item.match === "exact"
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);

const boxOf = (el: Element, base: DOMRect): PillBox => {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left - base.left,
    y: rect.top - base.top,
    w: rect.width,
    h: rect.height,
  };
};

/**
 * 잉크 레이어(width × height)에서 링크 박스 하나만 남기는 pill 클립.
 * 반지름이 높이의 절반이라 정적 pill(border-radius 999px)과 같은 모양이고, 두 클립 사이를 보간하면
 * 양 끝이 같은 곡선으로 움직여 pill이 늘고 줄며 미끄러진다.
 */
const pillClip = ({ x, y, w, h }: PillBox, width: number, height: number) =>
  `inset(${y}px ${width - x - w}px ${height - y - h}px ${x}px round ${h / 2}px)`;

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
  const { mode, toggleMode } = useThemeMode();
  const navRef = useRef<HTMLElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Partial<Record<string, HTMLAnchorElement>>>({});
  const glideAnimation = useRef<Animation | null>(null);
  const [scrolled, setScrolled] = useState(false);
  /** 사용자가 토글로 고른 모드 — 그 모드의 아이콘만 스윕으로 들어온다(첫 로드·다른 탭 변경은 조용히 바뀐다). */
  const [toggledTo, setToggledTo] = useState<ThemeMode | null>(null);

  const activeHref =
    HEADER_NAV_ITEMS.find((item) => isItemActive(item, pathname))?.href ??
    null;
  const prevActiveRef = useRef(activeHref);

  /*
   * 라우트가 바뀌면 반전 잉크 레이어의 클립을 이전 활성 항목에서 새 항목으로 옮긴다(페인트 전에 출발점을 깐다).
   * 연속 클릭이면 지금 칠해진 클립에서 이어 간다. 첫 로드·동작 줄이기·출발점 없음(활성 항목이 없던 페이지)에서는
   * 정적 pill이 바로 자리를 옮긴다. 끝나면 레이어를 숨기고 같은 자리의 정적 pill에 넘긴다 —
   * 리사이즈·폰트 교체 추적이 필요 없다.
   */
  useLayoutEffect(() => {
    const prevHref = prevActiveRef.current;
    prevActiveRef.current = activeHref;
    const nav = navRef.current;
    const ink = inkRef.current;
    if (prevHref === activeHref || !nav || !ink) return;

    const base = ink.getBoundingClientRect();
    const origin = prevHref ? itemRefs.current[prevHref] : undefined;
    const target = activeHref ? itemRefs.current[activeHref] : undefined;
    // 진행 중이면 지금 보이는 클립에서, 아니면 이전 활성 항목 자리에서 출발한다(취소 전에 읽는다).
    const running = glideAnimation.current;
    const current = running ? getComputedStyle(ink).clipPath : "";
    const from = current.startsWith("inset(")
      ? current
      : origin
        ? pillClip(boxOf(origin, base), base.width, base.height)
        : null;
    running?.cancel();
    glideAnimation.current = null;

    const canGlide =
      typeof ink.animate === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!target || !from || !canGlide) {
      nav.removeAttribute("data-pill-gliding");
      return;
    }

    nav.setAttribute("data-pill-gliding", "");
    const animation = ink.animate(
      [
        { clipPath: from },
        { clipPath: pillClip(boxOf(target, base), base.width, base.height) },
      ],
      {
        duration: motionTokens.duration.section * 1000,
        easing: motionTokens.curve.out,
        fill: "both",
      }
    );
    glideAnimation.current = animation;

    animation.finished
      .then(() => {
        if (glideAnimation.current !== animation) return;
        nav.removeAttribute("data-pill-gliding");
        animation.cancel();
        glideAnimation.current = null;
      })
      .catch(() => {
        /* 다음 라우트 전환이 이어받으며 취소했다 */
      });
  }, [activeHref]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    // 임계선을 넘나들 때만 콜백이 오므로 스크롤 프레임마다 setState 하지 않는다.
    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <S.SkipLink href={`#${MAIN_CONTENT_ID}`}>
        {HEADER_UI.skipToContent}
      </S.SkipLink>
      <S.ScrollSentinel ref={sentinelRef} aria-hidden />
      <S.Wrapper $scrolled={scrolled}>
        <S.Bar>
          <S.Logo href={ROUTES.MAIN}>
            <RollText>{HEADER_UI.logo}</RollText>
            <VisuallyHidden> {HEADER_UI.logoHint}</VisuallyHidden>
          </S.Logo>
          <S.Nav ref={navRef} aria-label={HEADER_UI.navLabel}>
            <S.GlideInk ref={inkRef} aria-hidden>
              {HEADER_NAV_ITEMS.map((item) => (
                <S.GlideLabel key={item.href + item.label}>
                  {item.label}
                </S.GlideLabel>
              ))}
            </S.GlideInk>
            {HEADER_NAV_ITEMS.map((item) => (
              <S.NavLink
                key={item.href + item.label}
                ref={(node: HTMLAnchorElement | null) => {
                  if (node) itemRefs.current[item.href] = node;
                }}
                href={item.href}
                aria-current={item.href === activeHref ? "page" : undefined}
              >
                <RollText>{item.label}</RollText>
              </S.NavLink>
            ))}
          </S.Nav>
          <S.Actions>
            <S.ThemeToggle
              type="button"
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setToggledTo(mode === "dark" ? "light" : "dark");
                toggleMode({
                  x: event.clientX || rect.left + rect.width / 2,
                  y: event.clientY || rect.top + rect.height / 2,
                });
              }}
            >
              {/* data-for = 그 모드일 때 보이는 쪽. 다크면 해(라이트로), 라이트면 달(다크로). */}
              <S.ThemeIcon
                data-for="dark"
                data-icon-enter={toggledTo === "dark" ? "" : undefined}
              >
                <SunIcon />
              </S.ThemeIcon>
              <S.ThemeIcon
                data-for="light"
                data-icon-enter={toggledTo === "light" ? "" : undefined}
              >
                <MoonIcon />
              </S.ThemeIcon>
              <VisuallyHidden data-for="dark">
                {HEADER_UI.themeToggle.toLight}
              </VisuallyHidden>
              <VisuallyHidden data-for="light">
                {HEADER_UI.themeToggle.toDark}
              </VisuallyHidden>
            </S.ThemeToggle>
          </S.Actions>
        </S.Bar>
      </S.Wrapper>
    </>
  );
};

export default Header;

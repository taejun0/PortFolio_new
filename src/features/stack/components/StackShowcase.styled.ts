/**
 * 생성 이유: 기술 쇼케이스 시각을 슬라이더 로직과 분리한다.
 * 역할: StackShowcase 카테고리 탭·자동 전환 정지 버튼·인디케이터·슬라이드·아이콘 타일 스타일과 전환 모션이다.
 * 책임: 탭 가독성, 미끄러지는 탭 인디케이터(자동 전환 진행 바), 한 칸에 겹친 슬라이드의 가로 스윕 전환,
 *       아이콘 타일 그리드와 반응형 배치, 섹션 첫 등장(공용 리빌 group 상태), JS 없음·인쇄 배치만 소유한다.
 *
 * 전환은 투명도 크로스페이드가 아니다(Approach 탭 panelSweep과 같은 문법 — 다시 페이드로 바꾸지 말 것).
 * 나가는 슬라이드는 넘기는 방향으로 지우는 선에 지워지며 살짝 밀리고, 그 선이 글 열을 지난 뒤 새 슬라이드가 쓸려 들어온다.
 *
 * 상태 계약(StackShowcase가 붙인다)
 * - Viewport[data-flow]  "ltr"(번호가 커짐·오른쪽으로 끌어 넘김) | "rtl" — 들어오는 타일이 쓸리는 방향
 * - Viewport[data-dragging]  끄는 중(놓으면 제자리로 돌아오는 트랜지션을 끈다)
 * - Slide[data-state]  "static"(첫 화면, 섹션 리빌로 등장) | "in"(전환으로 들어옴) | "out"(나가는 중) | "idle"(숨김)
 * - Pagination[data-indicator]  "placed"(인디케이터 첫 배치, 이동 없음) | "live"(이후 미끄러짐) — 첫 ResizeObserver 콜백이 붙인다
 *
 * JS 없음(html:not([data-theme-ready="1"]))·인쇄에서는 전환할 수 없으니 다섯 슬라이드를 차례로 쌓아 모두 보이게 하고,
 * 동작하지 않는 정지 버튼은 숨긴다(인쇄는 인디케이터도 숨긴다).
 */
import { css, keyframes, type Theme } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";

import { motionTransition, staggerChildren } from "@/components/common/motion";
import { motionTokens } from "@/styles/theme";

import { STACK_SHOWCASE_UI } from "../constants";

/** 탭 버튼 바깥 포커스 링이 가로 스크롤 영역에 잘리지 않게 두는 여유 — 탭이 다 보이는지 판정에서도 뺀다 */
export const FOCUS_ROOM = "4px";

/** JS가 없는 방문 — 부트 스크립트가 첫 페인트 전에 data-theme-ready를 붙이지 못했다 */
const NO_JS = 'html:not([data-theme-ready="1"])';

/** 인디케이터 기준 너비(px) — 활성 탭 너비에 맞춰 scaleX로 늘린다(레이아웃을 건드리지 않는다). */
export const INDICATOR_BASE_PX = 100;

const { duration, curve, stagger, distance } = motionTokens;

export const ProjectLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};
  min-height: 44px;
  margin-top: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[2]} 0;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.text};
  ${hoverArrowParent}

  > span:first-of-type { color: ${({ theme }) => theme.colors.textMuted}; }
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    border-radius: ${({ theme }) => theme.layout.radius.sm};
  }
`;

/** 초 단위 CSS 값 — 소수 계산 오차(0.035999…)를 셋째 자리에서 정리한다 */
const sec = (seconds: number) => `${Number(seconds.toFixed(3))}s`;

/**
 * 전환으로 들어오는 슬라이드의 출발 — Approach panelSweep의 ENTER_LAG와 같다.
 * 나가는 슬라이드를 지우는 선이 글 열을 먼저 지나가 두 슬라이드가 한 프레임에 함께 보이지 않는다.
 */
const IN_AT_S = 0.1;
/** 슬라이드 안 순서(출발 기준) — 번호→제목→설명이 먼저 열리고 타일이 뒤따른다 */
const TITLE_AT_S = stagger.item * 0.6;
const DESCRIPTION_AT_S = stagger.item * 1.5;
const TILES_AT_S = stagger.item * 2;
/** 타일 열 사이 간격과 같은 열 아래 줄의 추가 지연 — 5열 2줄도 누적 0.27s */
const TILE_COL_STEP_S = stagger.item;
const TILE_ROW_STEP_S = stagger.item / 2;
/** 나가는 슬라이드가 넘기는 방향으로 밀리는 거리 — 들어오는 스윕 거리의 절반(panelSweep과 같다) */
const EXIT_DRIFT = `calc(${distance.sweep} / 2)`;

/** 줄마다 개수가 고르게 열 수를 정한다 — 7개는 4+3, 5개는 좁은 화면에서 3+2. */
const balancedColumns = (count: number, max: number) =>
  Math.ceil(count / Math.ceil(count / max));

/** 타일의 열·줄 번호 — 스윕이 열 단위 세로 경계선으로 지나가게 지연을 정한다. */
const tileGrid = (count: number, columns: number) =>
  Array.from(
    { length: count },
    (_, index) => `
      > li:nth-child(${index + 1}) {
        --tile-col: ${index % columns};
        --tile-row: ${Math.floor(index / columns)};
      }
    `
  ).join("");

const progress = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

/** 글·블록·타일 — 왼쪽에서 열리는 마스크와 짧은 가로 미끄러짐(사이트 공통 스윕 문법) */
const sweepLtr = keyframes`
  from {
    clip-path: inset(-0.2em 100% -0.2em 0);
    transform: translateX(calc(${distance.sweep} * -1));
  }
  to {
    clip-path: inset(-0.2em 0 -0.2em 0);
    transform: none;
  }
`;

/** 거울 스윕 — 번호가 작아지는 쪽(왼쪽 탭)으로 넘길 때 타일이 오른쪽에서 열린다 */
const sweepRtl = keyframes`
  from {
    clip-path: inset(-0.2em 0 -0.2em 100%);
    transform: translateX(${distance.sweep});
  }
  to {
    clip-path: inset(-0.2em 0 -0.2em 0);
    transform: none;
  }
`;

/**
 * 나가는 슬라이드(왼→오) — 왼쪽부터 지워지며 오른쪽으로 살짝 밀리고, 끝나면 숨는다(끌던 위치에서 이어 간다).
 * 투명도는 건드리지 않는다. 지우는 선을 오른쪽 밖(115%)까지 보내 ease.out 꼬리에 글자 조각이 오래 남지 않는다.
 */
const slideOutLtr = keyframes`
  from {
    clip-path: inset(0 0 0 0);
    transform: translateX(var(--exit-from, 0px));
  }
  to {
    clip-path: inset(0 0 0 115%);
    transform: translateX(calc(var(--exit-from, 0px) + ${EXIT_DRIFT}));
    visibility: hidden;
  }
`;

/** 거울 퇴장(오→왼) — 오른쪽부터 지워지며 왼쪽으로 밀린다 */
const slideOutRtl = keyframes`
  from {
    clip-path: inset(0 0 0 0);
    transform: translateX(var(--exit-from, 0px));
  }
  to {
    clip-path: inset(0 115% 0 0);
    transform: translateX(calc(var(--exit-from, 0px) - ${EXIT_DRIFT}));
    visibility: hidden;
  }
`;

const lineIn = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

/** 쇼케이스 위 기준선 — 섹션이 처음 보일 때 왼쪽에서 그어진다(레이아웃은 1px 테두리와 같다). */
export const Showcase = styled.div`
  position: relative;
  padding-top: 1px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.text};
    transform-origin: left center;
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion="live"] &[data-reveal-state="pending"]::before {
      transform: scaleX(0);
    }

    html[data-motion="live"] &[data-reveal-state="in"]::before {
      animation: ${lineIn} ${duration.reveal}s ${curve.out}
        var(--reveal-delay, 0s) backwards;
    }
  }
`;

/**
 * 탭 줄 + 자동 전환 정지 버튼 한 행. 버튼은 가로 스크롤 밖 오른쪽 끝에 둔다.
 * 탭 아래 기준선은 이 행의 배경으로 그려 스크롤되지 않고 본문 좌우 선 밖으로 나가지 않는다
 * (탭 줄의 아래 음수 여백만큼 올라와 인디케이터와 같은 높이다).
 * 버튼 안 아이콘이 오른쪽에 붙어 있어 사이 간격은 좁게 둔다 — 390px에서도 탭 세 개가 다 보인다.
 */
export const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  background: linear-gradient(
      ${({ theme }) => theme.colors.border},
      ${({ theme }) => theme.colors.border}
    )
    no-repeat left bottom / 100% 1px;
`;

/**
 * 모바일에서는 가로로 스크롤되고, 넓은 화면에서는 다섯 칸이 같은 너비로 줄을 채운다.
 * 섹션이 처음 보일 때 탭이 왼쪽부터 차례로 쓸려 들어온다(인디케이터는 제외).
 */
export const Pagination = styled.div`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  gap: ${({ theme }) => theme.space[5]};
  min-width: 0;
  margin: calc(${FOCUS_ROOM} * -1);
  padding: ${FOCUS_ROOM};
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  scroll-padding-inline: ${FOCUS_ROOM};
  scrollbar-width: none;
  ${staggerChildren({ children: "> button" })}

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PageButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
  flex: 1 1 0;
  min-width: max-content;
  min-height: 3rem;
  padding: ${({ theme }) => theme.space[4]} 0;
  border: 0;
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  text-align: left;
  cursor: pointer;
  scroll-snap-align: start;
  transition: ${motionTransition("color")};

  /* 하이드레이션 전(JS 없음) 활성 표시 — 인디케이터가 자리를 잡으면 숨는다 */
  &::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.accent};
    transform-origin: left center;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
  }

  [data-indicator] > &::after {
    display: none;
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/** 탭 글자 — 기본은 label 토큰, 폰에서는 bodySm으로 키운다. */
const pageText = ({ theme }: { theme: Theme }) => css`
  font-size: ${theme.typography.label.fontSize};
  letter-spacing: ${theme.typography.label.letterSpacing};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.bodySm.fontSize};
    letter-spacing: ${theme.typography.small.letterSpacing};
  }
`;

export const PageIndex = styled.span<{ $active: boolean }>`
  ${pageText}
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  font-variant-numeric: tabular-nums;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : "inherit"};
  transition: ${motionTransition("color")};
`;

export const PageLabel = styled.span`
  ${pageText}
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  text-transform: uppercase;
`;

/**
 * 자동 전환 정지 토글(aria-pressed) — 아이콘만 보이고 이름은 숨긴 글자다. 탭 라벨과 같은 색·크기 문법으로 조용히 둔다.
 * 누르는 칸은 2.75rem 정사각형이고, 아이콘은 오른쪽 끝을 본문 오른쪽 선에 맞춘다.
 * 자동 전환이 없는 환경(동작 줄이기·JS 없음)과 인쇄에서는 숨긴다.
 */
export const AutoplayToggle = styled.button`
  position: relative;
  display: grid;
  place-items: center end;
  flex: none;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  ${pageText}
  cursor: pointer;
  transition: ${motionTransition("color")};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }

  ${NO_JS} & {
    display: none;
  }

  @media print {
    display: none;
  }
`;

/** 정지(두 막대)·재생(삼각형) 아이콘 — 탭 글자 크기(1em)를 따라 대문자 높이쯤에 앉는다. */
export const AutoplayIcon = styled.svg`
  width: 1em;
  height: 1em;
  fill: currentColor;
`;

/**
 * 활성 탭 인디케이터 — 탭 사이를 transform으로 미끄러진다(탭 줄과 함께 스크롤된다).
 * 바탕은 은은한 트랙, 안쪽 채움이 액센트다: 자동 전환 중에는 다음 전환까지 차오르고, 멈추면 가득 찬다.
 */
export const Indicator = styled.span`
  position: absolute;
  bottom: ${FOCUS_ROOM};
  left: 0;
  width: ${INDICATOR_BASE_PX}px;
  height: 2px;
  overflow: hidden;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text} 28%,
    transparent
  );
  opacity: 0;
  pointer-events: none;
  transform-origin: left center;
  transform: translateX(var(--indicator-x, 0px))
    scaleX(var(--indicator-scale, 0));

  [data-indicator] > & {
    opacity: 1;
  }

  [data-indicator="live"] > & {
    transition: ${motionTransition("transform", "reveal")};
  }

  @media print {
    display: none;
  }

  /* 섹션 첫 등장 — 탭이 쓸려 들어오기 전에는 숨기고, 앞 탭들이 열린 뒤 나타난다(transform은 위치가 쓴다) */
  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion="live"] [data-reveal-state="pending"] > & {
      opacity: 0;
    }

    html[data-motion="live"] [data-reveal-state="in"] > & {
      animation: ${fadeIn} ${duration.reveal}s ${curve.out}
        calc(var(--reveal-delay, 0s) + ${sec(TILES_AT_S)}) backwards;
    }
  }
`;

export const IndicatorFill = styled.span<{ $autoplay: boolean }>`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.accent};
  transform-origin: left center;

  ${({ $autoplay }) =>
    $autoplay &&
    css`
      animation: ${progress} ${STACK_SHOWCASE_UI.autoplayMs}ms linear both;
    `}
`;

export const SlideCopy = styled.div`
  min-width: 0;
`;

export const Index = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`;

/** 제목 래퍼 — 첫 등장은 안쪽 SweepText가 어절 단위로, 카테고리 전환은 이 래퍼가 블록 스윕으로 맡는다. */
export const TitleWrap = styled.div``;

export const Title = styled.h3`
  font-size: clamp(1.85rem, 1.1rem + 2.2vw, 3rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 0.92;
  letter-spacing: -0.045em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  max-width: 24rem;
  margin-top: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: ${({ theme }) => theme.typography.bodySm.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * 개수에 맞춰 줄을 꽉 채운다 — 모바일 최대 4열, 태블릿 이상 최대 5열.
 * 아이콘 크기의 기준 컨테이너라 열 수가 달라도 슬라이드끼리 아이콘 크기가 같다.
 */
export const Tools = styled.ul<{ $count: number }>`
  --tile-cols: ${({ $count }) => balancedColumns($count, 4)};

  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(
    ${({ $count }) => balancedColumns($count, 4)},
    minmax(0, 1fr)
  );
  gap: ${({ theme }) => theme.space[3]};
  ${({ $count }) => tileGrid($count, balancedColumns($count, 4))}

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    --tile-cols: ${({ $count }) => balancedColumns($count, 5)};

    grid-template-columns: repeat(
      ${({ $count }) => balancedColumns($count, 5)},
      minmax(0, 1fr)
    );
    ${({ $count }) => tileGrid($count, balancedColumns($count, 5))}
  }
`;

/** 이름이 두 줄로 접혀도 같은 줄 아이콘 높이가 맞도록 위에서부터 채운다. */
export const Tool = styled.li`
  /* 스윕 순서 — 왼→오면 왼쪽 열부터, 오→왼이면 오른쪽 열부터 */
  --tile-order: var(--tile-col, 0);

  display: grid;
  justify-items: center;
  align-content: start;
  gap: ${({ theme }) => theme.space[3]};
  min-width: 0;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[2]};
  border: ${({ theme }) => theme.layout.borderWidth.card} solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radius.md};
  background: ${({ theme }) => theme.colors.surface};

  [data-flow="rtl"] & {
    --tile-order: calc(var(--tile-cols) - 1 - var(--tile-col, 0));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.space[2]};
    padding-inline: ${({ theme }) => theme.space[1]};
    border-radius: ${({ theme }) => theme.layout.radius.sm};
  }
`;

export const Icon = styled.span`
  /* 타일 그리드 너비에 비례 — 390px 42px, 320px 35px, 태블릿 64px 안팎 */
  --stack-icon-size: clamp(2.25rem, 12cqi, 4rem);

  position: relative;
  display: grid;
  place-items: center;
  width: var(--stack-icon-size);
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 24%;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  /* 2단 배치는 그리드가 좁아 5열 타일 여백이 빠듯하다 — 1024px 55px, 1280px 이상 64~68px */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    --stack-icon-size: clamp(2.25rem, 8.5cqi, 4rem);
  }

  /* 아이콘 파일은 타일 마스크에 맞게 미리 잘라 둔 정사각형이라 칸을 그대로 채운다 */
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }
`;

export const Monogram = styled.span<{ $color?: string }>`
  display: grid;
  place-items: end;
  width: 100%;
  height: 100%;
  padding: 0 9% 7% 0;
  background: ${({ $color, theme }) => $color ?? theme.colors.accent};
  font-size: calc(var(--stack-icon-size) * 0.36);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1;
  letter-spacing: -0.04em;
  color: #ffffff;
`;

export const ToolName = styled.span`
  max-width: 100%;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  overflow-wrap: anywhere;
`;

/** 타일 등장 지연 — 출발 시점 + 열 순서 + 줄 */
const tileDelay = (start: string) =>
  `calc(${start} + var(--tile-order) * ${sec(TILE_COL_STEP_S)} + var(--tile-row, 0) * ${sec(TILE_ROW_STEP_S)})`;

/**
 * 위에서부터 쌓아 제목·첫 줄 타일 위치를 슬라이드마다 고정한다. 데스크톱은 좌우 2단으로 둔다.
 * 모든 슬라이드가 한 칸에 겹쳐 있어 높이는 가장 긴 슬라이드로 고정된다 — 전환해도 아래가 밀리지 않는다.
 */
export const Slide = styled.article`
  grid-area: 1 / 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: ${({ theme }) => theme.space[5]};
  min-width: 0;
  padding-top: ${({ theme }) => theme.space[6]};
  /* 끌다 놓았을 때 제자리로 */
  transition: ${motionTransition("transform")};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: minmax(13rem, 0.8fr) minmax(0, 2fr);
    align-items: start;
    gap: ${({ theme }) => theme.space[7]};
  }

  [data-dragging] > & {
    transition: none;
  }

  &[data-state="idle"] {
    visibility: hidden;
  }

  &[data-state="static"],
  &[data-state="in"] {
    z-index: 1;
  }

  &[data-state="out"] {
    pointer-events: none;
  }

  /* 나가는 슬라이드 — 들어오는 쪽 아래에서 넘기는 방향으로 지워지며 밀린다(호버 토큰 길이) */
  @media (prefers-reduced-motion: no-preference) {
    [data-flow="ltr"] > &[data-state="out"] {
      animation: ${slideOutLtr} ${duration.hover}s ${curve.out} forwards;
    }

    [data-flow="rtl"] > &[data-state="out"] {
      animation: ${slideOutRtl} ${duration.hover}s ${curve.out} forwards;
    }
  }

  /* 동작 줄이기 — 나가는 슬라이드도 그 자리에서 바로 숨는다 */
  @media (prefers-reduced-motion: reduce) {
    &[data-state="out"] {
      visibility: hidden;
    }
  }

  /*
   * 들어오는 슬라이드 — 번호→제목→설명은 읽는 방향으로, 타일은 넘기는 방향으로 열 단위로 쓸린다.
   * 동작 줄이기에서는 애니메이션 자체를 걸지 않아 바뀐 카테고리가 그 자리에서 바로 보인다.
   */
  @media screen and (prefers-reduced-motion: no-preference) {
    &[data-state="in"] ${Index} {
      animation: ${sweepLtr} ${duration.reveal}s ${curve.out}
        ${sec(IN_AT_S)} backwards;
    }

    &[data-state="in"] ${TitleWrap} {
      animation: ${sweepLtr} ${duration.reveal}s ${curve.out}
        ${sec(IN_AT_S + TITLE_AT_S)} backwards;
    }

    &[data-state="in"] ${Description} {
      animation: ${sweepLtr} ${duration.reveal}s ${curve.out}
        ${sec(IN_AT_S + DESCRIPTION_AT_S)} backwards;
    }

    [data-flow="ltr"] > &[data-state="in"] ${Tool} {
      animation: ${sweepLtr} ${duration.reveal}s ${curve.out}
        ${tileDelay(sec(IN_AT_S + TILES_AT_S))} backwards;
    }

    [data-flow="rtl"] > &[data-state="in"] ${Tool} {
      animation: ${sweepRtl} ${duration.reveal}s ${curve.out}
        ${tileDelay(sec(IN_AT_S + TILES_AT_S))} backwards;
    }
  }

  /*
   * 섹션 첫 등장 — Viewport가 공용 리빌 group으로 상태를 받는다. 제목은 안쪽 SweepText가 스스로 등장한다.
   * 가림·재생은 화면용·동작 허용에서만(JS 없음·인쇄·동작 줄이기는 그대로 보인다).
   */
  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion="live"] [data-reveal-state="pending"] > &[data-state="static"] :is(${Index}, ${Description}, ${Tool}) {
      clip-path: inset(0 100% 0 0);
      transform: translateX(calc(${distance.sweep} * -1));
    }

    html[data-motion="live"] [data-reveal-state="in"] > &[data-state="static"] ${Index} {
      animation: ${sweepLtr} ${duration.reveal}s ${curve.out}
        var(--reveal-delay, 0s) backwards;
    }

    html[data-motion="live"] [data-reveal-state="in"] > &[data-state="static"] ${Description} {
      animation: ${sweepLtr} ${duration.reveal}s ${curve.out}
        calc(var(--reveal-delay, 0s) + ${sec(DESCRIPTION_AT_S)}) backwards;
    }

    html[data-motion="live"] [data-reveal-state="in"] > &[data-state="static"] ${Tool} {
      animation: ${sweepLtr} ${duration.reveal}s ${curve.out}
        ${tileDelay(`var(--reveal-delay, 0s) + ${sec(TILES_AT_S)}`)} backwards;
    }
  }

  /*
   * JS 없음·인쇄 — 전환할 수 없으니 겹쳐 둔 슬라이드를 차례로 쌓아 모두 읽히고 인쇄되게 한다(간격은 Viewport).
   * 상태 규칙([data-flow] > [data-state])보다 구체적이거나 같은 구체성으로 맨 뒤에 둬 숨김·나가는 스윕을 모두 이긴다.
   */
  ${NO_JS} [data-flow] > &[data-state] {
    grid-area: auto;
    visibility: visible;
    animation: none;
    transform: none;
  }

  @media print {
    [data-flow] > &[data-state] {
      grid-area: auto;
      visibility: visible;
      animation: none;
      transform: none;
    }
  }
`;

/** 슬라이드를 한 칸에 겹쳐 두는 무대 — 끌어 넘기기·키보드 좌우 이동을 받는다. */
export const Viewport = styled.div`
  display: grid;
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;
  -webkit-user-select: none;
  user-select: none;

  &[data-dragging] {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 4px;
    border-radius: ${({ theme }) => theme.layout.radius.sm};
  }

  /*
   * 동작 줄이기 — 전역 규칙이 모든 요소에 0.01ms 트랜지션(속성 all)을 걸어, 상속되는 visibility가
   * 2~3프레임 늦게 바뀌며 카테고리 사이가 잠깐 빈다. 이 무대 안은 트랜지션 없이 바로 바꾼다.
   */
  @media (prefers-reduced-motion: reduce) {
    & * {
      transition-property: none;
    }
  }

  /* JS 없음·인쇄 — 차례로 쌓인 슬라이드(Slide) 사이를 띄운다 */
  ${NO_JS} & {
    row-gap: ${({ theme }) => theme.space[7]};
  }

  @media print {
    row-gap: ${({ theme }) => theme.space[7]};
    overflow: visible;
  }
`;

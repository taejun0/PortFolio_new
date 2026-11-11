/**
 * 생성 이유: 프로젝트 상세 스타일을 목록 페이지와 분리한다.
 * 역할: ProjectDetailPage(케이스 스터디) 레이아웃·섹션 스타일을 정의한다.
 * 책임: 히어로·메타 스트립·sticky 목차·번호 목록·Challenge 카드·
 *       다음 프로젝트 내비의 시각만 소유한다.
 *       호버·키보드 포커스는 같은 시각이다 — 라벨은 RollText·밑줄 스윕으로 가로로 움직이고
 *       들림(translateY)·크기 튐 없이 색만 바뀐다. 목차 활성 막대는 레일 위를 transform으로 미끄러진다.
 *       섹션 앵커 여백은 헤더 아래 간격만 소유한다(헤더 높이는 전역 html scroll-padding-top이 더한다).
 */
import type { Theme } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import {
  motionTransition,
  underlineSweep,
  underlineSweepActive,
} from "@/components/common/motion";
import { LIGHT_MODE } from "@/styles/theme";

/** 본문 열 최대 폭 — 모든 섹션이 같은 읽기 폭을 공유한다. */
const CONTENT_MAX = "50rem";

/** 텍스트 색을 옅게 섞은 헤어라인 — 다크/라이트 모두 같은 비율로 읽힌다. */
const inkLine = (theme: Theme, amount: number) =>
  `color-mix(in srgb, ${theme.colors.text} ${amount}%, transparent)`;

/** 카드 면(선언 묶음): 다크는 캔버스보다 아주 살짝 밝은 면, 라이트는 흰 서피스. */
const cardSurface = (theme: Theme) => `
  background: ${inkLine(theme, 3)};

  ${LIGHT_MODE} & {
    background: ${theme.colors.surface};
  }
`;

const focusRing = (theme: Theme) => `
  outline: 2px solid ${theme.colors.accent};
  outline-offset: 3px;
`;

/**
 * 커튼 리빌(제목·커버) 색을 이 페이지 면과 같은 선언에서 준다 — 면 색이 바뀌면 덮개도 함께 바뀐다
 * (전역 --motion-canvas와 같은 값이지만, 페이지 면에 직접 묶어 둔다).
 */
export const Wrapper = styled.article`
  --reveal-curtain: ${({ theme }) => theme.colors.background};

  width: 100%;
  padding-top: clamp(4.5rem, 2.5rem + 7vw, 8rem);
  padding-bottom: ${({ theme }) => theme.space[9]};
  padding-inline: ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

/** 목록으로 — 호버·키보드 포커스에서 1px 선이 왼쪽부터 그어지고 떠날 때 오른쪽으로 빠진다. */
export const BackLink = styled(Link)`
  ${underlineSweep()}
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.accent};
`;

/* ───────── Hero ───────── */

export const Hero = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  margin-bottom: ${({ theme }) => theme.space[7]};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: end;
    gap: ${({ theme }) => theme.space[8]};
  }
`;

export const HeroCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  min-width: 0;
`;

/** 페이지 라벨 */
export const Eyebrow = styled.p`
  justify-self: start;
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const EyebrowCount = styled.span`
  display: inline-block;
  margin-left: 0.75em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.display.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.display.letterSpacing};
  line-height: ${({ theme }) => theme.typography.display.lineHeight};
  color: ${({ theme }) => theme.colors.text};
`;

export const Summary = styled.p`
  max-width: ${({ theme }) => theme.layout.measure};
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

/** 외부 링크 알약 — 라벨은 안쪽 RollText가 굴리고, 알약은 들리지 않고 면·테두리 색만 바뀐다. */
export const ExtLink = styled.a<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: clamp(0.6rem, 0.5rem + 0.3vw, 0.75rem)
    clamp(1.1rem, 0.9rem + 0.6vw, 1.4rem);
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: ${({ theme }) => theme.layout.borderWidth.control} solid
    ${({ theme, $primary }) =>
      $primary ? theme.colors.accent : theme.colors.borderStrong};
  background: ${({ theme, $primary }) =>
    $primary ? theme.colors.accent : "transparent"};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.2;
  color: ${({ theme, $primary }) =>
    $primary ? theme.colors.accentContrast : theme.colors.text};
  text-decoration: none;
  transition: ${motionTransition(["background-color", "border-color"])};
  ${hoverArrowParent}

  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme, $primary }) =>
        $primary ? theme.colors.accentSecondary : inkLine(theme, 45)};
      background: ${({ theme, $primary }) =>
        $primary ? theme.colors.accentSecondary : "transparent"};
    }
  }

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
    border-color: ${({ theme, $primary }) =>
      $primary ? theme.colors.accentSecondary : inkLine(theme, 45)};
    background: ${({ theme, $primary }) =>
      $primary ? theme.colors.accentSecondary : "transparent"};
  }
`;

/**
 * 커버 커튼 호스트 — 첫 화면 이미지(LCP 후보)라 캔버스색 덮개가 걷히는 curtain 리빌을 건다.
 * Cover는 overflow: hidden이라 덮개(::after)가 1px 테두리를 못 덮으므로 바깥 상자에 건다.
 */
export const CoverFrame = styled.div`
  min-width: 0;
`;

export const Cover = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.layout.radius.lg};
  border: ${({ theme }) => theme.layout.borderWidth.card} solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

/* ───────── Meta strip ───────── */

/** period는 모바일에서, stack은 데스크톱 미만에서 한 줄을 다 쓴다. */
type MetaSpan = "period" | "stack";

export const MetaStrip = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => `${theme.space[5]} ${theme.space[4]}`};
  margin-bottom: ${({ theme }) => theme.space[9]};
  padding-block: ${({ theme }) => theme.space[5]};
  border-block: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
    column-gap: ${({ theme }) => theme.space[5]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns:
      minmax(0, 1.3fr) minmax(0, 0.85fr) minmax(0, 1fr)
      minmax(0, 1.4fr);
    column-gap: ${({ theme }) => theme.space[6]};
  }
`;

export const MetaItem = styled.div<{ $span?: MetaSpan }>`
  display: grid;
  align-content: start;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
  grid-column: ${({ $span }) => ($span ? "1 / -1" : "auto")};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-column: ${({ $span }) => ($span === "stack" ? "1 / -1" : "auto")};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-column: auto;
  }
`;

export const MetaLabel = styled.dt`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const MetaValue = styled.dd`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

/**
 * 메타 조각(기간 단계·팀 구성 등)은 한 덩어리로 줄바꿈된다(폭이 모자랄 때만 안에서 접힌다).
 * 원자 인라인 사이에는 항상 줄바꿈 기회가 있어 공백 노드 없이도 접힌다.
 */
export const MetaPart = styled.span`
  display: inline-block;
`;

/** 구분자는 앞 조각에 붙어 줄 끝에 남고, 좌우 여백은 대칭이다. */
export const MetaSep = styled.span`
  margin-inline: 0.4em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const Tag = styled.li`
  padding: 0.3rem 0.7rem;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 0;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.textMuted};

  /* label 토큰은 좁은 화면에서 10px 아래로 내려가 칩 글자로는 작다 */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  }
`;

/* ───────── Body: 목차 + 본문 ───────── */

export const Body = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[7]};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: minmax(10rem, 12.5rem) minmax(0, ${CONTENT_MAX});
    justify-content: space-between;
    align-items: start;
    column-gap: ${({ theme }) => theme.space[8]};
  }
`;

/** 데스크톱은 sticky 세로 목차, 그 미만은 본문 위 인라인 pill 목록이다. */
export const Toc = styled.nav`
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    position: sticky;
    top: ${({ theme }) =>
      `calc(${theme.layout.headerHeight} + ${theme.space[6]})`};
    /* 마지막 섹션 padding만큼 일찍 놓아 아래 내비 경계선에 붙지 않게 한다 */
    margin-bottom: ${({ theme }) => theme.space[9]};
  }
`;

export const TocLabel = styled.p`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** 목차 레일 — 활성 막대(TocIndicator)의 기준 상자다. 링크의 offsetTop이 이 상자 기준이 된다. */
export const TocRail = styled.div`
  position: relative;
`;

/**
 * 데스크톱 레일 위 활성 막대 하나 — JS가 활성 링크의 위치(--toc-y)·높이(--toc-h)를 넣으면
 * transform(translateY + scaleY)만으로 다음 항목까지 미끄러진다. 높이 1px 상자를 세로로 늘린다.
 * 값이 들어오기 전(JS 없음 포함)에는 높이 0이라 보이지 않고, 활성 글자 굵기·번호 색이 단서로 남는다.
 * 첫 배치는 전환 없이 놓이고(data-ready 전) 그 뒤 바뀔 때부터 미끄러진다.
 */
export const TocIndicator = styled.span`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 1px;
    background: ${({ theme }) => theme.colors.accent};
    transform-origin: left top;
    transform: translateY(var(--toc-y, 0px)) scaleY(var(--toc-h, 0));
    pointer-events: none;

    &[data-ready] {
      transition: ${motionTransition("transform", "section")};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-ready] {
      transition: none;
    }
  }
`;

export const TocList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: grid;
    gap: 0;
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

/** 레일·굵기 활성 표시는 sticky 목차(데스크톱)에서만 — 인라인 pill은 차분한 점프 링크다. */
export const TocLink = styled.a<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.55em;
  padding: 0.5rem 0.9rem;
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: ${({ theme }) => theme.layout.borderWidth.control} solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition(["color", "border-color"])};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => inkLine(theme, 32)};
  }

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: grid;
    grid-template-columns: 1.75rem minmax(0, 1fr);
    gap: 0.35rem;
    padding: 0.55rem 0 0.55rem ${({ theme }) => theme.space[4]};
    border: none;
    border-radius: 0;
    font-weight: ${({ theme, $active }) =>
      $active ? theme.fonts.weights.semiBold : theme.fonts.weights.medium};
    color: ${({ theme, $active }) =>
      $active ? theme.colors.text : theme.colors.textMuted};
  }
`;

/** 번호 색만은 모든 폭에서 aria-current와 맞춘다(인라인 pill에서는 유일한 활성 단서). */
export const TocIndex = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};
  transition: ${motionTransition("color")};
`;

export const Content = styled.div`
  min-width: 0;
`;

/**
 * 섹션 간격은 gap이 아니라 각 섹션의 padding이다 — 섹션이 빈틈없이 이어져야
 * 목차 판정선이 항상 어떤 섹션에 걸리고, 마지막 padding이 다음 내비와의 간격이 된다.
 * 앵커 이동 여백은 헤더 아래 숨 고르기만 둔다 — 헤더 높이는 html의 scroll-padding-top(전역)이 이미 더한다.
 */
export const Section = styled.section`
  padding-bottom: ${({ theme }) => theme.space[9]};
  scroll-margin-top: ${({ theme }) => theme.space[5]};
`;

export const SectionHead = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

/** 섹션 라벨 — 블록 스윕 호스트라 마스크가 글자 폭만큼만 훑도록 내용 폭으로 둔다. */
export const SectionLabel = styled.p`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 0.75em;
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const SectionIndex = styled.span`
  font-variant-numeric: tabular-nums;
`;

export const SectionTitle = styled.h2`
  /* 포커스 링이 제목 글자만 감싸도록 폭을 내용에 맞춘다 */
  width: fit-content;
  max-width: 100%;
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  color: ${({ theme }) => theme.colors.text};

  /* 목차 이동 시 프로그램 포커스 — 키보드 사용자에게만 링을 보인다 */
  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
    border-radius: ${({ theme }) => theme.layout.radius.sm};
  }
`;

export const Overview = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ───────── 의사결정·역할 목록 ───────── */

export const PointList = styled.ol`
  display: grid;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.space[6]};
  }
`;

export const PointItem = styled.li`
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  align-items: baseline;
  gap: ${({ theme }) => theme.space[2]};
  padding-block: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const PointIndex = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`;

export const PointCheck = styled.span`
  display: inline-flex;
  align-self: start;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.2em;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.accent};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.accent} 14%,
    transparent
  );

  svg {
    width: 0.8rem;
    height: 0.8rem;
  }
`;

export const PointText = styled.span`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.text};
`;

/* ───────── Challenge & Solution 카드 ───────── */

export const ChallengeList = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
`;

export const ChallengeCard = styled.li`
  padding: ${({ theme }) => theme.space[6]};
  border-radius: ${({ theme }) => theme.layout.radius.lg};
  border: ${({ theme }) => theme.layout.borderWidth.card} solid ${({ theme }) => theme.colors.border};
  ${({ theme }) => cardSurface(theme)}
`;

export const CardHead = styled.h3`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

export const CardIndex = styled.span`
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`;

export const CardKicker = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Rows = styled.dl`
  display: grid;
`;

/** 문제 → 해결은 헤어라인 행, 배운 점은 카드 여백까지 번지는 액센트 틴트 블록. */
export const Row = styled.div<{ $takeaway?: boolean }>`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  padding-block: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${({ theme, $takeaway }) =>
    $takeaway
      ? `
    margin: ${theme.space[2]} calc(${theme.space[4]} * -1) 0;
    padding-inline: ${theme.space[4]};
    border-top: none;
    border-radius: ${theme.layout.radius.md};
    background: color-mix(in srgb, ${theme.colors.accent} 8%, transparent);
  `
      : ""}

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 5.5rem minmax(0, 1fr);
    gap: ${({ theme }) => theme.space[4]};
  }
`;

export const RowLabel = styled.dt<{ $takeaway?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-self: start;
  align-self: start;
  padding: 0.2rem 0.7rem;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 0;
  background: ${({ theme, $takeaway }) =>
    $takeaway ? theme.colors.accent : theme.colors.surfaceAlt};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.45;
  white-space: nowrap;
  color: ${({ theme, $takeaway }) =>
    $takeaway ? theme.colors.accentContrast : theme.colors.text};
`;

export const RowText = styled.dd<{ $tone?: "lead" | "takeaway" }>`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: ${({ theme, $tone }) =>
    $tone === "lead" ? theme.fonts.weights.medium : theme.fonts.weights.regular};
  line-height: 1.75;
  color: ${({ theme, $tone }) =>
    $tone ? theme.colors.text : theme.colors.textMuted};
`;

/* ───────── 다음 프로젝트 내비 ───────── */

/** 위 간격은 마지막 섹션 padding이 맡는다(목차 관찰 영역이 끊기지 않게 margin 없음). */
export const NextNav = styled.nav`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  padding-top: ${({ theme }) => theme.space[7]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

/**
 * 다음 프로젝트 카드 — 호버·키보드 포커스에서 테두리가 밝아지고, 제목 밑줄이 왼쪽부터 그어지며,
 * 썸네일은 목록 카드와 같이 왼쪽 기준으로 천천히 1.03까지 밀려 커진다.
 */
export const NextCard = styled(Link)`
  display: grid;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.layout.radius.lg};
  border: ${({ theme }) => theme.layout.borderWidth.card} solid ${({ theme }) => theme.colors.border};
  ${({ theme }) => cardSurface(theme)}
  color: inherit;
  text-decoration: none;
  transition: ${motionTransition("border-color")};
  ${hoverArrowParent}

  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme }) => inkLine(theme, 22)};
    }

    &:hover img {
      transform: scale(1.03);
    }
  }

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
    border-color: ${({ theme }) => inkLine(theme, 22)};
  }

  &:focus-visible img {
    transform: scale(1.03);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover img,
    &:focus-visible img {
      transform: none;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  }
`;

export const NextCopy = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  min-width: 0;
  padding: ${({ theme }) => theme.space[6]};
`;

export const NextLabel = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.75em;
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const NextCount = styled.span`
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const NextTitle = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  color: ${({ theme }) => theme.colors.text};
`;

/** 제목 글자 — 카드 호버·키보드 포커스에서 글자 폭만큼 1px 선이 왼쪽부터 그어진다(화살표 밑은 비운다). */
export const NextTitleText = styled.span`
  ${underlineSweep({ offset: "0.08em" })}
  display: inline-block;

  @media (hover: hover) {
    ${NextCard}:hover & {
      ${underlineSweepActive()}
    }
  }

  ${NextCard}:focus-visible & {
    ${underlineSweepActive()}
  }
`;

export const NextSummary = styled.span`
  display: block;
  max-width: 40ch;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: ${({ theme }) => theme.typography.bodySm.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** 모바일은 썸네일이 위, 태블릿 이상은 카피 오른쪽에 꽉 채운다. */
export const NextMedia = styled.span`
  position: relative;
  display: block;
  order: -1;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  img {
    transform-origin: left center;
    transition: ${motionTransition("transform", "reveal")};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    order: 0;
    aspect-ratio: auto;
    min-height: clamp(13rem, 24vw, 18rem);
  }
`;

/** 전체 목록 알약 — 라벨은 RollText가 굴리고 ← 화살표는 가는 쪽(왼쪽)으로 2px 물러난다. */
export const ListLink = styled(Link)`
  display: inline-flex;
  justify-self: start;
  align-items: center;
  gap: 0.5em;
  padding: 0.6rem 1.15rem;
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: ${({ theme }) => theme.layout.borderWidth.control} solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition(["color", "border-color"])};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => inkLine(theme, 30)};
  }

  &:focus-visible {
    ${({ theme }) => focusRing(theme)}
  }
`;

export const ListArrow = styled.span`
  display: inline-block;
  transition: ${motionTransition("transform")};

  @media (hover: hover) {
    ${ListLink}:hover & {
      transform: translateX(-2px);
    }
  }

  ${ListLink}:focus-visible & {
    transform: translateX(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    ${ListLink}:hover &,
    ${ListLink}:focus-visible & {
      transform: none;
    }
  }
`;

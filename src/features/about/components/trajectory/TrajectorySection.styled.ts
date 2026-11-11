/**
 * 생성 이유: Trajectory 타임라인 시각을 로직과 분리한다.
 * 역할: TrajectorySection 스타일이다.
 * 책임: 스크롤 연동 세로 레일·도트와 기간·포인트·키워드 행 그리드, 행 등장 순서, 챕터 배경을 소유한다.
 *       모바일 1열 → 태블릿 기간 | 본문 2열 → 데스크톱 기간 | 본문 | 키워드 3열로 넓어진다.
 *
 * 모션 상태는 html[data-motion]이 있을 때만 켠다(동작 줄이기·인쇄는 미디어 쿼리로 함께 제외).
 * - 모션 꺼짐(JS 없음·동작 줄이기·인쇄): 레일은 끝까지 그려지고 도트·기간은 모두 켜진 완성 상태다.
 * - 모션 켜짐: 진행선은 view timeline(미지원이면 useTrajectoryRail의 rAF)이 스크롤에 맞춰 키우고,
 *   도트·기간은 행에 data-reached가 붙을 때 켜진다. 움직임은 transform·opacity·clip-path만 쓴다.
 */
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { motionTransition, staggerChildren } from "@/components/common/motion";
import { LIGHT_MODE, motionTokens } from "@/styles/theme";

import * as P from "../../AboutPage.styled";
import { RAIL_DOT_ATTR, RAIL_SCAN_LINE } from "./useTrajectoryRail";

const MOTION_ON = "@media screen and (prefers-reduced-motion: no-preference)";

/** 진행선 타임라인 이름 — 레일 트랙이 정의하고 진행선(자식)이 쓴다 */
const RAIL_TIMELINE = "--about-trajectory-rail";

/**
 * 라인 끝이 스캔선에 머무는 진행 범위 — 트랙 윗변이 스캔선에 닿을 때 0, 아랫변이 닿을 때 1.
 * cover 0%는 트랙 윗변이 뷰포트 아래 끝에 닿는 순간, cover 100%는 아랫변이 뷰포트 위 끝을 떠나는 순간이다.
 * dvh는 IntersectionObserver 루트(현재 뷰포트)와 같은 높이라 도트 판정선과 어긋나지 않는다.
 */
const RAIL_RANGE = `cover ${Math.round((1 - RAIL_SCAN_LINE) * 100)}dvh cover calc(100% - ${Math.round(
  RAIL_SCAN_LINE * 100
)}dvh)`;

const railGrow = keyframes`
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
`;

/** 행 구분선이 등장할 때 왼쪽에서 그어진다. */
const drawDivider = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

/**
 * 진행 중 배지의 라이브 점 — 은은하게 퍼지는 링(컴포지터에서 도는 transform·opacity).
 * 메인 Close 배지의 핑과 같은 크기·길이·곡선이다(2.4s, motionTokens.curve.out).
 */
const livePulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  70%,
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
`;

export const Chapter = styled(P.Chapter)`
  background: ${({ theme }) => theme.colors.background};
`;

/** 같은 페이지 Stack 챕터 헤더와 같은 구성 — 태블릿 이상은 타이틀·부제를 같은 기준선 양끝에 둔다. */
export const Header = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[7]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    column-gap: ${({ theme }) => theme.space[5]};
  }
`;

export const Title = styled.h2`
  max-width: 18ch;
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  max-width: 36ch;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * 행 기하는 리스트의 CSS 변수 한 벌로 맞춘다.
 * --dot: 도트 지름 / --gutter: 레일 → 기간 열 거리 / --row-pad: 행 상하 여백
 * --line: 항목 제목 한 줄 높이 — 기간·도트가 제목 첫 줄 중심에 맞춰진다.
 *
 * 태블릿 이상은 열 트랙을 리스트가 정의하고 각 행이 subgrid로 나눠 쓴다.
 * 기간 열은 가장 긴 기간만큼, 키워드 열은 칩 한 줄만큼(최대 20rem) 잡히고 본문이 나머지를 쓴다.
 */
export const List = styled.ol`
  --dot: 0.5rem;
  --gutter: ${({ theme }) => theme.space[5]};
  --row-pad: ${({ theme }) => theme.space[5]};
  --line: calc(${({ theme }) => theme.typography.heading.fontSize} * 1.3);

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    --gutter: ${({ theme }) => theme.space[6]};
    --row-pad: ${({ theme }) => theme.space[6]};

    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: ${({ theme }) => theme.space[6]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: max-content minmax(0, 1fr) fit-content(20rem);
  }
`;

/**
 * 레일 트랙 — 첫 도트 중심에서 시작해 리스트 끝에서 옅어진다.
 * 진행 중인 마지막 항목 아래로 라인이 이어지다 사라져 "계속되는 궤적"을 남긴다.
 * 진행선이 쓰는 view timeline의 주체이기도 하다.
 */
export const RailTrack = styled.div`
  position: absolute;
  top: calc(var(--row-pad) + var(--line) / 2);
  bottom: 0;
  left: calc(var(--dot) / 2 - 0.5px);
  width: 1px;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 calc(100% - 5rem),
    transparent
  );
  mask-image: linear-gradient(to bottom, #000 calc(100% - 5rem), transparent);
  view-timeline: ${RAIL_TIMELINE} block;
`;

export const Rail = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.border};
`;

/**
 * 진행선 — 위에서 자라고 끝은 스캔선에 머문다.
 * 모션 꺼짐에서는 끝까지 그려진 채다. 미지원 브라우저는 useTrajectoryRail이 인라인 transform을 쓴다.
 */
export const RailProgress = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.accent};
  transform-origin: top center;

  ${MOTION_ON} {
    html[data-motion] & {
      transform: scaleY(0);
    }

    @supports (animation-timeline: view()) {
      html[data-motion] & {
        animation: ${railGrow} linear both;
        animation-timeline: ${RAIL_TIMELINE};
        animation-range: ${RAIL_RANGE};
      }
    }
  }
`;

/**
 * 행 — 화면에 들어오면 구분선이 왼쪽부터 그어지고 기간·본문·키워드가 차례로 쓸려 들어온다
 * (Reveal variant="group" + staggerChildren). 도트는 레일 위에 그대로 둔다.
 */
export const Item = styled.li`
  ${staggerChildren({ children: `> :not([${RAIL_DOT_ATTR}])` })}

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: ${({ theme }) => theme.space[2]};
  padding: var(--row-pad) 0 var(--row-pad) var(--gutter);

  /* 행 구분선 — 레일과 닿지 않도록 기간 열부터 시작한다. */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: var(--gutter);
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
    transform-origin: left center;
  }

  ${MOTION_ON} {
    html[data-motion="live"] &[data-reveal-state="pending"]::before {
      transform: scaleX(0);
    }

    html[data-motion="live"] &[data-reveal-state="in"]::before {
      animation: ${drawDivider} var(--motion-reveal) var(--motion-ease)
        var(--reveal-delay, 0s) backwards;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    row-gap: ${({ theme }) => theme.space[4]};
    align-items: start;
  }
`;

/**
 * 도트 — 라인 끝이 닿으면 채움과 은은한 링이 투명도로만 켜진다(크기 변화·튕김 없음).
 * 켜진 모양은 겹쳐 둔 ::after라 모션 꺼짐에서는 처음부터 켜져 있다.
 */
export const Dot = styled.span`
  position: absolute;
  top: calc(var(--row-pad) + (var(--line) - var(--dot)) / 2);
  left: 0;
  z-index: 1;
  width: var(--dot);
  height: var(--dot);
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.background};

  &::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 0.2rem
      color-mix(in srgb, ${({ theme }) => theme.colors.accent} 28%, transparent);
    transition: ${motionTransition("opacity")};
  }

  ${MOTION_ON} {
    html[data-motion] &::after {
      opacity: 0;
    }

    html[data-motion] [data-reached] > &::after {
      opacity: 1;
    }
  }
`;

/** 모바일은 기간·배지를 한 줄에, 태블릿 이상은 기간 열에 쌓는다. */
export const PeriodCol = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.65rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space[2]};
  }
`;

/** 기간 — 라인이 닿은 행만 액센트로 켜진다(모션 꺼짐에서는 모두 켜짐). */
export const Period = styled.p`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: var(--line);
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accent};
  transition: ${motionTransition("color")};

  ${MOTION_ON} {
    html[data-motion] & {
      color: ${({ theme }) => theme.colors.textMuted};
    }

    html[data-motion] [data-reached] & {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

export const Badge = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  width: fit-content;
  padding: 0.22rem 0.65rem 0.22rem 0.55rem;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 0;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.accent} 8%,
    transparent
  );
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.4;
  letter-spacing: 0.02em;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accent};

  /* 라이트는 틴트 위 작은 글자라 한 단계 진한 액센트로 4.5:1을 지킨다. */
  ${LIGHT_MODE} & {
    color: ${({ theme }) => theme.colors.accentSecondary};
  }

  /* 라이브 점 */
  &::before {
    content: "";
    flex-shrink: 0;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 999px;
    background: currentColor;
  }

  /* 점에서 퍼지는 링 — 점과 같은 자리에 겹쳐 두고 크기·투명도만 바꾼다 */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0.55rem;
    width: 0.375rem;
    height: 0.375rem;
    margin-top: -0.1875rem;
    border-radius: 999px;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    animation: ${livePulse} 2.4s ${motionTokens.curve.out} infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
`;

export const Copy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  min-width: 0;
`;

export const ItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1.3;
  letter-spacing: ${({ theme }) => theme.typography.heading.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Points = styled.ul`
  display: grid;
  gap: 0.35rem;
`;

export const Point = styled.li`
  position: relative;
  padding-left: 0.95rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.68em;
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.accent};
  }
`;

/** 키워드 — 태블릿은 본문 아래, 데스크톱은 오른쪽 열 첫 줄에 오른쪽 정렬로 둔다. */
export const Keywords = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  min-width: 0;
  margin-top: ${({ theme }) => theme.space[1]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-column: 2;
    margin-top: 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-column: 3;
    grid-row: 1;
    justify-content: flex-end;
    align-content: flex-start;
  }
`;

export const Keyword = styled.li`
  padding: 0.24rem 0.65rem;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 0;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  line-height: 1.4;
  letter-spacing: 0.02em;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textMuted};
`;

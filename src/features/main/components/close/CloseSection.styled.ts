/**
 * 생성 이유: Contact 마무리 장면 시각을 로직과 분리한다.
 * 역할: 섹션 헤더 정렬과 세로형 앞·뒷면 명함 목업 스타일을 정의한다.
 * 책임: 모드별 명함 면(라이트=용지, 다크=서피스)·두께·그림자, 아치 초상 액자,
 *       뒷면 정보 위계(배지·이름·작업·채널·CTA)와 카드 내부 간격 체계,
 *       명함 등장 스윕·가용 배지 신호(About Trajectory와 같은 사양)·채널 행 밑줄·CTA 호버 시각만 소유한다.
 *       (등장 판정은 공용 Reveal)
 *       모드별 차이는 기본(다크) 값 뒤에 LIGHT_MODE 선택자로 덮는다 — 서버 HTML은 모드와 무관하다.
 */
import { css, keyframes, type Theme } from "@emotion/react";
import styled from "@emotion/styled";

import {
  hoverArrowCss,
  hoverArrowParent,
} from "@/components/common/hoverArrow/HoverArrow.styled";
import {
  motionTransition,
  underlineSweep,
  underlineSweepActive,
} from "@/components/common/motion";
import { LIGHT_MODE, motionTokens } from "@/styles/theme";
import { Section as SectionBase } from "../shared/SectionPrimitives.styled";

/* 라이트 모드 용지 톤 — 캔버스(#f3f3f4) 위에서 한 장의 종이로 읽히는 값이다. */
const paper = "#f6f6f6";
const paperLit = "#fcfcfc";
const paperShade = "#ececec";

/**
 * 명함 등장 — 공용 sweep과 같은 문법(왼쪽부터 열리는 마스크 + 짧은 가로 미끄러짐)이지만,
 * 마스크 상자를 카드 밖으로 넓혀(-SHADOW_ROOM) 두께 단차·바닥 그림자까지 함께 열린다.
 * 공용 sweep(inset 0)을 쓰면 그림자가 끝날 때 한 번에 튀어나온다.
 * 시작 상태는 오른쪽 inset을 폭 + 여유만큼 줘 왼쪽 그림자 띠도 남지 않게 완전히 닫는다.
 */
const SHADOW_ROOM = "4.5rem";

const cardSweep = keyframes`
  from {
    clip-path: inset(
      -${SHADOW_ROOM} calc(100% + ${SHADOW_ROOM}) -${SHADOW_ROOM} -${SHADOW_ROOM}
    );
    transform: translateX(var(--motion-sweep-x));
  }
  to {
    clip-path: inset(
      -${SHADOW_ROOM} -${SHADOW_ROOM} -${SHADOW_ROOM} -${SHADOW_ROOM}
    );
    transform: none;
  }
`;

/*
 * 카드 내부 간격 체계. 카드 폭(18.5rem)이 rem으로 스케일하므로 내부도 rem으로 맞춘다.
 * - pad: 카드 안쪽 여백(앞·뒷면 공통)
 * - item: 한 묶음 안의 행 사이
 * - block: 묶음 머리(규칙선·라벨)와 내용 사이
 * - group: 묶음 사이 최소 간격 — 남는 높이는 묶음 사이에 균등하게 나눈다
 */
const cardSpace = {
  pad: "1.6rem",
  item: "0.45rem",
  block: "0.85rem",
  group: "1.4rem",
} as const;

/*
 * 카드 안 작은 글자 크기. 카드처럼 rem으로 스케일하되, 폰에서 rem 기준이 14px까지 내려가도
 * 대문자 꼬리표(tag·head)는 11px, 읽는 글자(text·value)는 12px 아래로 내려가지 않게 하한을 둔다
 * (사이트 공통 타이포 하한과 같은 값). 넓은 화면에서는 rem 값이 하한보다 커서 크기가 그대로다.
 */
const cardType = {
  tag: "max(0.66rem, 11px)",
  head: "max(0.7rem, 11px)",
  text: "max(0.82rem, 12px)",
  value: "max(0.8rem, 12px)",
} as const;

/** 다크: 서피스 톤 면 + 윗변 하이라이트·헤어라인 / 라이트: 기존 용지 면. 두께(좌하단 단차)는 공통이다. */
const cardFace = (theme: Theme) => css`
  background:
    radial-gradient(
      120% 60% at 50% 0%,
      rgb(255 255 255 / 4%) 0%,
      transparent 62%
    ),
    linear-gradient(
      160deg,
      ${theme.colors.surfaceAlt} 0%,
      ${theme.colors.surface} 58%,
      #0d0d0d 100%
    );
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 9%),
    inset 0 0 0 1px rgb(255 255 255 / 6%),
    -1px 1px 0 #2b2b2b,
    -2px 2px 0 #262626,
    -3px 3px 0 #212121,
    -4px 4px 0 #1c1c1c,
    -16px 22px 40px rgb(0 0 0 / 65%);

  ${LIGHT_MODE} & {
    background: linear-gradient(
      135deg,
      ${paperLit} 0%,
      ${paper} 58%,
      ${paperShade} 100%
    );
    box-shadow:
      inset 1px 1px 0 rgb(255 255 255 / 78%),
      inset -1px -1px 0 rgb(0 0 0 / 7%),
      -1px 1px 0 #d8d8da,
      -2px 2px 0 #d4d4d6,
      -3px 3px 0 #d0d0d2,
      -4px 4px 0 #cbcbcd,
      -10px 14px 22px rgb(0 0 0 / 40%),
      -20px 26px 38px rgb(0 0 0 / 26%);
  }
`;

/**
 * 공용 섹션 골격(여백·배경)을 쓰되, 바로 푸터가 이어지는 마지막 장면이라
 * 아래 여백을 줄인다. 챕터 높이는 컴포넌트가 $fit으로 끈다(세로로 긴 화면에서 빈 띠가 생기지 않게).
 */
export const Section = styled(SectionBase)`
  padding-bottom: ${({ theme }) => theme.space[8]};
`;

/** 타이틀과 보조 문구를 같은 기준선에 둔다 — Stack·Blog 헤더와 같은 구성이다. */
export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  column-gap: ${({ theme }) => theme.space[5]};
  row-gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const Aside = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};

  /* 타이틀이 짧아 한 줄에 들어가더라도, 폰에서는 다른 섹션처럼 타이틀 아래로 내린다 */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-basis: 100%;
  }
`;

/** 두 장이 나란히 들어가지 않는 폭에서는 줄바꿈으로 자연스럽게 세로로 쌓인다. */
export const Deck = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: ${({ theme }) => theme.space[6]};
`;

/**
 * 명함 한 장 — Reveal(group) 호스트. 대기 중에는 투명도로만 가리고(IntersectionObserver가 상자를 그대로 본다),
 * 등장 때 cardSweep이 컨트롤러 지연(--reveal-delay)으로 시작한다. 나란히 들어오면 앞면 → 뒷면 순서다.
 * 규칙은 screen·동작 허용·live 안에만 있어 JS 없음·인쇄·동작 줄이기에서는 처음부터 보인다.
 */
export const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(18.5rem, 100%);
  aspect-ratio: 50 / 90;
  padding: ${cardSpace.pad};
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => cardFace(theme)}

  /* 폰에서는 두 장이 세로로 쌓이므로 비율을 조금 낮춰 카드 안 빈 높이를 줄인다(내용이 길면 카드가 늘어난다) */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    aspect-ratio: 50 / 80;
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion="live"] &[data-reveal-state="pending"] {
      opacity: 0;
    }

    html[data-motion="live"] &[data-reveal-state="in"] {
      animation: ${cardSweep} var(--reveal-duration, var(--motion-reveal))
        var(--motion-ease) var(--reveal-delay, 0s) backwards;
    }
  }
`;

export const Front = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  /* 다크: 아치 뒤에 아주 옅은 조명을 깔아 흰 배경 사진이 '조명받는 액자'로 읽히게 한다 */
  background: radial-gradient(
    ellipse 72% 46% at 50% 42%,
    rgb(255 255 255 / 5%) 0%,
    transparent 70%
  );

  ${LIGHT_MODE} & {
    background: none;
  }
`;

/** 흑백 증명사진(흰 배경)을 아치에 담고, 바깥 헤어라인을 한 겹 더 둘러 액자처럼 마감한다. */
export const Arch = styled.div`
  position: relative;
  width: 70%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 50% 50% 0.12rem 0.12rem / 32% 32% 0.12rem 0.12rem;
  /* 배경을 두지 않는다 — 밝은 배경이 어두운 수트 아래 가장자리로 번져 보이는 것을 막는다 */
  outline: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.text} 20%, transparent);
  outline-offset: 0.4rem;

  img {
    object-fit: cover;
    object-position: center 36%;
    /* 다크에서는 흰 배경이 눈부시지 않도록 한 톤 낮춘다 */
    filter: grayscale(1) contrast(1.04) brightness(0.92);
    transform: scale(1.08);
    transform-origin: center 20%;
  }

  ${LIGHT_MODE} & {
    outline-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 14%,
      transparent
    );

    img {
      filter: grayscale(1) contrast(1.04);
    }
  }
`;

export const Quote = styled.p`
  display: grid;
  justify-items: center;
  gap: 0.08rem;
  width: 100%;
  font-size: 0.92rem;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: 1.45;
  letter-spacing: -0.02em;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};

  span {
    display: block;
  }
`;

/** 세 묶음(정체성·작업·연락)을 위·가운데·아래에 두고 남는 높이를 묶음 사이에 균등 분배한다. */
export const Back = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: ${cardSpace.group};
`;

export const Identity = styled.div`
  display: grid;
  justify-items: start;
  gap: 0.4rem;
`;

/**
 * 가용 배지 점의 신호 — 사이트의 반복 원형 모션(라이브 점)은 이 배지와 About Trajectory의 진행 중 점 둘뿐이라
 * 같은 사양(키프레임·2.4s·ease.out 곡선)을 쓴다. 바꾸면 두 곳을 함께 바꾼다.
 */
const livePing = keyframes`
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

export const Badge = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.8rem;
  padding: 0.32rem 0.72rem 0.32rem 0.6rem;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.accent} 40%, transparent);
  border-radius: 999px;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.accent} 8%,
    transparent
  );
  font-size: ${cardType.tag};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.2;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};

  ${LIGHT_MODE} & {
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.accent} 45%,
      transparent
    );
    background: transparent;
  }
`;

export const BadgeDot = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: currentColor;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: inherit;
    opacity: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    &::after {
      animation: ${livePing} 2.4s ${motionTokens.curve.out} infinite;
    }
  }
`;

export const Name = styled.h3`
  font-size: 2.35rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.text};
`;

export const Role = styled.p`
  font-size: 0.92rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** 규칙선 + 묶음 머리 + 내용. 작업·연락 묶음이 같은 리듬을 공유한다. */
export const Group = styled.div`
  display: grid;
  gap: ${cardSpace.block};
  padding-top: ${cardSpace.block};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const GroupHead = styled.p`
  font-size: ${cardType.head};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1.4;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

export const GroupSep = styled.span`
  font-weight: ${({ theme }) => theme.fonts.weights.regular};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const WorksList = styled.ul`
  display: grid;
  gap: ${cardSpace.item};
`;

export const WorksItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  font-size: ${cardType.text};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text};
`;

export const WorksIndex = styled.span`
  flex-shrink: 0;
  min-width: 1.1rem;
  font-size: ${cardType.tag};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Contacts = styled.ul`
  display: grid;
  gap: ${cardSpace.item};
`;

export const RowLabel = styled.span`
  font-size: ${cardType.tag};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};
`;

/**
 * 채널 주소 — 상자를 글자 폭에 맞춰(justify-self: start) 밑줄이 주소 아래에만 그어진다.
 * 밑줄은 행(Row)의 호버·키보드 포커스로 왼쪽부터 그어지고 떠날 때 오른쪽으로 빠진다(currentColor라 액센트로 바뀐 글자색을 따른다).
 */
export const RowValue = styled.span`
  ${underlineSweep()}
  justify-self: start;
  min-width: 0;
  font-size: ${cardType.value};
  line-height: 1.5;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
  color: ${({ theme }) => theme.colors.text};
  transition: ${motionTransition("color")};
`;

export const RowArrow = styled.span`
  ${hoverArrowCss}
  margin-left: 0;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.6;
  transition: ${motionTransition(["color", "opacity", "transform"])};
`;

/** 채널 행이 켜진 상태(호버·키보드 포커스) — 주소 밑줄·색, 라벨 색, 화살표 */
const rowActive = (theme: Theme) => css`
  ${RowValue} {
    color: ${theme.colors.accent};
    ${underlineSweepActive()}
  }

  ${RowLabel} {
    color: ${theme.colors.text};
  }

  ${RowArrow} {
    color: ${theme.colors.accent};
    opacity: 1;
  }
`;

export const Row = styled.a`
  position: relative;
  display: grid;
  grid-template-columns: 4.4rem minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 0.6rem;
  min-height: 44px;
  border-radius: 0.2rem;
  ${hoverArrowParent}

  @media (hover: hover) {
    &:hover {
      ${({ theme }) => rowActive(theme)}
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 0.3rem;
    ${({ theme }) => rowActive(theme)}
  }
`;

/**
 * 카드 안에 맞춘 크기의 주 CTA — 색은 공용 CtaButton과 같다.
 * 호버·키보드 포커스에서 면 색만 바뀌고, 라벨은 안쪽 RollText가 가로로 굴린다(들림·눌림 크기 변화 없음).
 */
export const Cta = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 44px;
  margin-top: 0.3rem;
  padding: 0.72rem 1.05rem 0.72rem 1.15rem;
  border-radius: 999px;
  font-size: ${cardType.value};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.accentContrast};
  background: ${({ theme }) => theme.colors.accent};
  transition: ${motionTransition("background-color")};
  ${hoverArrowParent}

  [data-hover-arrow] {
    margin-left: 0;
  }

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.accentSecondary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const CopyButton = styled.button`
  width: 100%;
  min-height: 44px;
  margin-top: 0.4rem;
  padding: 0.6rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: 999px;
  font: inherit;
  font-size: ${cardType.value};
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  cursor: pointer;
  transition: ${motionTransition(["color", "border-color"])};

  &:hover { color: ${({ theme }) => theme.colors.accent}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const CopyStatus = styled.p`
  min-height: 2.8em;
  margin-top: 0.4rem;
  font-size: ${cardType.text};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** 화면에는 숨기고 스크린리더에만 읽히는 보조 문구. */
export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;

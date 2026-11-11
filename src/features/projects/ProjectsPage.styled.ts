/**
 * 생성 이유: 프로젝트 목록 스타일을 분리한다.
 * 역할: ProjectsPage 케이스 카드 쇼케이스 스타일을 정의한다.
 * 책임: 히어로·16:9 인셋 미디어·카드 메타/카피 위계·호버/포커스 시각만 소유한다.
 *       카드 전체 클릭은 제목 링크의 ::after(스트레치 링크)가 맡고, 호버·키보드 포커스는 카드가 함께 받는다
 *       — 이미지는 왼쪽 기준으로 천천히 1.03까지 밀려 커지고, CTA 라벨은 RollText로 가로로 굴러간다.
 */
import type { Theme } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import {
  motionTransition,
  rollTextParent,
} from "@/components/common/motion";
import { LIGHT_MODE } from "@/styles/theme";

/** 본문 잉크(text)를 농도만큼 섞은 색 — 테두리·구분선·보조 라벨에 쓴다. */
const ink = (theme: Theme, percent: number) =>
  `color-mix(in srgb, ${theme.colors.text} ${percent}%, transparent)`;

/**
 * 커튼 리빌 색을 이 페이지 면(background)과 같은 선언에서 준다 — 면 색이 바뀌면 덮개도 함께 바뀐다
 * (전역 --motion-canvas와 같은 값이지만, 페이지 면에 직접 묶어 둔다).
 */
export const Wrapper = styled.div`
  --reveal-curtain: ${({ theme }) => theme.colors.background};

  width: 100%;
  padding-top: clamp(5rem, 3rem + 8vw, 9rem);
  padding-bottom: ${({ theme }) => theme.space[9]};
  padding-inline: ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Intro = styled.header`
  margin-bottom: ${({ theme }) => theme.space[8]};
  max-width: 40rem;
`;

/** 페이지 라벨 */
export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: clamp(2.4rem, 1.4rem + 4vw, 4.25rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.035em;
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  max-width: 36rem;
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * 모바일 1열 세로 카드 → 태블릿·소형 데스크톱 2열 세로 카드 → wide 1열 가로 카드.
 * 1280px 미만에서는 16:9 미디어 옆 텍스트 열이 이미지보다 길어져 세로 카드로 둔다.
 */
export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.wide}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

/**
 * 카드 한 칸 — 리빌(sweep) 호스트다. content-visibility: auto는 두지 않는다:
 * 크롬은 호스트가 리빌 clip-path로 잘려 있는 동안 그 하위를 계속 건너뛰어(칠하지 않아)
 * 카드가 스윕 내내 비어 있다가 끝에 한 번에 나타났다.
 */
export const Item = styled.li`
  display: flex;
`;

/**
 * 카드 호버·키보드 포커스 공통 상태 — 테두리·면만 밝힌다(들림·크기 변화 없음).
 * 면 색은 지역 변수로 바꾼다 — 모드는 Card의 LIGHT_MODE 규칙이 변수 값으로 가른다(라이트는 활성도 흰 서피스).
 */
const cardActive = (theme: Theme) => `
  border-color: ${theme.colors.borderStrong};
  background: var(--card-face-active);
`;

/**
 * 카드 면 — 링크가 아니라 제목 링크(CardLink)를 품은 상자다.
 * 호버·안쪽 링크의 키보드 포커스(:has)에 테두리·면·화살표·CTA 롤이 같이 반응한다.
 */
export const Card = styled.div`
  --card-pad: 0.5rem;
  --card-radius: ${({ theme }) => theme.layout.radius.lg};
  /* 면: 다크는 캔버스보다 살짝 밝은 wash, 켜지면 잉크 5%를 섞는다 / 라이트는 늘 흰 서피스 */
  --card-face: ${({ theme }) => theme.colors.wash};
  --card-face-active: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text} 5%,
    ${({ theme }) => theme.colors.background}
  );

  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  width: 100%;
  padding: var(--card-pad);
  border-radius: var(--card-radius);
  border: ${({ theme }) => theme.layout.borderWidth.card} solid ${({ theme }) => theme.colors.border};
  background: var(--card-face);
  transition: ${motionTransition(["border-color", "background-color"])};
  ${hoverArrowParent}
  ${rollTextParent}

  ${LIGHT_MODE} & {
    --card-face: ${({ theme }) => theme.colors.surface};
    --card-face-active: ${({ theme }) => theme.colors.surface};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.wide}) {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    grid-template-rows: auto;
  }

  @media (hover: hover) {
    &:hover {
      ${({ theme }) => cardActive(theme)}
    }
  }

  /* 포커스는 제목 링크가 받고 링은 카드 테두리를 따라 그린다(:has 미지원이면 링크 자신의 전역 링). */
  @supports selector(:has(*)) {
    &:has(:focus-visible) {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 3px;
      ${({ theme }) => cardActive(theme)}
    }
  }
`;

/**
 * 제목 링크 — ::after가 카드 전체를 덮어 어디를 눌러도 상세로 간다(스트레치 링크).
 * 링크 이름은 보이는 제목 그대로라 화면 낭독·음성 명령이 같은 이름을 쓴다.
 * 카드 안 다른 요소에는 z-index를 주지 않아 덮개가 늘 맨 위에 있다.
 */
export const CardLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &::after {
    content: "";
    position: absolute;
    inset: -1px;
    z-index: 1;
    border-radius: var(--card-radius);
  }

  @supports selector(:has(*)) {
    &:focus-visible {
      outline: none;
    }
  }
`;

/**
 * 썸네일 원본(16:9 ~ 1.92:1)에 맞춘 16:9 인셋 미디어 — 이미지에 박힌 문구가 잘리지 않는다.
 * 1.9:1 썸네일은 좌우 가장자리 약 3.5%(장식·여백)만 덜어 내 카드 높이를 고르게 맞추고,
 * 가장자리에 문구가 있는 썸네일은 $matte(가장자리 색)로 contain 레터박스한다.
 */
export const Media = styled.div<{ $matte?: string }>`
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: max(
    0px,
    calc(var(--card-radius) - var(--card-pad) - ${({ theme }) => theme.layout.borderWidth.card})
  );
  background: ${({ theme, $matte }) => $matte ?? theme.colors.surfaceAlt};

  /* 호버 줌은 왼쪽 가장자리를 기준으로 천천히(리빌 길이) — 그림이 읽는 방향으로 살짝 밀려 난다. */
  img {
    transform-origin: left center;
    transition: ${motionTransition("transform", "reveal")};
  }

  /* 텍스트 열이 더 길어지면 이미지는 메타 줄과 윗선을 맞춘다. */
  @media (min-width: ${({ theme }) => theme.breakpoints.wide}) {
    align-self: start;
  }

  @media (hover: hover) {
    ${Card}:hover & img {
      transform: scale(1.03);
    }
  }

  ${Card}:has(:focus-visible) & img {
    transform: scale(1.03);
  }

  @media (prefers-reduced-motion: reduce) {
    ${Card}:hover & img,
    ${Card}:has(:focus-visible) & img {
      transform: none;
    }
  }
`;

export const Copy = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  min-width: 0;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[2]}
    ${({ theme }) => theme.space[2]};

  /* 가로 카드: 메타 줄 윗선·CTA 밑선을 이미지 위·아래 모서리에 맞춘다. */
  @media (min-width: ${({ theme }) => theme.breakpoints.wide}) {
    padding: 0 ${({ theme }) => theme.space[4]} 0
      ${({ theme }) => theme.space[6]};
  }
`;

export const Head = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

export const Index = styled.span`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Facts = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.375rem;
`;

export const Fact = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 0;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: ${({ theme }) => theme.typography.small.lineHeight};
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

/** 역할은 제목과 한 덩어리(정체성)로 읽히도록 하단 TAKEAWAY 라벨보다 한 단계 밝게 둔다. */
export const Role = styled.p`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: ${({ theme }) => theme.typography.label.lineHeight};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => ink(theme, 78)};
`;

export const ItemTitle = styled.h2`
  font-size: clamp(1.5rem, 1.15rem + 1.1vw, 2.1rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.text};
`;

export const ItemSummary = styled.p`
  margin-top: ${({ theme }) => theme.space[3]};
  max-width: 34rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: ${({ theme }) => theme.typography.bodySm.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
  text-wrap: pretty;
`;

export const Foot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Result = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  padding-top: ${({ theme }) => theme.space[3]};
  border-top: 1px solid ${({ theme }) => ink(theme, 10)};
`;

export const ResultLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: ${({ theme }) => theme.typography.small.lineHeight};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ResultText = styled.p`
  max-width: 34rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: ${({ theme }) => theme.typography.bodySm.lineHeight};
  color: ${({ theme }) => theme.colors.text};
  text-wrap: pretty;
`;

/** 보이는 행동 유도 — 라벨은 RollText(카드의 rollTextParent가 굴린다), 색은 액센트로 바뀐다. */
export const Cta = styled.span`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  transition: ${motionTransition("color")};

  @media (hover: hover) {
    ${Card}:hover & {
      color: ${({ theme }) => theme.colors.accent};
    }
  }

  ${Card}:has(:focus-visible) & {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

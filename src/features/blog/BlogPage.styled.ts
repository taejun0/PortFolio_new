/**
 * 생성 이유: 블로그 목록 스타일을 분리한다.
 * 역할: BlogPage 레이아웃·리스트·우측 썸네일 스타일을 정의한다.
 * 책임: 다크 톤 목록과 미리보기 썸네일, 카드 모양 포커스 링, 호버·키보드 포커스 시각만 소유한다.
 *       카드 호버·포커스는 메인 Articles 행과 같은 조합(공용 underlineSweep·hoverArrowParent)이다 —
 *       카드 아래 테두리를 따라 액센트 선이 왼쪽부터 그어지고, 제목이 오른쪽으로 살짝 밀리며,
 *       메타가 밝아지고 화살표가 ↗로 바뀐다. 썸네일은 흐림이 걷히며 왼쪽 기준으로 천천히 1.03까지 커진다(튀는 확대 없음).
 */
import { css, type Theme } from "@emotion/react";
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import {
  motionTransition,
  underlineSweep,
  underlineSweepActive,
} from "@/components/common/motion";

/** 호버 때 제목이 밀리는 거리 — 메인 Articles 행과 같은 값 */
const TITLE_NUDGE = "0.4rem";

/** 본문 잉크(text)를 농도만큼 섞은 색 — 카드 테두리·면에 쓴다. */
const ink = (theme: Theme, percent: number) =>
  `color-mix(in srgb, ${theme.colors.text} ${percent}%, transparent)`;

/**
 * 커튼 리빌(페이지 제목) 색을 이 페이지 면과 같은 선언에서 준다 — 면 색이 바뀌면 덮개도 함께 바뀐다
 * (전역 --motion-canvas와 같은 값이지만, 페이지 면에 직접 묶어 둔다).
 */
export const Wrapper = styled.div`
  --reveal-curtain: ${({ theme }) => theme.colors.background};

  width: 100%;
  padding-top: ${({ theme }) => theme.layout.sectionPaddingY};
  padding-bottom: ${({ theme }) => theme.space[6]};
  padding-inline: ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

/** 페이지 라벨 */
export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Hint = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Row = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr) minmax(10rem, 13.5rem);
  }
`;

export const Copy = styled.div`
  min-width: 0;
`;

export const Index = styled.p`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.accent};
`;

/** 제목 — 글자색은 그대로(모노톤) 두고 켜질 때 가로로만 살짝 밀린다. 끝의 화살표는 평소 흐리게 둔다. */
export const ItemTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
  transition: ${motionTransition("transform")};

  [data-hover-arrow] {
    color: ${({ theme }) => theme.colors.textMuted};
    transition: ${motionTransition(["color", "transform"])};
  }
`;

export const ItemDescription = styled.p`
  margin-bottom: ${({ theme }) => theme.space[3]};
  max-width: ${({ theme }) => theme.layout.measure};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Meta = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};
`;

/**
 * 미리보기 썸네일 — 평소엔 흐리게(0.62) 두어 목록을 모노톤으로 유지한다.
 * 크기 차이는 transform이 아니라 폭으로 준다(이전 scale(0.96)과 같은 크기).
 */
export const Thumb = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: clamp(9.6rem, 21.1vw, 12.96rem);
  aspect-ratio: 16 / 10;
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  opacity: 0.62;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  transition: ${motionTransition(["opacity", "border-color"])};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform-origin: left center;
    transition: ${motionTransition("transform", "reveal")};
  }
`;

export const ThumbWrap = styled.div`
  display: none;
  justify-content: flex-end;
  align-self: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

/** 카드가 켜진 상태(호버·안쪽 링크의 키보드 포커스) */
const itemActive = (theme: Theme) => css`
  ${underlineSweepActive()}
  border-color: ${ink(theme, 12)};
  background: ${ink(theme, 4.5)};

  ${ItemTitle} {
    transform: translateX(${TITLE_NUDGE});
  }

  ${ItemTitle} [data-hover-arrow] {
    color: ${theme.colors.accent};
  }

  ${Meta} {
    color: ${theme.colors.text};
  }

  ${Thumb} {
    opacity: 1;
    border-color: ${ink(theme, 18)};
  }

  ${Thumb} img {
    transform: scale(1.03);
  }

  /* 동작 줄이기: 제목·썸네일은 제자리에 두고 선·색만 바뀐다 */
  @media (prefers-reduced-motion: reduce) {
    ${ItemTitle}, ${Thumb} img {
      transform: none;
    }
  }
`;

/**
 * 카드 한 칸 — Reveal(sweep) 호스트다. 아래 테두리 위에 겹쳐 그어지는 1px 액센트 선은
 * 공용 underlineSweep의 전폭 변형이며, 둥근 모서리를 피해 곧은 구간(radius 안쪽)에만 그어진다.
 */
export const Item = styled.li`
  ${({ theme }) =>
    underlineSweep({
      inset: `auto ${theme.layout.radius.md} -1px ${theme.layout.radius.md}`,
      color: theme.colors.accent,
    })}
  padding: ${({ theme }) => theme.space[5]};
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => ink(theme, 2)};
  transition: ${motionTransition(["border-color", "background-color"])};
  ${hoverArrowParent}

  a {
    display: block;
    -webkit-tap-highlight-color: transparent;
  }

  @media (hover: hover) {
    &:hover {
      ${({ theme }) => itemActive(theme)}
    }
  }

  /*
   * 키보드 포커스 링은 안쪽 블록 링크가 아니라 둥근 카드 테두리를 따라 그린다.
   * :has() 미지원 브라우저는 전역 링(링크 자체)을 그대로 쓴다.
   */
  @supports selector(:has(*)) {
    a:focus-visible {
      outline: none;
    }

    &:has(a:focus-visible) {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 3px;
      ${({ theme }) => itemActive(theme)}
    }
  }
`;

/**
 * 블로그 목록은 제목·요약 중심의 얇은 행으로 구성한다.
 * 썸네일이 있는 행만 이미지 열을 만들고, 링크가 행 전체의 클릭·포커스를 받는다.
 */
import { css, type Theme } from "@emotion/react";
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import {
  motionTransition,
  underlineSweep,
  underlineSweepActive,
} from "@/components/common/motion";

export const Wrapper = styled.div`
  --reveal-curtain: ${({ theme }) => theme.colors.background};
  width: 100%;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter} ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 64rem;
  margin-inline: auto;
`;

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
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const List = styled.ul`
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Row = styled.div<{ $hasThumbnail: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1.25rem;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: ${({ $hasThumbnail }) => $hasThumbnail
      ? "minmax(0, 1fr) 11rem 1.25rem"
      : "minmax(0, 1fr) 1.25rem"};
    gap: ${({ theme }) => theme.space[6]};
  }
`;

export const Copy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
`;

export const Meta = styled.p`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.3rem ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textMuted};

  time { white-space: nowrap; }
`;

export const Index = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Tags = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`;

export const ItemTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.45;
  letter-spacing: ${({ theme }) => theme.typography.heading.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
  transition: ${motionTransition("transform")};
`;

export const ItemDescription = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-width: ${({ theme }) => theme.layout.measure};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ThumbWrap = styled.div`
  display: none;
  min-width: 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) { display: block; }
`;

export const Thumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  background: ${({ theme }) => theme.colors.surfaceAlt};

  img {
    object-fit: cover;
    transition: ${motionTransition("transform", "reveal")};
  }
`;

export const Arrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};
  [data-hover-arrow] { margin-left: 0; }
`;

const rowActive = (theme: Theme) => css`
  ${underlineSweepActive()}
  background: color-mix(in srgb, ${theme.colors.text} 3%, transparent);
  ${Arrow} { color: ${theme.colors.accent}; }
  ${ItemTitle} { transform: translateX(0.25rem); }
  ${Thumb} img { transform: scale(1.02); }
  @media (prefers-reduced-motion: reduce) {
    ${ItemTitle}, ${Thumb} img { transform: none; }
  }
`;

export const Item = styled.li`
  min-width: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  > a {
    ${({ theme }) => underlineSweep({ inset: "auto 0 -1px 0", color: theme.colors.accent })}
    display: block;
    min-height: 44px;
    padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[3]};
    transition: ${motionTransition("background-color")};
    -webkit-tap-highlight-color: transparent;
    ${hoverArrowParent}

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
    }
    @media (hover: hover) {
      &:hover { ${({ theme }) => rowActive(theme)} }
    }
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: -2px;
      ${({ theme }) => rowActive(theme)}
    }
  }
`;

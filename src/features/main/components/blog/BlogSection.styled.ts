/**
 * 생성 이유: 메인 블로그 티저 스타일을 분리한다.
 * 역할: Articles 헤더·행 리스트 스타일을 정의한다.
 * 책임: 날짜·제목·화살표 행 시각만 소유한다.
 */
import styled from "@emotion/styled";

import {
  hoverArrowCss,
  hoverArrowParent,
} from "@/components/common/hoverArrow/HoverArrow.styled";

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const Aside = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Stats = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const PostList = styled.ul`
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Arrow = styled.span`
  ${hoverArrowCss}
  margin-left: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1em;
  min-width: 1em;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.55;
  transition:
    color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const PostCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  min-width: 0;
`;

export const PostNote = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const PostMeta = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const PostItem = styled.li`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  ${hoverArrowParent}

  a {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "meta arrow"
      "copy copy";
    align-items: start;
    gap: ${({ theme }) => theme.space[2]};
    padding: ${({ theme }) => theme.space[5]}
      clamp(0.75rem, 0.55rem + 0.75vw, 1.25rem);
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: color-mix(
        in srgb,
        ${({ theme }) => theme.colors.accent}
          ${({ theme }) => (theme.mode === "dark" ? "7%" : "5%")},
        transparent
      );
      transform: scaleX(0);
      transform-origin: right center;
      transition: transform 0.62s cubic-bezier(0.22, 1, 0.36, 1);
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      grid-template-columns: clamp(5.5rem, 12vw, 7.5rem) 1fr auto;
      grid-template-areas: "meta copy arrow";
      align-items: baseline;
      gap: ${({ theme }) => theme.space[5]};
    }
  }

  ${PostMeta} {
    grid-area: meta;
  }

  ${PostCopy} {
    grid-area: copy;
  }

  ${Arrow} {
    grid-area: arrow;
    justify-self: end;
    align-self: start;
  }

  &:hover a::before,
  &:focus-within a::before {
    transform: scaleX(1);
    transform-origin: left center;
  }

  &:hover ${PostTitle},
  &:focus-within ${PostTitle} {
    color: ${({ theme }) => theme.colors.accent};
    opacity: 1;
  }

  &:hover ${PostMeta},
  &:focus-within ${PostMeta},
  &:hover ${PostNote},
  &:focus-within ${PostNote} {
    color: ${({ theme }) => theme.colors.text};
    opacity: 1;
  }

  &:hover ${Arrow},
  &:focus-within ${Arrow} {
    color: ${({ theme }) => theme.colors.accent};
    opacity: 1;
  }

  a:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    a::before {
      transition: none;
    }
  }
`;

export const Empty = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CtaWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};

  a span {
    margin-top: 0;
  }
`;

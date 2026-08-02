/**
 * 생성 이유: Process식 가로 아코디언 책장 패널 스타일을 분리한다.
 * 역할: ProjectShelfItem 접힘/펼침 시각을 정의한다.
 * 책임: spine·패널 비율·세로 라벨·미디어 오버레이만 소유한다.
 */
import styled from "@emotion/styled";
import Link from "next/link";

export const Spine = styled.div<{ $expanded: boolean }>`
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.layout.radius.lg};
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.text} 8%, transparent);
  background: ${({ theme }) => theme.colors.surfaceAlt};
  transition:
    flex-grow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    flex-basis 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    min-height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  ${({ $expanded, theme }) =>
    $expanded
      ? `
    flex: 1 1 auto;
    min-height: clamp(16rem, 48vh, 22rem);
  `
      : `
    flex: 0 0 auto;
    min-height: 3.75rem;
    cursor: pointer;

    &:hover {
      background: color-mix(in srgb, ${theme.colors.surfaceAlt} 80%, ${theme.colors.text} 8%);
    }
  `}

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 0;
    height: 100%;

    ${({ $expanded }) =>
      $expanded
        ? `
      flex: 1 1 0%;
      min-width: 0;
    `
        : `
      flex: 0 0 clamp(4.25rem, 6.5vw, 5.75rem);
      width: clamp(4.25rem, 6.5vw, 5.75rem);
    `}
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
  }
`;

export const Collapsed = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
  width: 100%;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[2]};
  }
`;

export const SpineLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;

  /*
   * writing-mode만 사용. rotate(180deg)는 한글 글리프를 뒤집고,
   * 영문 sideways 느낌은 vertical-rl 기본 방향으로 충분하다.
   */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: calc(100% - 3rem);
    overflow: hidden;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: ${({ theme }) => theme.typography.small.fontSize};
  }
`;

export const IndexPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 2.35rem;
  height: 2.1rem;
  padding: 0 0.55rem;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.text} 14%, transparent);
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) =>
    theme.mode === "light"
      ? `color-mix(in srgb, ${theme.colors.surface} 82%, transparent)`
      : `color-mix(in srgb, ${theme.colors.background} 55%, transparent)`};
  backdrop-filter: blur(8px);
`;

export const PanelLink = styled(Link)`
  position: absolute;
  inset: 0;
  display: block;
  color: inherit;
  text-decoration: none;
`;

export const Media = styled.div`
  position: absolute;
  inset: 0;

  img {
    object-fit: cover;
  }

  /* 하단 카피 가독성 — 라이트는 흰 스크림, 다크는 검정 스크림 */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ theme }) =>
      theme.mode === "light"
        ? `linear-gradient(
            to top,
            color-mix(in srgb, ${theme.colors.surface} 92%, transparent) 0%,
            color-mix(in srgb, ${theme.colors.surface} 55%, transparent) 36%,
            transparent 62%
          )`
        : `linear-gradient(
            to top,
            color-mix(in srgb, ${theme.colors.background} 72%, transparent) 0%,
            color-mix(in srgb, ${theme.colors.background} 28%, transparent) 32%,
            transparent 58%
          )`};
  }
`;

export const PanelCopy = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.space[5]};
    gap: ${({ theme }) => theme.space[4]};
  }
`;

export const PanelText = styled.div`
  min-width: 0;
`;

export const PanelTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) =>
    theme.mode === "light"
      ? `0 1px 14px color-mix(in srgb, ${theme.colors.surface} 90%, transparent)`
      : `0 1px 12px color-mix(in srgb, ${theme.colors.background} 55%, transparent)`};
`;

export const PanelSummary = styled.p`
  margin-top: ${({ theme }) => theme.space[2]};
  max-width: 36ch;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) =>
    theme.mode === "light"
      ? theme.colors.textMuted
      : `color-mix(in srgb, ${theme.colors.text} 88%, transparent)`};
  text-shadow: ${({ theme }) =>
    theme.mode === "light"
      ? `0 1px 12px color-mix(in srgb, ${theme.colors.surface} 85%, transparent)`
      : `0 1px 10px color-mix(in srgb, ${theme.colors.background} 50%, transparent)`};
`;

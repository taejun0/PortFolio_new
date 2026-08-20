/**
 * 생성 이유: About 마퀴 시각을 로직과 분리한다.
 * 역할: MarqueeSection 스타일이다.
 * 책임: 한 줄 무한 스크롤 시각만 소유한다.
 */
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

export const Section = styled.section<{ $embedded?: boolean }>`
  padding: ${({ theme, $embedded }) =>
    $embedded
      ? `${theme.space[6]} 0 0`
      : `${theme.space[8]} 0`};
  background: ${({ theme, $embedded }) =>
    $embedded ? "transparent" : theme.colors.background};
  border: none;
  overflow: hidden;
`;

export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding: 0 ${({ theme }) => theme.layout.gutter};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Viewport = styled.div`
  overflow: hidden;
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 8%,
    #000 92%,
    transparent
  );
`;

export const Track = styled.div`
  display: flex;
  width: max-content;
  gap: ${({ theme }) => theme.space[9]};
  animation: ${scroll} 42s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Item = styled.span`
  flex-shrink: 0;
  font-size: clamp(1.05rem, 0.85rem + 1.4vw, 1.65rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

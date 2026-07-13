/**
 * 생성 이유: 양방향 마퀴 섹션 스타일을 렌더링과 분리한다.
 * 역할: SignalsSection 레이아웃·카드·keyframes 스타일을 정의한다.
 * 책임: RTL/LTR 무한 스크롤 시각만 소유한다.
 */
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const scrollRtl = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const scrollLtr = keyframes`
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.layout.sectionPaddingY} 0;
  background: ${({ theme }) => theme.colors.surface};
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
  overflow: hidden;
`;

export const Header = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto ${({ theme }) => theme.space[6]};
  padding: 0 ${({ theme }) => theme.layout.gutter};
`;

export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Rows = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const RowViewport = styled.div`
  overflow: hidden;
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 6%,
    #000 94%,
    transparent
  );
`;

export const RowTrack = styled.div<{ $direction: "rtl" | "ltr" }>`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  width: max-content;
  animation: ${({ $direction }) =>
      $direction === "rtl" ? scrollRtl : scrollLtr}
    42s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
`;

export const Card = styled.article`
  width: min(78vw, 22rem);
  flex-shrink: 0;
  padding: ${({ theme }) => theme.space[5]};
  border-radius: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const Quote = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: 1.5rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const CardBody = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.space[3]};
`;

export const CardMeta = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

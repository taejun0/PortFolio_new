/**
 * 생성 이유: 메인 후킹 지표 스트립 시각을 로직과 분리한다.
 * 역할: StatsSection 레이아웃·타이포 스타일을 정의한다.
 * 책임: 히어로와 About 사이 컴팩트 지표 밴드 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Strip = styled.section`
  width: 100%;
  padding: clamp(2.5rem, 1.5rem + 3vw, 4rem)
    ${({ theme }) => theme.layout.gutter};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1.25rem, 0.75rem + 2vw, 2.5rem);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.space[5]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Value = styled.p`
  font-size: clamp(2.25rem, 1.4rem + 2.8vw, 3.5rem);
  font-weight: ${({ theme }) => theme.fonts.weights.extraBold};
  letter-spacing: -0.045em;
  line-height: 0.95;
  color: ${({ theme }) => theme.colors.text};
`;

export const Unit = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Detail = styled.p`
  max-width: 18ch;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

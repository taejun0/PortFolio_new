/**
 * 생성 이유: About 섹션 전용 그리드 스타일을 공용 프리미티브와 구분한다.
 * 역할: AboutSection 레이아웃 스타일을 정의한다.
 * 책임: 본문·인적 정보 2열 배치만 소유한다.
 */
import styled from "@emotion/styled";

export const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[7]};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1.4fr 0.8fr;
    align-items: start;
  }
`;

export const Copy = styled.div``;

export const QuoteLead = styled.p`
  margin-bottom: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Quote = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

export const Facts = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[5]};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const Fact = styled.li`
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

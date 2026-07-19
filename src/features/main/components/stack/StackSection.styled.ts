/**
 * 생성 이유: Stack 섹션 스타일을 렌더링과 분리한다.
 * 역할: 6열 기술 그룹·이미지 아이콘 레이아웃 스타일을 정의한다.
 * 책임: 헤더·컬럼·stackImage 칩 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[7]};
`;

export const Aside = styled.p`
  max-width: min(16rem, 100%);
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(1.5rem, 1rem + 2vw, 2.5rem);
  }
`;

export const Column = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  align-content: start;
  padding-top: ${({ theme }) => theme.space[2]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Index = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  min-height: clamp(2rem, 3.5vw, 2.5rem);
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Icons = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

export const Icon = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(2.35rem, 2rem + 0.8vw, 2.75rem);
  height: clamp(2.35rem, 2rem + 0.8vw, 2.75rem);
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};

  img {
    width: clamp(1.35rem, 1.1rem + 0.5vw, 1.65rem);
    height: clamp(1.35rem, 1.1rem + 0.5vw, 1.65rem);
    object-fit: contain;
  }
`;

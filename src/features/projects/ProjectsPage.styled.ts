/**
 * 생성 이유: 프로젝트 목록 스타일을 분리한다.
 * 역할: ProjectsPage 레이아웃·리스트 스타일을 정의한다.
 * 책임: 다크 톤 목록 페이지 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
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
  margin-bottom: ${({ theme }) => theme.space[8]};
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Item = styled.li`
  padding: ${({ theme }) => theme.space[5]};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s ease, transform 0.2s ease;

  a {
    display: block;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};

    h2 {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

export const ItemTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s ease;
`;

export const ItemSummary = styled.p`
  margin-bottom: ${({ theme }) => theme.space[3]};
  max-width: ${({ theme }) => theme.layout.measure};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Meta = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

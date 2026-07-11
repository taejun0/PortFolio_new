/**
 * 생성 이유: 프로젝트 상세 스타일을 목록 페이지와 분리한다.
 * 역할: ProjectDetailPage 레이아웃·섹션 스타일을 정의한다.
 * 책임: 다크 톤 상세 페이지 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.article`
  width: 100%;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const BackLink = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Meta = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Overview = styled.p`
  max-width: ${({ theme }) => theme.layout.measure};
  margin-bottom: ${({ theme }) => theme.space[8]};
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Block = styled.section`
  margin-bottom: ${({ theme }) => theme.space[7]};
  padding-top: ${({ theme }) => theme.space[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const BlockTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const ListItem = styled.li`
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Challenge = styled.div`
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding-bottom: ${({ theme }) => theme.space[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ChallengeLabel = styled.p`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const ChallengeText = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

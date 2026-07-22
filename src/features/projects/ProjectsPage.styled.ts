/**
 * 생성 이유: 프로젝트 목록 스타일을 분리한다.
 * 역할: ProjectsPage 레이아웃·케이스 리스트 스타일을 정의한다.
 * 책임: Blog와 구분되는 컴팩트 미디어 쇼케이스 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  padding-top: clamp(5rem, 3rem + 8vw, 9rem);
  padding-bottom: ${({ theme }) => theme.space[6]};
  padding-inline: ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Intro = styled.header`
  margin-bottom: ${({ theme }) => theme.space[8]};
  max-width: 36rem;
`;

export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const List = styled.ul`
  display: grid;
  gap: clamp(2.25rem, 1.4rem + 3vw, 3.5rem);
`;

export const Media = styled.div`
  position: relative;
  width: 100%;
  max-width: 22rem;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: clamp(0.85rem, 0.6rem + 0.7vw, 1.15rem);
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};

  img {
    transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 100%;
    aspect-ratio: 16 / 9;
  }
`;

export const ItemTitle = styled.h2`
  font-size: clamp(1.25rem, 1.05rem + 0.9vw, 1.75rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.025em;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const Item = styled.li`
  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:hover ${ItemTitle} {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Row = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(12rem, 22rem) minmax(0, 1fr);
    gap: clamp(1.5rem, 1rem + 2vw, 2.75rem);
  }
`;

export const Copy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  min-width: 0;
  max-width: 34rem;
`;

export const IndexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Index = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Featured = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ItemSummary = styled.p`
  max-width: 36ch;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Dot = styled.span`
  opacity: 0.55;
`;

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: ${({ theme }) => theme.space[1]};
`;

export const Tag = styled.li`
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

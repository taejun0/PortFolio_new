/**
 * 생성 이유: 프로젝트 목록 스타일을 분리한다.
 * 역할: ProjectsPage 케이스 스터디형 쇼케이스 스타일을 정의한다.
 * 책임: 히어로·대형 미디어/카피 카드 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  padding-top: clamp(5rem, 3rem + 8vw, 9rem);
  padding-bottom: ${({ theme }) => theme.space[9]};
  padding-inline: ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Intro = styled.header`
  margin-bottom: ${({ theme }) => theme.space[8]};
  max-width: 40rem;
`;

export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: clamp(2.4rem, 1.4rem + 4vw, 4.25rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.035em;
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  max-width: 36rem;
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
`;

export const Item = styled.li`
  a {
    display: grid;
    gap: 0;
    overflow: hidden;
    border-radius: clamp(1.1rem, 0.8rem + 1vw, 1.75rem);
    border: 1px solid
      color-mix(in srgb, ${({ theme }) => theme.colors.text} 8%, transparent);
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 3%,
      transparent
    );
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
      background 0.35s cubic-bezier(0.16, 1, 0.3, 1);

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);
      min-height: clamp(16.5rem, 32vh, 22rem);
    }
  }

  &:hover a {
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 14%,
      transparent
    );
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 4.5%,
      transparent
    );
  }

  &:hover img {
    transform: scale(1.04);
  }
`;

export const Media = styled.div`
  position: relative;
  min-height: clamp(12rem, 36vw, 16rem);
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  img {
    transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 100%;
  }
`;

export const Badges = styled.div`
  position: absolute;
  z-index: 1;
  top: ${({ theme }) => theme.space[4]};
  left: ${({ theme }) => theme.space[4]};
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.text};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.background} 62%,
    transparent
  );
  backdrop-filter: blur(10px);
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.text} 12%, transparent);
`;

export const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: clamp(1.15rem, 0.85rem + 1.1vw, 1.75rem);
    justify-content: center;
  }
`;

export const Category = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ItemTitle = styled.h2`
  font-size: clamp(1.4rem, 1.15rem + 1.1vw, 2rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.text};
`;

export const ItemSummary = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Block = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
`;

export const BlockLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const BlockText = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.text};
`;

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const Tag = styled.li`
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Cta = styled.span`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  margin-top: ${({ theme }) => theme.space[1]};
  padding: 0.6rem 1rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) =>
    theme.mode === "light" ? theme.colors.accentContrast : "#000000"};
  background: ${({ theme }) => theme.colors.text};
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  ${Item}:hover & {
    transform: translateY(-1px);
    opacity: 0.92;
  }
`;

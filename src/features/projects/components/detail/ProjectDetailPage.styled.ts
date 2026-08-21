/**
 * 생성 이유: 프로젝트 상세 스타일을 목록 페이지와 분리한다.
 * 역할: ProjectDetailPage 레이아웃·섹션 스타일을 정의한다.
 * 책임: 커버 히어로·본문 블록의 여유 있는 시각만 소유한다.
 */
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";

export const Wrapper = styled.article`
  width: 100%;
  padding-top: clamp(4.5rem, 2.5rem + 7vw, 8rem);
  padding-bottom: ${({ theme }) => theme.space[6]};
  padding-inline: ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const BackLink = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[7]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.accent};
`;

export const Hero = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[7]};
  margin-bottom: ${({ theme }) => theme.space[8]};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: end;
    gap: ${({ theme }) => theme.space[8]};
  }
`;

export const HeroCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Title = styled.h1`
  font-size: clamp(2rem, 1.2rem + 3vw, 3.5rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.text};
`;

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Dot = styled.span`
  opacity: 0.55;
`;

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

export const Tag = styled.li`
  padding: 0.28rem 0.65rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

export const ExtLink = styled.a`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  ${hoverArrowParent}

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Cover = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: clamp(1rem, 0.7rem + 1vw, 1.5rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

export const Overview = styled.p`
  max-width: min(56rem, 100%);
  margin-bottom: ${({ theme }) => theme.space[9]};
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Block = styled.section`
  margin-bottom: ${({ theme }) => theme.space[8]};
  padding-top: ${({ theme }) => theme.space[7]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  content-visibility: auto;
  contain-intrinsic-block-size: auto 32rem;
`;

export const BlockTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  color: ${({ theme }) => theme.colors.text};
`;

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  max-width: min(56rem, 100%);
`;

export const ListItem = styled.li`
  position: relative;
  padding-left: 1rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textMuted};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.7em;
    width: 0.28rem;
    height: 0.28rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const Challenge = styled.div`
  margin-bottom: ${({ theme }) => theme.space[7]};
  padding-bottom: ${({ theme }) => theme.space[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  max-width: min(56rem, 100%);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
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
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textMuted};

  &:last-child {
    margin-bottom: 0;
  }
`;

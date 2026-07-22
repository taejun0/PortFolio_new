/**
 * 생성 이유: 스크롤 연동 가로 프로젝트 트랙 스타일을 분리한다.
 * 역할: ProjectsSection sticky pin·트랙 스타일을 정의한다.
 * 책임: sticky 패널과 가로 트랙 셸만 소유한다.
 */
import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const Pin = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.background};
`;

export const Sticky = styled.div<{ $static?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
  width: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};

  ${({ $static, theme }) =>
    $static
      ? `
    position: relative;
    height: auto;
    padding: ${theme.space[8]} 0 ${theme.space[6]};
  `
      : `
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100dvh;
    padding: calc(${theme.layout.headerHeight} + ${theme.space[4]}) 0 ${theme.space[5]};
  `}
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  padding: 0 ${({ theme }) => theme.layout.gutter};
  flex-shrink: 0;
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
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.text};
`;

export const Aside = styled.p`
  margin-top: ${({ theme }) => theme.space[2]};
  max-width: 28ch;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ArchiveLink = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Viewport = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 0;
  width: 100%;
  padding-left: ${({ theme }) => theme.layout.gutter};
  overflow: hidden;
`;

export const MotionTrack = styled(motion.div)`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.space[5]};
  width: max-content;
  will-change: transform;
`;

export const StaticTrack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  width: 100%;
  padding-right: ${({ theme }) => theme.layout.gutter};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const TrackEnd = styled.div`
  flex: 0 0 ${({ theme }) => theme.layout.gutter};
  width: ${({ theme }) => theme.layout.gutter};
`;

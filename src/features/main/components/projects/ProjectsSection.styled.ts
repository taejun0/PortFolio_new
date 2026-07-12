/**
 * 생성 이유: 스크롤 연동 가로 프로젝트 트랙 스타일을 분리한다.
 * 역할: ProjectsSection sticky pin·카드 트랙 스타일을 정의한다.
 * 책임: sticky 패널과 가로 트랙 시각만 소유한다.
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
  gap: ${({ theme }) => theme.space[6]};
  width: 100%;
  height: ${({ $static }) => ($static ? "auto" : "100vh")};
  padding: ${({ theme }) => theme.space[8]} 0 ${({ theme }) => theme.space[5]};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};

  ${({ $static }) =>
    $static
      ? `
    position: relative;
  `
      : `
    position: sticky;
    top: 0;
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
  color: ${({ theme }) => theme.colors.text};
`;

export const ArchiveLink = styled.span`
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
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
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[5]};
  width: 100%;
  padding-right: ${({ theme }) => theme.layout.gutter};
`;

export const TrackEnd = styled.div`
  flex: 0 0 ${({ theme }) => theme.layout.gutter};
  width: ${({ theme }) => theme.layout.gutter};
`;

export const Card = styled.article`
  width: min(82vw, 34rem);
  flex-shrink: 0;
  padding: ${({ theme }) => theme.space[4]};
  border-radius: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  a {
    display: grid;
    gap: ${({ theme }) => theme.space[4]};
    height: 100%;
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Badge = styled.span`
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
`;

export const ClickHint = styled.span`
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Media = styled.div`
  overflow: hidden;
  aspect-ratio: 16 / 11;
  border-radius: 1rem;
  background: ${({ theme }) => theme.colors.surface};
`;

export const CardBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

export const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const CardSummary = styled.p`
  font-size: 0.875rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Year = styled.span`
  flex-shrink: 0;
  padding: 0.3rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

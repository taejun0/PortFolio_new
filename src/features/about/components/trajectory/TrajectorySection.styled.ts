/**
 * 생성 이유: Trajectory 타임라인 시각을 로직과 분리한다.
 * 역할: TrajectorySection 스타일이다.
 * 책임: 스크롤 연동 세로 레일·기간·포인트·키워드 배치만 소유한다.
 */
import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[4]};
  max-width: 18ch;
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  max-width: 36ch;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const List = styled.ol`
  position: relative;
  display: grid;
  gap: 0;
  margin-left: 0.35rem;
  max-width: 48rem;
  padding-left: 0;
`;

export const Rail = styled.div`
  position: absolute;
  top: 0.35rem;
  bottom: 0.35rem;
  left: 0;
  width: 1px;
  background: ${({ theme }) => theme.colors.border};
  pointer-events: none;
`;

export const RailProgress = styled(motion.div)`
  position: absolute;
  top: 0.35rem;
  bottom: 0.35rem;
  left: 0;
  width: 1px;
  background: ${({ theme }) => theme.colors.accent};
  transform-origin: top center;
  pointer-events: none;
  will-change: transform;
`;

export const Item = styled.li`
  display: grid;
  grid-template-columns: minmax(7.5rem, 10rem) minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[4]};
  padding: ${({ theme }) => theme.space[4]} 0 ${({ theme }) => theme.space[4]}
    ${({ theme }) => theme.space[4]};
  position: relative;

  &:first-of-type {
    padding-top: 0;

    &::before {
      top: 0.35rem;
    }
  }

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: "";
    position: absolute;
    left: -0.22rem;
    top: calc(${({ theme }) => theme.space[4]} + 0.35rem);
    z-index: 1;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.background};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space[2]};
    padding-left: ${({ theme }) => theme.space[4]};
  }
`;

export const PeriodCol = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  align-content: start;
  padding-top: 0.1rem;
`;

export const Period = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Badge = styled.span`
  width: fit-content;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.accent};
`;

export const Copy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const ItemTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
`;

export const Points = styled.ul`
  display: grid;
  gap: 0.35rem;
`;

export const Point = styled.li`
  position: relative;
  padding-left: 0.85rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export const Keywords = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: ${({ theme }) => theme.space[1]};
`;

export const Keyword = styled.li`
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

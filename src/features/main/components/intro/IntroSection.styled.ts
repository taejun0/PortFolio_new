/**
 * 생성 이유: 히어로 풀뷰포트 스타일을 본문 섹션과 분리한다.
 * 역할: IntroSection 레이아웃·타이포 스타일을 정의한다.
 * 책임: 그리드 배경·역할 라인·디스플레이 네임·스크롤 힌트 시각만 소유한다.
 */
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const drip = keyframes`
  0% { transform: translateX(-50%) translateY(0); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateX(-50%) translateY(10px); opacity: 0; }
`;

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.layout.gutter}
    ${({ theme }) => theme.space[9]};
  background:
    radial-gradient(
      ellipse 55% 45% at 78% 18%,
      ${({ theme }) => theme.colors.splashWash},
      transparent 60%
    ),
    linear-gradient(${({ theme }) => theme.colors.gridLine} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.colors.gridLine} 1px, transparent 1px),
    ${({ theme }) => theme.colors.background};
  background-size:
    auto,
    clamp(40px, 5vw, 64px) clamp(40px, 5vw, 64px),
    clamp(40px, 5vw, 64px) clamp(40px, 5vw, 64px),
    auto;
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Roles = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[1]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Role = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

export const RoleDot = styled.span`
  opacity: 0.55;
`;

export const DisplayWrap = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const Title = styled.p`
  max-width: min(34rem, 100%);
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ScrollHint = styled.a`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${({ theme }) => theme.space[5]};
  margin-inline: auto;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const ScrollMouse = styled.span`
  position: relative;
  display: block;
  width: clamp(1.15rem, 1rem + 0.4vw, 1.4rem);
  height: clamp(1.85rem, 1.6rem + 0.7vw, 2.25rem);
  border: 1px solid currentColor;
  border-radius: 999px;
  opacity: 0.85;

  &::before {
    content: "";
    position: absolute;
    top: 0.4rem;
    left: 50%;
    width: 0.2rem;
    height: 0.35rem;
    border-radius: 999px;
    background: currentColor;
    animation: ${drip} 1.6s ease-in-out infinite;
  }
`;

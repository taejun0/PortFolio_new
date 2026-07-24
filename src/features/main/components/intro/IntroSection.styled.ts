/**
 * 생성 이유: 히어로 풀뷰포트 스타일을 본문 섹션과 분리한다.
 * 역할: IntroSection 레이아웃·타이포 스타일을 정의한다.
 * 책임: 플랫 배경·약한 비네트·역할 라인·디스플레이 네임·스크롤 힌트 시각만 소유한다.
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
  overflow: visible;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.layout.gutter}
    ${({ theme }) => theme.space[9]};
  background: ${({ theme }) => theme.colors.background};
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse 90% 75% at 50% 42%,
      transparent 42%,
      color-mix(
          in srgb,
          ${({ theme }) => theme.colors.background} 72%,
          transparent
        )
        100%
    );
  }
`;
export const Inner = styled.div`
  position: relative;
  z-index: 1;
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
  overflow: visible;
`;

export const Title = styled.p`
  max-width: min(34rem, 100%);
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ScrollHint = styled.a`
  position: absolute;
  z-index: 1;
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
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
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

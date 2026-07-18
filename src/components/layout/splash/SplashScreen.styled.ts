/**
 * 생성 이유: 스플래시 오버레이 시각을 로직과 분리한다.
 * 역할: SplashScreen 레이아웃·브랜드·진행 바 스타일이다.
 * 책임: 전체 화면 로딩 연출 시각만 소유한다.
 */
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";

const sweep = keyframes`
  0% { transform: scaleX(0); transform-origin: left center; }
  55% { transform: scaleX(1); transform-origin: left center; }
  56% { transform: scaleX(1); transform-origin: right center; }
  100% { transform: scaleX(0); transform-origin: right center; }
`;

export const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 4000;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.background};
  pointer-events: all;
`;

export const Wash = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 55% 40% at 50% 42%,
    ${({ theme }) => theme.colors.splashWash},
    transparent 70%
  );
  pointer-events: none;
`;

export const Brand = styled.div`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  justify-items: center;
  text-align: center;
`;

export const Mark = styled(motion.span)`
  display: block;
  width: clamp(3.5rem, 10vw, 5.5rem);
  height: 3px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  transform-origin: left center;
`;

export const Name = styled(motion.p)`
  font-size: clamp(1.75rem, 1.2rem + 2.5vw, 2.75rem);
  font-weight: ${({ theme }) => theme.fonts.weights.extraBold};
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};
`;

export const Sub = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Progress = styled.div`
  position: absolute;
  bottom: clamp(2rem, 6vh, 3.5rem);
  left: 50%;
  width: min(12rem, 42vw);
  height: 2px;
  overflow: hidden;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  transform: translateX(-50%);

  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.accent};
    animation: ${sweep} 1.35s cubic-bezier(0.22, 1, 0.36, 1) infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      transform: scaleX(0.55);
      transform-origin: left center;
    }
  }
`;

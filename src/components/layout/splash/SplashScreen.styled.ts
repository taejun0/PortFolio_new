/**
 * 생성 이유: 스플래시 오버레이 시각을 로직과 분리한다.
 * 역할: SplashScreen OHTAEJUN 조립·폭파 스타일이다.
 * 책임: 전체 화면 로딩 연출 시각만 소유한다.
 */
import styled from "@emotion/styled";
import { motion } from "framer-motion";

export const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 5001;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.layout.gutter};
  /* SSR Emotion dark 테마와 무관하게 boot data-theme 캔버스를 따른다 */
  background: var(--canvas-bg, ${({ theme }) => theme.colors.background});
  pointer-events: all;
  overflow: hidden;
`;

export const Brand = styled.div`
  position: relative;
  display: flex;
  width: min(100%, 52rem);
  align-items: flex-end;
  justify-content: center;
  line-height: ${({ theme }) => theme.typography.heroName.lineHeight};
  user-select: none;
`;

export const Slot = styled.span`
  display: flex;
  flex: 1 1 0;
  align-items: flex-end;
  justify-content: center;
  min-width: 0;
  overflow: visible;
`;

export const Fall = styled(motion.span)`
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  transform-origin: center center;
  will-change: transform, opacity, filter;
`;

export const Glyph = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.typography.heroName.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.heroName.letterSpacing};
  line-height: ${({ theme }) => theme.typography.heroName.lineHeight};
  color: var(--canvas-fg, ${({ theme }) => theme.colors.text});
  text-transform: uppercase;
`;

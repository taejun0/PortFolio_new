/**
 * 생성 이유: 히어로 풀뷰포트 스타일을 본문 섹션과 분리한다.
 * 역할: IntroSection 레이아웃·타이포 스타일을 정의한다.
 * 책임: 플랫 배경·약한 비네트, 역할 라인→디스플레이 네임→소개 문장의 세로 리듬,
 *       스크롤 힌트 시각(인트로 끝의 가로 스윕 등장·쉬어 가는 휠 점·호버/포커스·인쇄 제외)만 소유한다.
 *       라벨·소개 문장의 커튼 등장은 공용 모션(SweepText)이 맡는다.
 */
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { motionTransition } from "@/components/common/motion";
import { motionTokens } from "@/styles/theme";

import { WAVE_START_S, WAVE_TOTAL_S } from "./expandableName/nameLens";

const { curve, duration } = motionTokens;

/** 스크롤 힌트는 이름 웨이브가 끝 글자를 떠나는 순간 들어온다 */
const CUE_DELAY_S = WAVE_START_S + WAVE_TOTAL_S;

/** 등장 — 다른 리빌과 같은 문법(왼쪽부터 열리는 마스크 + 짧은 가로 미끄러짐) */
const cueSweep = keyframes`
  from {
    clip-path: inset(0 100% 0 0);
    transform: translateX(-0.75rem);
  }
  to {
    clip-path: inset(0 0 0 0);
    transform: none;
  }
`;

/**
 * 휠 점 — 위에서 짧게 내려앉으며 사라지고, 다음 신호 전까지 쉰다.
 * 같은 곡선(ease.out)이라 처음에 대부분 움직이고 길게 가라앉는다. 테마와 무관해야 테마 전환에 다시 시작하지 않는다.
 */
const drip = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, 0);
    animation-timing-function: ${curve.out};
  }
  10% {
    opacity: 1;
    transform: translate(-50%, 0);
    animation-timing-function: ${curve.out};
  }
  32% {
    opacity: 1;
    animation-timing-function: ${curve.out};
  }
  58%,
  100% {
    opacity: 0;
    transform: translate(-50%, 0.45rem);
  }
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
  /*
   * 라벨·소개 문장 커튼 색을 이 섹션이 실제로 칠하는 배경과 같은 선언으로 묶는다
   * (전역 --motion-canvas와 같은 값 — 섹션 면이 바뀌면 덮개도 함께 바뀐다).
   */
  --reveal-curtain: ${({ theme }) => theme.colors.background};
  /* 앵커 오프셋은 전역 html scroll-padding-top이 준다(섹션마다 scroll-margin을 더하지 않는다) */

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

/** 역할 라인 — 한 줄 SweepText(커튼)의 루트라 블록으로 둔다 */
export const Roles = styled.p`
  /* 렌즈로 커진 글자가 위로 솟을 자리까지 포함한 간격 */
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: ${({ theme }) => theme.typography.label.lineHeight};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const DisplayWrap = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[6]};
  overflow: visible;
`;

export const Title = styled.p`
  max-width: min(40rem, 100%);
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.heading.letterSpacing};
  color: ${({ theme }) => theme.colors.textMuted};
  text-wrap: balance;
`;

export const ScrollHint = styled.a`
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  /* 안쪽 여백만큼 내려 시각 위치는 유지하고, 포커스 링은 둥근 영역을 감싼다 */
  bottom: calc(
    ${({ theme }) => theme.space[5]} - ${({ theme }) => theme.space[2]}
  );
  margin-inline: auto;
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.layout.radius.md};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
  }

  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }

  /*
   * 인트로 마지막 — 이름 웨이브가 끝나면 왼쪽부터 쓸려 들어온다(스플래시 신호에 맞춘 CSS라 hydration과 무관).
   * 스플래시 신호 전에는 가리지 않으므로 신호가 끝내 없어도 그대로 보이고, JS 없음·인쇄·동작 줄이기도 그대로 보인다.
   */
  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion][data-splash-done="1"] & {
      animation: ${cueSweep} ${duration.reveal}s ${curve.out} ${CUE_DELAY_S}s
        backwards;
    }
  }

  /* 가로 모드 폰처럼 낮은 화면에서는 소개 문장과 붙어 보여 숨긴다 */
  @media (max-height: 32rem) {
    display: none;
  }

  /* 종이에서는 스크롤 신호가 뜻이 없다 — 인쇄하지 않는다 */
  @media print {
    display: none;
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
    transform: translate(-50%, 0);
    animation: ${drip} 2.4s linear infinite;
  }

  /* 동작 줄이기: 점은 휠 자리에 멈춰 있다 */
  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

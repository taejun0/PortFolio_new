/**
 * 생성 이유: About 마퀴 시각을 로직과 분리한다.
 * 역할: MarqueeSection 스타일이다.
 * 책임: 한 줄 무한 흐름 시각(두 벌 트랙·가장자리 페이드·포커스 링), CSS 흐름과 재생·정지 상태, 인쇄 배치를 소유한다.
 *       흐름은 JS 유무와 상관없이 늘 이 CSS 애니메이션(컴포지터)이다. useMarqueeVelocity는 재생 배속만 바꾸고,
 *       재생·정지(호버·키보드 포커스·탭으로 켠 data-paused)는 animation-play-state가 맡는다.
 */
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

import { MARQUEE_LOOP_S, MARQUEE_PAUSED_ATTR } from "./useMarqueeVelocity";

/** 트랙은 같은 목록 두 벌이라 절반(-50%)이 정확히 한 벌 폭 — 이음매 없이 반복된다. */
const drift = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

/** 좌우 가장자리에서 글자가 흐려지며 들고 나는 폭 */
const EDGE_FADE = "clamp(2rem, 9%, 7rem)";

/**
 * 키보드로 포커스하면 흐름이 멈춘다 — 위 여백을 뺀 줄 둘레에만 링을 그린다.
 * (뷰포트에 그리면 가장자리 마스크가 링까지 흐리게 지운다.)
 */
export const Section = styled.section<{ $embedded?: boolean }>`
  --marquee-pad-top: ${({ theme, $embedded }) =>
    $embedded ? theme.space[6] : theme.space[8]};
  --marquee-pad-bottom: ${({ theme, $embedded }) =>
    $embedded ? "0px" : theme.space[8]};

  position: relative;
  padding: var(--marquee-pad-top) 0 var(--marquee-pad-bottom);
  background: ${({ theme, $embedded }) =>
    $embedded ? "transparent" : theme.colors.background};
  border: none;
  overflow: hidden;

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::after {
    content: "";
    position: absolute;
    inset: var(--marquee-pad-top) 0 var(--marquee-pad-bottom);
    border: 2px solid var(--focus-ring);
    border-radius: ${({ theme }) => theme.layout.radius.sm};
    pointer-events: none;
  }
`;

export const Viewport = styled.div`
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent,
    #000 ${EDGE_FADE},
    #000 calc(100% - ${EDGE_FADE}),
    transparent
  );
  mask-image: linear-gradient(
    90deg,
    transparent,
    #000 ${EDGE_FADE},
    #000 calc(100% - ${EDGE_FADE}),
    transparent
  );

  /* 인쇄 — 흐르지 않는 목록이라 가장자리 페이드도 없앤다 */
  @media print {
    -webkit-mask-image: none;
    mask-image: none;
  }
`;

export const Track = styled.div`
  display: flex;
  width: max-content;
  animation: ${drift} ${MARQUEE_LOOP_S}s linear infinite;

  /* 마우스·키보드로 멈춘다(JS 없이도). 호버가 없는 기기는 탭으로 켠 data-paused가 멈춘 채 둔다. */
  @media (hover: hover) {
    &:hover {
      animation-play-state: paused;
    }
  }

  ${Section}:focus-visible &,
  ${Section}[${MARQUEE_PAUSED_ATTR}] & {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  /* 인쇄 — 한 벌만 제자리에서 여러 줄로 감싼다 */
  @media print {
    width: auto;
    animation: none;
    transform: none;
  }
`;

/** 한 벌 — 끝에도 항목 간격을 둬 두 벌이 이어져도 간격이 같다. */
export const Group = styled.ul`
  display: flex;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.space[9]};
  padding-right: ${({ theme }) => theme.space[9]};

  @media print {
    flex-wrap: wrap;
    flex-shrink: 1;
    gap: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[6]};
    padding-right: 0;

    &[aria-hidden="true"] {
      display: none;
    }
  }
`;

export const Item = styled.li`
  flex-shrink: 0;
  font-size: clamp(1.05rem, 0.85rem + 1.4vw, 1.65rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

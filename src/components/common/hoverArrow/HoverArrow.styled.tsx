/**
 * 생성 이유: 링크·CTA 화살표 방향을 사이트 전역에서 통일한다.
 * 역할: 평소 →, 호버(호버 가능한 기기)·키보드 포커스 시 ↗ 로 바뀌는 공통 화살표 마크다.
 * 책임: 글리프·미세 이동만 소유한다. 트리거는 부모가 hoverArrowParent를 쓴다.
 *       길이·곡선은 모션 토큰(duration.hover·curve.out)을 따르고, 동작 줄이기에서는 이동 없이 글리프만 바뀐다.
 *
 * 참고: @emotion/styled 빌드에 .attrs가 없어 data-hover-arrow로 선택한다.
 */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import type { ComponentPropsWithoutRef } from "react";

import { motionTransition } from "@/components/common/motion/motionCss";

export const hoverArrowCss = css`
  display: inline-block;
  margin-left: 0.35em;
  transition: ${motionTransition("transform")};

  &::before {
    content: "→";
  }
`;

const HoverArrowRoot = styled.span`
  ${hoverArrowCss}
`;

type HoverArrowProps = ComponentPropsWithoutRef<"span">;

/** 확장 스타일에도 data-hover-arrow를 붙이면 hoverArrowParent가 동작한다. */
export const HoverArrow = ({ ...props }: HoverArrowProps) => (
  <HoverArrowRoot data-hover-arrow="" {...props} />
);

/** 켜진 화살표 — ↗ 글리프와 오른쪽 위로 2px. 동작 줄이기에서는 글리프만 바뀐다. */
const hoverArrowActive = css`
  transform: translate(2px, -2px);

  &::before {
    content: "↗";
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }
`;

/**
 * 호버 가능한 부모(a, button, li, span 등)에 붙여 자식 화살표를 켠다.
 * 호버는 마우스처럼 호버할 수 있는 기기에서만 켠다 — 터치 기기는 탭 뒤 :hover가 남아 화살표가 ↗로 굳는다.
 * 키보드 포커스(:focus-visible)에도 같은 피드백을 준다 — 부모가 포커스를 받지 않는 요소면
 * 안쪽 링크의 포커스(:has)로 켠다.
 */
export const hoverArrowParent = css`
  @media (hover: hover) {
    &:hover [data-hover-arrow] {
      ${hoverArrowActive}
    }
  }

  &:focus-visible [data-hover-arrow],
  &:has(:focus-visible) [data-hover-arrow] {
    ${hoverArrowActive}
  }
`;

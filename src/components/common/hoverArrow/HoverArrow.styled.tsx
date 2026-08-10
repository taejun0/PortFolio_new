/**
 * 생성 이유: 링크·CTA 화살표 방향을 사이트 전역에서 통일한다.
 * 역할: 평소 →, 호버 시 ↗ 로 바뀌는 공통 화살표 마크다.
 * 책임: 글리프·미세 이동만 소유한다. 호버 트리거는 부모가 hoverArrowParent를 쓴다.
 *
 * 참고: @emotion/styled 빌드에 .attrs가 없어 data-hover-arrow로 선택한다.
 */
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import type { ComponentPropsWithoutRef } from "react";

export const hoverArrowCss = css`
  display: inline-block;
  margin-left: 0.35em;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

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

/** 호버 가능한 부모(a, button, li, span 등)에 붙여 자식 화살표를 켠다. */
export const hoverArrowParent = css`
  &:hover [data-hover-arrow] {
    transform: translate(2px, -2px);

    &::before {
      content: "↗";
    }
  }
`;

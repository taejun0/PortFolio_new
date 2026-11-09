/**
 * 생성 이유: 라우트 진입 모션 시각을 전환 로직(스크롤 리셋)과 분리한다.
 * 역할: 페이지 래퍼와 클라이언트 내비게이션 진입 스윕 스타일이다.
 * 책임: data-page-enter가 붙은(클라이언트 라우트 변경으로 새로 마운트된) 래퍼의 진입 애니메이션만 소유한다.
 *       첫 하드 로드·JS 없음·인쇄·동작 줄이기에서는 아무것도 움직이지 않는다.
 *       transform·opacity만 써서 합성 레이어에서 돌고, 끝나면 속성을 남기지 않는다(backwards — fixed 기준 상자를 만들지 않음).
 */
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { motionTokens } from "@/styles/theme";

/** 블록 리빌과 같은 거리(distance.sweep)만큼 왼쪽에서 들어오며 옅게 드러난다 — 세로 이동 없음 */
const pageEnter = keyframes`
  from {
    opacity: 0;
    transform: translateX(calc(${motionTokens.distance.sweep} * -1));
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

export const Page = styled.div`
  min-height: 100%;

  @media screen and (prefers-reduced-motion: no-preference) {
    &[data-page-enter] {
      animation: ${pageEnter} ${({ theme }) => theme.motion.duration.hero}s
        ${({ theme }) => theme.motion.curve.out} backwards;
    }
  }
`;

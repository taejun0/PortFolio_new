/**
 * 생성 이유: 404 화면 스타일을 컴포넌트 로직과 분리한다.
 * 역할: NotFoundPage 레이아웃·라벨·제목·안내·홈 CTA 스타일을 정의한다.
 * 책임: 테마 토큰(색 = html[data-theme]를 따르는 CSS 변수)만으로 칠한다 — 사이트 테마가 OS 색 설정과 달라도
 *       다른 페이지와 같은 면·잉크다. 높이는 내용만큼(빈 전체 화면 없이) 두고 바로 아래 푸터가 이어진다.
 *       CTA는 프로젝트 상세 외부 링크 알약과 같은 시각이다 — 라벨은 RollText가 굴리고, 면 색만 바뀐다.
 */
import styled from "@emotion/styled";
import Link from "next/link";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import { motionTransition } from "@/components/common/motion";

/**
 * 커튼 리빌(제목) 색을 이 페이지 면과 같은 선언에서 준다 — 면 색이 바뀌면 덮개도 함께 바뀐다
 * (전역 --motion-canvas와 같은 값이지만, 페이지 면에 직접 묶어 둔다).
 */
export const Wrapper = styled.section`
  --reveal-curtain: ${({ theme }) => theme.colors.background};

  width: 100%;
  padding-top: clamp(5rem, 3rem + 8vw, 9rem);
  padding-bottom: ${({ theme }) => theme.space[10]};
  padding-inline: ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

/** 페이지 라벨 */
export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.display.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.display.letterSpacing};
  line-height: ${({ theme }) => theme.typography.display.lineHeight};
  color: ${({ theme }) => theme.colors.text};
`;

export const Body = styled.p`
  max-width: ${({ theme }) => theme.layout.measure};
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** 홈 CTA 알약 — 들림·크기 변화 없이 면 색만 바뀌고, 화살표는 호버·키보드 포커스에서 ↗로 바뀐다. */
export const Cta = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.space[6]};
  padding: clamp(0.6rem, 0.5rem + 0.3vw, 0.75rem)
    clamp(1.1rem, 0.9rem + 0.6vw, 1.4rem);
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: ${({ theme }) => theme.layout.borderWidth.control} solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accent};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.accentContrast};
  text-decoration: none;
  transition: ${motionTransition(["background-color", "border-color"])};
  ${hoverArrowParent}

  @media (hover: hover) {
    &:hover {
      border-color: ${({ theme }) => theme.colors.accentSecondary};
      background: ${({ theme }) => theme.colors.accentSecondary};
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    border-color: ${({ theme }) => theme.colors.accentSecondary};
    background: ${({ theme }) => theme.colors.accentSecondary};
  }
`;

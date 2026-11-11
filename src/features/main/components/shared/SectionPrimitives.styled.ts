/**
 * 생성 이유: 메인 섹션 공통 레이아웃 스타일을 재사용한다.
 * 역할: Thomas Eduardo식 섹션 라벨·타이틀·CTA 프리미티브다.
 * 책임: 포트폴리오 본문 섹션의 기본 간격·타이포·챕터 골격을 제공한다.
 *       챕터(100dvh)는 가로로 넓은 화면(태블릿 가로·데스크톱)에서만 쓴다 — 세로 화면(폰·태블릿 세로)에서는
 *       100dvh가 내용보다 훨씬 길어 빈 띠가 생기므로 내용 높이 + 같은 세로 여백으로 쌓는다.
 *       라벨·타이틀은 SweepText의 as로 감싸 쓴다: <SweepText as={P.Label}>…</SweepText>
 *       → 글자가 읽는 방향으로 쓸려 들어온다.
 */
import { css, type Theme } from "@emotion/react";
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import { motionTransition } from "@/components/common/motion";

/** 한 화면 챕터 높이를 쓰는 화면 — 가로로 넓은 화면만 */
export const chapterQuery = (theme: Theme) =>
  `(min-width: ${theme.breakpoints.tablet}) and (orientation: landscape)`;

export const Section = styled.section<{
  $alt?: boolean;
  $alignStart?: boolean;
  /** 챕터 높이 없이 내용 높이만 쓴다(바로 푸터가 이어지는 마지막 장면 등) */
  $fit?: boolean;
}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $alignStart }) =>
    $alignStart ? "flex-start" : "center"};
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme, $alt }) =>
    $alt ? theme.colors.wash : theme.colors.background};
  /* 앵커 오프셋(고정 헤더 높이)은 전역 html scroll-padding-top이 준다 — 여기 더하면 한 헤더만큼 아래에 멈춘다 */

  ${({ theme, $fit }) =>
    !$fit &&
    css`
      @media ${chapterQuery(theme)} {
        min-height: 100vh;
        min-height: 100dvh;
      }
    `}
`;

export const SectionInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

/** 섹션 라벨 */
export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h2<{ $flush?: boolean }>`
  margin-bottom: ${({ theme, $flush }) =>
    $flush ? "0" : theme.space[6]};
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Body = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  max-width: ${({ theme }) => theme.layout.measure};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: ${({ theme }) => theme.typography.body.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: pre-line;
`;

/** 주 CTA 알약 — 호버는 색만 바꾸고 라벨 움직임은 안쪽 RollText가 맡는다(들림·눌림 크기 변화 없음). */
export const CtaButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space[5]};
  padding: clamp(0.8rem, 0.65rem + 0.5vw, 1rem)
    clamp(1.35rem, 1rem + 1.2vw, 1.9rem);
  border-radius: ${({ theme }) => theme.layout.radius.md};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.accentContrast};
  background: ${({ theme }) => theme.colors.accent};
  transition: ${motionTransition("background-color")};

  &:hover,
  a:focus-visible > & {
    background: ${({ theme }) => theme.colors.accentSecondary};
  }
`;

/**
 * 링크 안에 두는 보조 CTA 글자 — <Link><TextLink><RollText>{라벨}</RollText><HoverArrow aria-hidden /></TextLink></Link>.
 * 라벨은 RollText가 가로로 굴리고, 색·화살표는 호버와 바깥 링크의 키보드 포커스에 같이 반응한다.
 */
export const TextLink = styled.span`
  display: inline-block;
  margin-top: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};
  ${hoverArrowParent}

  &:hover,
  a:focus-visible > & {
    color: ${({ theme }) => theme.colors.text};
  }

  /* 포커스는 바깥 링크가 받으므로 화살표도 그 포커스로 켠다(hoverArrowParent와 같은 시각) */
  a:focus-visible > & [data-hover-arrow] {
    transform: translate(2px, -2px);

    &::before {
      content: "↗";
    }
  }

  @media (prefers-reduced-motion: reduce) {
    a:focus-visible > & [data-hover-arrow] {
      transform: none;
    }
  }
`;

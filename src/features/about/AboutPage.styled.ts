/**
 * 생성 이유: About 페이지 셸 스타일을 분리한다.
 * 역할: AboutPage 최상위 래퍼·챕터 공통 스타일이다.
 * 책임: 여유 있는 섹션 패딩과 라벨·타이틀 리듬만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};

  > section:not(:first-of-type):not([data-scroll-track]) {
    content-visibility: auto;
    contain-intrinsic-block-size: auto 48rem;
  }
`;

export const Chapter = styled.section<{
  $alt?: boolean;
  $compact?: boolean;
  $cozy?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: ${({ $compact, $cozy }) =>
      $compact
        ? "clamp(2rem, 1.2rem + 2.5vw, 3.25rem)"
        : $cozy
          ? "clamp(3rem, 2rem + 4vw, 5rem)"
          : "clamp(5.5rem, 3.5rem + 9vw, 11rem)"}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme, $alt }) =>
    $alt ? theme.colors.surface : theme.colors.background};
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[8]};
  max-width: 18ch;
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

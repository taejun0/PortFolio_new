/**
 * 생성 이유: 메인 섹션 공통 레이아웃 스타일을 재사용한다.
 * 역할: Thomas Eduardo식 섹션 라벨·타이틀·CTA 프리미티브다.
 * 책임: 포트폴리오 본문 섹션의 기본 간격·타이포·챕터(100dvh) 골격을 제공한다.
 */
import styled from "@emotion/styled";

export const Section = styled.section<{ $alt?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme, $alt }) =>
    $alt ? theme.colors.surface : theme.colors.background};
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

export const SectionInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

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

export const CtaButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space[5]};
  padding: clamp(0.8rem, 0.65rem + 0.5vw, 1rem)
    clamp(1.35rem, 1rem + 1.2vw, 1.9rem);
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.accentContrast};
  background: ${({ theme }) => theme.colors.accent};
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.accentSecondary};
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

export const TextLink = styled.span`
  display: inline-block;
  margin-top: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

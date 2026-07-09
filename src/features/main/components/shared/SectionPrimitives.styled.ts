/**
 * 생성 이유: 메인 섹션 공통 레이아웃 스타일을 재사용한다.
 * 역할: Thomas Eduardo식 섹션 라벨·타이틀·CTA 프리미티브다.
 * 책임: 포트폴리오 본문 섹션의 기본 간격·타이포 골격만 제공한다.
 */
import styled from "@emotion/styled";

export const Section = styled.section<{ $alt?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme, $alt }) =>
    $alt ? theme.colors.surface : theme.colors.background};
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

export const SectionInner = styled.div`
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

export const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[6]};
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
  padding: 0.9rem 1.75rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.accentContrast};
  background: ${({ theme }) => theme.colors.accent};
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ theme }) => theme.colors.accentSecondary};
  }
`;

export const TextLink = styled.span`
  display: inline-block;
  margin-top: ${({ theme }) => theme.space[5]};
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.accent};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accentSecondary};
  }
`;

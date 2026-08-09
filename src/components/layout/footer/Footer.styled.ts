/**
 * 생성 이유: 푸터 스타일을 렌더링 로직과 분리한다.
 * 역할: Footer 보조 띠 레이아웃 스타일을 정의한다.
 * 책임: 내비·작은 mailto·소셜·브랜드·카피라이트 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Footer = styled.footer`
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.layout.gutter}
    ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Inner = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
`;

export const TopRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[4]};

  a {
    font-size: ${({ theme }) => theme.typography.small.fontSize};
    font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
    transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

export const Mail = styled.a`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Socials = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Social = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: clamp(1.75rem, 1.5rem + 0.5vw, 2.15rem);
  height: clamp(1.75rem, 1.5rem + 0.5vw, 2.15rem);
  padding: 0 0.45rem;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
  transition:
    color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 30%,
      transparent
    );
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 8%,
      transparent
    );
  }
`;

export const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Brand = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Legal = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

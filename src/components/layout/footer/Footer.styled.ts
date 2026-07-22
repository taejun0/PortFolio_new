/**
 * 생성 이유: 푸터 스타일을 렌더링 로직과 분리한다.
 * 역할: Footer 2단 레이아웃 스타일을 정의한다.
 * 책임: 연락·내비·브랜드·카피라이트 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Footer = styled.footer`
  padding: ${({ theme }) => theme.space[9]} ${({ theme }) => theme.layout.gutter}
    ${({ theme }) => theme.space[7]};
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Inner = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[8]};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[6]};
`;

export const Contact = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Availability = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Email = styled.a`
  font-size: clamp(1.2rem, 0.9rem + 1.8vw, 2rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const TopRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[5]};
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
  gap: ${({ theme }) => theme.space[4]};
`;

export const Brand = styled.p`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Legal = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

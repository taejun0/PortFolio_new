/**
 * 생성 이유: Close 섹션 링크 영역 스타일을 분리한다.
 * 역할: Contact CTA 스타일을 정의한다.
 * 책임: Contact 중앙 정렬·라임 CTA·보조 링크만 소유한다.
 */
import styled from "@emotion/styled";

export const Inner = styled.div`
  max-width: 36rem;
  margin: 0 auto;
  text-align: center;
`;

export const Body = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: 1.125rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LinkRow = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space[5]};
`;

export const Cta = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.95rem 1.9rem;
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

export const Secondary = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space[4]};
`;

export const SecondaryLink = styled.a`
  font-size: 0.9375rem;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

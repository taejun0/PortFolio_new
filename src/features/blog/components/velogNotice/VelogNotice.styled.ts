/**
 * 생성 이유: Velog 안내 배너 스타일을 렌더링과 분리한다.
 * 역할: VelogNotice 레이아웃·타이포 스타일을 정의한다.
 * 책임: 목록 상단 안내 줄 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.space[5]};
  padding: ${({ theme }) => theme.space[4]} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

export const Text = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Link = styled.a`
  margin-left: ${({ theme }) => theme.space[1]};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.accent};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accentSecondary};
    text-decoration: underline;
  }
`;

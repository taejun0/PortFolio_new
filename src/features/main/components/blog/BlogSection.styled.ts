/**
 * 생성 이유: 메인 블로그 티저 스타일을 분리한다.
 * 역할: Blog 리스트·서사 스타일을 정의한다.
 * 책임: Blog 섹션 내부 목록·설명 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const PostList = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const PostItem = styled.li`
  padding: ${({ theme }) => theme.space[5]};
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.borderStrong};

    h3 {
      color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

export const PostMeta = styled.p`
  margin-bottom: ${({ theme }) => theme.space[1]};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PostTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s ease;
`;

export const PostDesc = styled.p`
  font-size: 0.9375rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Description = styled.div`
  margin-top: ${({ theme }) => theme.space[5]};
`;

export const Stats = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: 1.0625rem;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

export const Empty = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * 생성 이유: 블로그 상세 스타일을 목록과 분리한다.
 * 역할: BlogDetailPage 레이아웃·본문·댓글 영역 스타일을 정의한다.
 * 책임: 다크 톤 상세 페이지 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.article`
  width: 100%;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: 40rem;
  margin: 0 auto;
`;

export const BackLink = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.accent};
`;

export const Badge = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[3]};
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.accentContrast};
  background: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: ${({ theme }) => theme.colors.text};
`;

export const Meta = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const DiscussionLink = styled.a`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.accent};
`;

export const Content = styled.div`
  font-size: 1.0625rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};

  h2,
  h3 {
    margin: ${({ theme }) => theme.space[7]} 0 ${({ theme }) => theme.space[3]};
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    letter-spacing: -0.015em;
  }

  p {
    margin-bottom: ${({ theme }) => theme.space[4]};
    color: ${({ theme }) => theme.colors.textMuted};
  }

  ul,
  ol {
    margin: 0 0 ${({ theme }) => theme.space[4]} 1.25rem;
    list-style: revert;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: underline;
  }

  img {
    margin: ${({ theme }) => theme.space[5]} 0;
    border-radius: 0.75rem;
  }

  code {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.9em;
  }

  pre {
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.space[5]};
    padding: ${({ theme }) => theme.space[4]};
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const Comments = styled.section`
  margin-top: ${({ theme }) => theme.space[9]};
  padding-top: ${({ theme }) => theme.space[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CommentsTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

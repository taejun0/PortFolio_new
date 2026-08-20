/**
 * 생성 이유: 블로그 상세 스타일을 목록과 분리한다.
 * 역할: BlogDetailPage 레이아웃·본문·댓글 영역 스타일을 정의한다.
 * 책임: 테마 토큰 기준 상세 레이아웃과 본문(제목·코드 블록) 시각을 소유한다.
 */
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";

export const Wrapper = styled.article`
  width: 100%;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: min(40rem, 100%);
  margin: 0 auto;
`;

export const BackLink = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Meta = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const DiscussionLink = styled.a`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.accent};
  ${hoverArrowParent}
`;

export const Content = styled.div`
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};

  > * {
    content-visibility: auto;
    contain-intrinsic-block-size: auto 8rem;
  }

  h1,
  h2,
  h3 {
    margin: ${({ theme }) => theme.space[7]} 0 ${({ theme }) => theme.space[3]};
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    letter-spacing: -0.015em;
    color: ${({ theme }) => theme.colors.text};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.quote.fontSize};
    line-height: ${({ theme }) => theme.typography.quote.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.quote.letterSpacing};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.heading.fontSize};
    line-height: ${({ theme }) => theme.typography.heading.lineHeight};
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
    display: block;
    max-width: 100%;
    height: auto;
    margin: ${({ theme }) => theme.space[5]} auto;
    border-radius: ${({ theme }) => theme.layout.radius.md};
  }

  p:has(> img) {
    text-align: center;
  }

  p:has(> img) img {
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
  }

  figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: ${({ theme }) => theme.space[5]} 0;
  }

  figure img {
    margin: 0 auto;
  }

  :not(pre) > code {
    padding: 0.15em 0.4em;
    border-radius: ${({ theme }) => theme.layout.radius.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surfaceAlt};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.86em;
    color: ${({ theme }) => theme.colors.text};
  }

  pre {
    overflow-x: auto;
    margin: 0 0 ${({ theme }) => theme.space[5]};
    padding: ${({ theme }) => theme.space[4]};
    border-radius: ${({ theme }) => theme.layout.radius.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  pre code {
    display: block;
    padding: 0;
    border: 0;
    background: transparent;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.86em;
    line-height: 1.65;
    color: inherit;
    white-space: pre;
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

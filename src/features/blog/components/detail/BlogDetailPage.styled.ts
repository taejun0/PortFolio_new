/**
 * 생성 이유: 블로그 상세 스타일을 목록과 분리한다.
 * 역할: BlogDetailPage 레이아웃·본문·댓글 영역 스타일을 정의한다.
 * 책임: 테마 토큰 기준 상세 레이아웃과 본문(제목·코드 블록·이미지) 시각을 소유한다.
 *       읽기 화면이라 본문에는 등장 모션을 두지 않는다(제목 커튼만 — 컴포넌트가 건다).
 *       본문 제목은 마크다운 변환이 한 단계 내려 넣으므로(페이지 h1은 글 제목 하나) 단계별 스타일도 한 칸 내려 둔다.
 *       본문 이미지는 마크다운 변환이 넣은 width·height로 비율 자리를 먼저 잡는다(CLS 0).
 *       본문 블록에 content-visibility를 두지 않는다 — 실제 높이로 한 번에 배치돼 스크롤 길이·복원 위치가 흔들리지 않는다.
 */
import styled from "@emotion/styled";
import Link from "next/link";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import { underlineSweep } from "@/components/common/motion";

/**
 * 커튼 리빌(글 제목) 색을 이 페이지 면과 같은 선언에서 준다 — 면 색이 바뀌면 덮개도 함께 바뀐다
 * (전역 --motion-canvas와 같은 값이지만, 페이지 면에 직접 묶어 둔다).
 */
export const Wrapper = styled.article`
  --reveal-curtain: ${({ theme }) => theme.colors.background};

  width: 100%;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
`;

/** 목록으로 — 프로젝트 상세와 같이 호버·키보드 포커스에서 1px 선이 왼쪽부터 그어진다. */
export const BackLink = styled(Link)`
  ${underlineSweep()}
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

/**
 * 본문 — 마크다운 변환이 제목을 한 단계 내려 넣는다(# → h2, ## → h3, ### → h4). 크기는 원래 단계 그대로다:
 * h2(#)는 quote, h3(##)는 heading, h4(###)는 브라우저 기본 h3 크기(1.17em)를 지정해 내린 뒤에도 같게 보인다.
 * 블록마다 content-visibility를 두지 않는다 — 문단·제목이 각각 자리 높이(추정치)로 칠해졌다가 실제 높이로
 * 바뀌며 스크롤 막대·새로고침 복원 위치가 흔들렸고, 이 길이의 글에서는 렌더 이득도 없었다.
 */
export const Content = styled.div`
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};

  h2,
  h3,
  h4 {
    margin: ${({ theme }) => theme.space[7]} 0 ${({ theme }) => theme.space[3]};
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    letter-spacing: -0.015em;
    color: ${({ theme }) => theme.colors.text};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.quote.fontSize};
    line-height: ${({ theme }) => theme.typography.quote.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.quote.letterSpacing};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.heading.fontSize};
    line-height: ${({ theme }) => theme.typography.heading.lineHeight};
  }

  /* 내리기 전 h3·h4·h5의 브라우저 기본 크기를 그대로 둔다 */
  h4 {
    font-size: 1.17em;
  }

  h5 {
    font-size: 1em;
  }

  h6 {
    font-size: 0.83em;
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
    border: 0;
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
    border: ${({ theme }) => theme.layout.borderWidth.card} solid ${({ theme }) => theme.colors.border};
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

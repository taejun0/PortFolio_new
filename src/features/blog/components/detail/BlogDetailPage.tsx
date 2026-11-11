/**
 * 생성 이유: 블로그 상세 UI를 라우트 계층과 분리한다.
 * 역할: /blog/[slug] feature 컴포넌트다.
 * 책임: 본문 HTML과 출처별 댓글(마크다운=Giscus, Discussion=GitHub 링크)을 조합한다.
 *       모션은 제목 커튼 스윕 하나뿐이다(첫 페인트부터 칠해져 LCP 안전) — 읽는 화면이라 본문은 움직이지 않는다.
 */
"use client";

import SplashScreen from "@/components/layout/splash/SplashScreen";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { SweepText } from "@/components/common/motion";
import * as S from "./BlogDetailPage.styled";
import BlogComments from "../comments/BlogComments";
import { BLOG_PAGE_UI } from "../../constants";
import type { BlogPost } from "../../types";
import { ROUTES } from "@/constants/routes";

type BlogDetailPageProps = {
  post: BlogPost;
};

const BlogDetailPage = ({ post }: BlogDetailPageProps) => (
  <S.Wrapper>
    <SplashScreen />
    <S.Inner>
      <S.BackLink href={ROUTES.BLOG}>{BLOG_PAGE_UI.backToList}</S.BackLink>
      {/* 긴 제목도 1.4s 안에 끝나도록 어절 길이는 기본(text) 그대로 둔다. */}
      <SweepText as={S.Title} variant="curtain">
        {post.title}
      </SweepText>
      <S.Meta>
        {post.date}
        {post.tags.length > 0 ? ` · ${post.tags.join(", ")}` : ""}
      </S.Meta>
      {post.discussionUrl ? (
        <S.DiscussionLink
          href={post.discussionUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {BLOG_PAGE_UI.discussionLink}
          <HoverArrow aria-hidden />
        </S.DiscussionLink>
      ) : null}
      <S.Content dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <S.Comments>
        <S.CommentsTitle>{BLOG_PAGE_UI.commentsHeading}</S.CommentsTitle>
        {post.source === "discussion" && post.discussionUrl ? (
          <S.DiscussionLink
            href={post.discussionUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {BLOG_PAGE_UI.discussionCommentsHint}
            <HoverArrow aria-hidden />
          </S.DiscussionLink>
        ) : (
          <BlogComments />
        )}
      </S.Comments>
    </S.Inner>
  </S.Wrapper>
);

export default BlogDetailPage;

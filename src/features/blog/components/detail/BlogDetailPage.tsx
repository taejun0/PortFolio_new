/**
 * 생성 이유: 블로그 상세 UI를 라우트 계층과 분리한다.
 * 역할: /blog/[slug] feature 컴포넌트다.
 * 책임: 본문 HTML과 출처별 댓글(마크다운=Giscus, Discussion=GitHub 링크)을 조합한다.
 */
"use client";

import Link from "next/link";

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
    <S.Inner>
      <Link href={ROUTES.BLOG}>
        <S.BackLink>{BLOG_PAGE_UI.backToList}</S.BackLink>
      </Link>
      <S.Title>{post.title}</S.Title>
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
          </S.DiscussionLink>
        ) : (
          <BlogComments />
        )}
      </S.Comments>
    </S.Inner>
  </S.Wrapper>
);

export default BlogDetailPage;

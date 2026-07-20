/**
 * 생성 이유: 블로그 목록 UI를 라우트 계층과 분리한다.
 * 역할: /blog 페이지 feature 컴포넌트다.
 * 책임: Velog 안내·글 리스트·우측 썸네일 플로팅을 렌더링한다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";

import * as S from "./BlogPage.styled";
import VelogNotice from "./components/velogNotice/VelogNotice";
import { BLOG_PAGE_UI, formatBlogPostNumber } from "./constants";
import type { BlogPostMeta } from "./types";
import { blogDetailPath } from "@/constants/routes";

type BlogPageProps = {
  posts: BlogPostMeta[];
};

const BlogPage = ({ posts }: BlogPageProps) => (
  <S.Wrapper>
    <S.Inner>
      <S.Label>{BLOG_PAGE_UI.label}</S.Label>
      <S.Title>{BLOG_PAGE_UI.title}</S.Title>
      <S.Subtitle>{BLOG_PAGE_UI.subtitle}</S.Subtitle>
      {posts.length === 0 ? (
        <S.Empty>{BLOG_PAGE_UI.empty}</S.Empty>
      ) : (
        <S.List>
          {posts.map((post, index) => (
            <S.Item key={post.slug}>
              <Link href={blogDetailPath(post.slug)}>
                <S.Row>
                  <S.Copy>
                    <S.Index>
                      {formatBlogPostNumber(index, posts.length)}
                      {post.source === "discussion"
                        ? ` · ${BLOG_PAGE_UI.discussionBadge}`
                        : ""}
                    </S.Index>
                    <S.ItemTitle>{post.title}</S.ItemTitle>
                    <S.ItemDescription>{post.description}</S.ItemDescription>
                    <S.Meta>
                      {post.date}
                      {post.tags.length > 0 ? ` · ${post.tags.join(", ")}` : ""}
                    </S.Meta>
                  </S.Copy>
                  {post.thumbnail ? (
                    <S.ThumbWrap>
                      <S.Thumb>
                        <Image
                          src={post.thumbnail}
                          alt=""
                          width={280}
                          height={180}
                          sizes="(max-width: 768px) 40vw, 220px"
                        />
                      </S.Thumb>
                    </S.ThumbWrap>
                  ) : null}
                </S.Row>
              </Link>
            </S.Item>
          ))}
        </S.List>
      )}
      <VelogNotice />
    </S.Inner>
  </S.Wrapper>
);

export default BlogPage;

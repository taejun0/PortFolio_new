/**
 * 생성 이유: 메인에서 최근 글과 글쓰기 이유를 보여 주기 위함이다.
 * 역할: Blog 티저 섹션 컴포넌트다.
 * 책임: Velog/포폴 글 수 서사, 최근 글, /blog CTA를 렌더링한다.
 */
"use client";

import Link from "next/link";

import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./BlogSection.styled";
import { MAIN_BLOG_UI, MAIN_SECTION_IDS } from "../../constants";
import { ROUTES, blogDetailPath } from "@/constants/routes";
import type { BlogPostMeta } from "@/features/blog/types";

type BlogSectionProps = {
  posts: BlogPostMeta[];
};

const BlogSection = ({ posts }: BlogSectionProps) => {
  const portfolioCount = posts.length;
  const total = MAIN_BLOG_UI.velogCount + portfolioCount;

  return (
    <P.Section id={MAIN_SECTION_IDS.blog}>
      <P.SectionInner>
        <P.Label>{MAIN_BLOG_UI.label}</P.Label>
        <P.Title>{MAIN_BLOG_UI.title}</P.Title>
        {posts.length === 0 ? (
          <S.Empty>{MAIN_BLOG_UI.empty}</S.Empty>
        ) : (
          <S.PostList>
            {posts.map((post) => (
              <S.PostItem key={post.slug}>
                <Link href={blogDetailPath(post.slug)}>
                  <S.PostMeta>{post.date}</S.PostMeta>
                  <S.PostTitle>{post.title}</S.PostTitle>
                  {post.description ? (
                    <S.PostDesc>{post.description}</S.PostDesc>
                  ) : null}
                </Link>
              </S.PostItem>
            ))}
          </S.PostList>
        )}
        <S.Description>
          <S.Stats>
            {MAIN_BLOG_UI.statsTemplate(
              MAIN_BLOG_UI.velogCount,
              portfolioCount,
              total
            )}
          </S.Stats>
          {MAIN_BLOG_UI.paragraphs.map((paragraph) => (
            <P.Body key={paragraph}>{paragraph}</P.Body>
          ))}
        </S.Description>
        <Link href={ROUTES.BLOG}>
          <P.TextLink>
            {MAIN_BLOG_UI.cta} {"->"}
          </P.TextLink>
        </Link>
      </P.SectionInner>
    </P.Section>
  );
};

export default BlogSection;

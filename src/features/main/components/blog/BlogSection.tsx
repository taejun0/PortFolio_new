/**
 * 생성 이유: 메인에서 최근 글을 가벼운 Articles 리스트로 보여 준다.
 * 역할: Blog 티저 섹션 컴포넌트다.
 * 책임: 통계·최근 글 행·/blog CTA만 렌더링한다.
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

const BlogSection = ({ posts }: BlogSectionProps) => (
  <P.Section id={MAIN_SECTION_IDS.blog}>
    <P.SectionInner>
      <P.Label>{MAIN_BLOG_UI.label}</P.Label>
      <S.Header>
        <P.Title $flush>{MAIN_BLOG_UI.title}</P.Title>
        <S.Aside>{MAIN_BLOG_UI.aside}</S.Aside>
      </S.Header>
      <S.Stats>
        {MAIN_BLOG_UI.statsTemplate(MAIN_BLOG_UI.velogCount, posts.length)}
      </S.Stats>
      {posts.length === 0 ? (
        <S.Empty>{MAIN_BLOG_UI.empty}</S.Empty>
      ) : (
        <S.PostList>
          {posts.map((post) => (
            <S.PostItem key={post.slug}>
              <Link href={blogDetailPath(post.slug)}>
                <S.PostMeta>{post.date}</S.PostMeta>
                <S.PostTitle>{post.title}</S.PostTitle>
                <S.Arrow aria-hidden>→</S.Arrow>
              </Link>
            </S.PostItem>
          ))}
        </S.PostList>
      )}
      <S.CtaWrap>
        <Link href={ROUTES.BLOG}>
          <P.TextLink>{MAIN_BLOG_UI.cta} →</P.TextLink>
        </Link>
      </S.CtaWrap>
    </P.SectionInner>
  </P.Section>
);

export default BlogSection;

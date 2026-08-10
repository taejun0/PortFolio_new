/**
 * 생성 이유: 메인에서 대표 글을 가벼운 Articles 리스트로 보여 준다.
 * 역할: Blog 티저 섹션 컴포넌트다.
 * 책임: 분량 시그널·큐레이션 글 행·목록/Velog CTA만 렌더링한다.
 */
"use client";

import Link from "next/link";

import {
  HoverArrow,
} from "@/components/common/hoverArrow/HoverArrow.styled";
import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./BlogSection.styled";
import {
  MAIN_BLOG_FEATURED,
  MAIN_BLOG_UI,
  MAIN_SECTION_IDS,
} from "../../constants";
import { ROUTES, blogDetailPath } from "@/constants/routes";
import { SITE_CONFIG } from "@/lib/siteConfig";

const BlogSection = () => (
  <P.Section id={MAIN_SECTION_IDS.blog}>
    <P.SectionInner>
      <P.Label>{MAIN_BLOG_UI.label}</P.Label>
      <S.Header>
        <P.Title $flush>{MAIN_BLOG_UI.title}</P.Title>
        <S.Aside>{MAIN_BLOG_UI.aside}</S.Aside>
      </S.Header>
      <S.Stats>{MAIN_BLOG_UI.stats}</S.Stats>
      <S.PostList>
        {MAIN_BLOG_FEATURED.map((post) => {
          const href = post.external
            ? post.href
            : blogDetailPath(post.slug);
          const linkProps = post.external
            ? {
                href,
                target: "_blank" as const,
                rel: "noopener noreferrer",
              }
            : { href };

          return (
            <S.PostItem key={post.title}>
              <a {...linkProps}>
                <S.PostMeta>{post.date}</S.PostMeta>
                <S.PostCopy>
                  <S.PostTitle>{post.title}</S.PostTitle>
                  <S.PostNote>{post.meta}</S.PostNote>
                </S.PostCopy>
                <S.Arrow data-hover-arrow aria-hidden />
              </a>
            </S.PostItem>
          );
        })}
      </S.PostList>
      <S.CtaWrap>
        <Link href={ROUTES.BLOG}>
          <P.TextLink>
            {MAIN_BLOG_UI.cta}
            <HoverArrow aria-hidden />
          </P.TextLink>
        </Link>
        <a
          href={SITE_CONFIG.velog}
          target="_blank"
          rel="noopener noreferrer"
        >
          <P.TextLink>
            {MAIN_BLOG_UI.velogCta}
            <HoverArrow aria-hidden />
          </P.TextLink>
        </a>
      </S.CtaWrap>
    </P.SectionInner>
  </P.Section>
);

export default BlogSection;

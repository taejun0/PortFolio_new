/**
 * 생성 이유: 블로그 목록 UI를 라우트 계층과 분리한다.
 * 역할: /blog 페이지 feature 컴포넌트다.
 * 책임: Velog 안내·글 리스트·호버 미리보기 썸네일을 렌더링한다.
 *       모션 — 페이지 제목은 캔버스색 커튼이 걷히는 스윕(LCP 안전), 라벨·리드는 어절 스윕,
 *       글 카드는 화면에 함께 들어온 것끼리 위에서부터 차례로 쓸려 들어온다(메인 Articles 행과 같은 문법).
 */
"use client";

import SplashScreen from "@/components/layout/splash/SplashScreen";

import Image from "next/image";
import Link from "next/link";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, SweepText } from "@/components/common/motion";
import { motionTokens } from "@/styles/theme";
import * as S from "./BlogPage.styled";
import VelogNotice from "./components/velogNotice/VelogNotice";
import { BLOG_PAGE_UI, formatBlogPostNumber } from "./constants";
import type { BlogPostMeta } from "./types";
import { blogDetailPath } from "@/constants/routes";

/** 태블릿 이상에서 본문 오른쪽에 놓이는 고정 비율 썸네일. */
const THUMB_SIZES = "180px";

type BlogPageProps = {
  posts: BlogPostMeta[];
};

const BlogPage = ({ posts }: BlogPageProps) => (
  <S.Wrapper>
    <SplashScreen />
    <S.Inner>
      <SweepText as={S.Label}>{BLOG_PAGE_UI.label}</SweepText>
      <SweepText
        as={S.Title}
        variant="curtain"
        duration={motionTokens.duration.title}
      >
        {BLOG_PAGE_UI.title}
      </SweepText>
      <SweepText as={S.Subtitle}>{BLOG_PAGE_UI.subtitle}</SweepText>
      {posts.length === 0 ? (
        <S.Empty>{BLOG_PAGE_UI.empty}</S.Empty>
      ) : (
        <S.List>
          {posts.map((post, index) => (
            <Reveal as={S.Item} key={post.slug}>
              <Link href={blogDetailPath(post.slug)} aria-labelledby={`blog-post-${post.slug}`}>
                <S.Row $hasThumbnail={Boolean(post.thumbnail)}>
                  <S.Copy>
                    <S.Meta>
                      <S.Index aria-hidden>
                        {formatBlogPostNumber(index, posts.length)}
                      </S.Index>
                      <time dateTime={post.date}>{post.date}</time>
                      {post.tags.length > 0 && <S.Tags>{post.tags.join(" · ")}</S.Tags>}
                    </S.Meta>
                    <S.ItemTitle id={`blog-post-${post.slug}`}>{post.title}</S.ItemTitle>
                    <S.ItemDescription>{post.description}</S.ItemDescription>
                  </S.Copy>
                  {post.thumbnail ? (
                    <S.ThumbWrap>
                      <S.Thumb>
                        {/* 같은 링크 안 제목이 이름을 주므로 썸네일은 장식으로 둔다(링크 이름 중복 방지). */}
                        <Image
                          src={post.thumbnail}
                          alt=""
                          fill
                          sizes={THUMB_SIZES}
                        />
                      </S.Thumb>
                    </S.ThumbWrap>
                  ) : null}
                  <S.Arrow aria-hidden><HoverArrow /></S.Arrow>
                </S.Row>
              </Link>
            </Reveal>
          ))}
        </S.List>
      )}
      <VelogNotice />
    </S.Inner>
  </S.Wrapper>
);

export default BlogPage;

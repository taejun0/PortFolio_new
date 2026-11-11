/**
 * 생성 이유: 메인에서 대표 글을 가벼운 Articles 리스트로 보여 준다.
 * 역할: Blog 티저 섹션 컴포넌트다.
 * 책임: 헤더 줄 분량 시그널·번호 매긴 큐레이션 글 행·목록/Velog CTA만 렌더링한다.
 *       큐레이션 순서를 지키도록 날짜는 번호 열이 아니라 메타 줄에 둔다.
 *       등장: 라벨·타이틀·보조 문구는 어절 스윕(섹션 헤더 공통), 분량 pill은 블록 스윕, CTA 두 개는 짧은 순차 스윕,
 *       글 행은 행마다 스윕(같이 들어온 요소는 컨트롤러가 읽는 순서대로 60ms씩 잇는다).
 */
"use client";

import Link from "next/link";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, RollText, SweepText } from "@/components/common/motion";
import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./BlogSection.styled";
import {
  MAIN_BLOG_FEATURED,
  MAIN_BLOG_UI,
  MAIN_SECTION_IDS,
} from "../../constants";
import { ROUTES, blogDetailPath } from "@/constants/routes";
import { SITE_CONFIG } from "@/lib/siteConfig";

/** 큐레이션 순번 (01, 02 …) */
const toOrder = (index: number) => String(index + 1).padStart(2, "0");

/** ISO 날짜를 사이트 공통 점 표기(2025.11.17)로 바꾼다. */
const toDotDate = (date: string) => date.replaceAll("-", ".");

const BlogSection = () => (
  <P.Section id={MAIN_SECTION_IDS.blog} $alt $fit>
    <P.SectionInner>
      <SweepText as={P.Label}>{MAIN_BLOG_UI.label}</SweepText>
      <S.Header>
        <SweepText as={P.Title} $flush>
          {MAIN_BLOG_UI.title}
        </SweepText>
        <S.HeaderMeta>
          <SweepText as={S.Aside}>{MAIN_BLOG_UI.aside}</SweepText>
          <Reveal as={S.Stat}>
            {MAIN_BLOG_UI.stat.label}
            <S.StatValue>{MAIN_BLOG_UI.stat.value}</S.StatValue>
          </Reveal>
        </S.HeaderMeta>
      </S.Header>
      <S.PostList>
        {MAIN_BLOG_FEATURED.map((post, index) => {
          const content = (
            <>
              <S.PostIndex aria-hidden>{toOrder(index)}</S.PostIndex>
              <S.PostCopy>
                <S.PostTitle>{post.title}</S.PostTitle>
                <S.PostMeta>
                  <time dateTime={post.date}>{toDotDate(post.date)}</time>
                  {` · ${post.source} · ${post.topic}`}
                  {post.highlight ? (
                    <>
                      {" · "}
                      <S.PostHighlight>{post.highlight}</S.PostHighlight>
                    </>
                  ) : null}
                </S.PostMeta>
              </S.PostCopy>
              <S.Arrow data-hover-arrow aria-hidden />
            </>
          );

          return (
            <Reveal as={S.PostItem} key={post.title}>
              {post.external ? (
                <a href={post.href} target="_blank" rel="noopener noreferrer">
                  {content}
                  <S.SrOnly>{MAIN_BLOG_UI.newTab}</S.SrOnly>
                </a>
              ) : (
                <Link href={blogDetailPath(post.slug)}>{content}</Link>
              )}
            </Reveal>
          );
        })}
      </S.PostList>
      <Reveal as={S.CtaWrap} variant="stagger">
        <Link href={ROUTES.BLOG}>
          <P.TextLink>
            <RollText>{MAIN_BLOG_UI.cta}</RollText>
            <HoverArrow aria-hidden />
          </P.TextLink>
        </Link>
        <a
          href={SITE_CONFIG.velog}
          target="_blank"
          rel="noopener noreferrer"
        >
          <P.TextLink>
            <RollText>{MAIN_BLOG_UI.velogCta}</RollText>
            <HoverArrow aria-hidden />
          </P.TextLink>
          <S.SrOnly>{MAIN_BLOG_UI.newTab}</S.SrOnly>
        </a>
      </Reveal>
    </P.SectionInner>
  </P.Section>
);

export default BlogSection;

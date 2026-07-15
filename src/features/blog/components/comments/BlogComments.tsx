/**
 * 생성 이유: GitHub Discussions 기반 댓글을 마크다운 글 상세에 붙이기 위함이다.
 * 역할: Giscus 위젯 래퍼 컴포넌트다.
 * 책임: pathname 매핑으로 마크다운 글 댓글을 연결하고, 미설정 시 안내를 표시한다.
 */
"use client";

import Giscus from "@giscus/react";

import { GISCUS_CONFIG } from "@/lib/siteConfig";
import { BLOG_PAGE_UI } from "../../constants";

const BlogComments = () => {
  if (!GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
    return <p>{BLOG_PAGE_UI.giscusNotConfigured}</p>;
  }

  return (
    <Giscus
      repo={GISCUS_CONFIG.repo}
      repoId={GISCUS_CONFIG.repoId}
      category={GISCUS_CONFIG.category}
      categoryId={GISCUS_CONFIG.categoryId}
      mapping={GISCUS_CONFIG.mapping}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={GISCUS_CONFIG.theme}
      lang={GISCUS_CONFIG.lang}
      loading="lazy"
    />
  );
};

export default BlogComments;

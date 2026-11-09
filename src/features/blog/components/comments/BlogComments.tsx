/**
 * 생성 이유: GitHub Discussions 기반 댓글을 마크다운 글 상세에 붙이기 위함이다.
 * 역할: Giscus 위젯 래퍼 컴포넌트다.
 * 책임: pathname 매핑으로 마크다운 글 댓글을 연결하고, 테마 모드에 맞춰 Giscus를 동기화한다.
 *       위젯(@giscus/react 청크·iframe)은 댓글 자리가 화면 600px 안으로 다가올 때 처음 붙인다 — 글을 여는 순간
 *       본문과 대역폭·메인 스레드를 다투지 않는다. 그 전에는 높이를 잡아 둔 빈 자리만 그린다.
 *       IntersectionObserver가 없는 브라우저에서는 곧바로 붙인다. Giscus 값이 비어 있으면 안내 문구만 보인다.
 *       모드는 가벼운 themeModeContext에서 읽는다(Provider 구현을 상세 번들에 끌고 오지 않는다).
 */
"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { useThemeMode } from "@/components/theme/themeModeContext";
import { GISCUS_CONFIG } from "@/lib/siteConfig";
import * as S from "./BlogComments.styled";
import { BLOG_PAGE_UI } from "../../constants";

const Giscus = dynamic(() => import("@giscus/react"), { ssr: false });

/** 댓글 자리가 뷰포트 아래 이만큼 안으로 들어오면 위젯을 붙인다(빠른 스크롤에도 도착 전에 로드가 시작된다). */
const NEAR_ROOT_MARGIN = "600px 0px";

const isConfigured = Boolean(GISCUS_CONFIG.repoId && GISCUS_CONFIG.categoryId);

/** 자리가 화면 근처에 처음 들어온 뒤로 true — 한 번 붙인 위젯은 다시 떼지 않는다. */
const useNearViewport = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target || near) return;

    const supported = typeof IntersectionObserver !== "undefined";
    const observer = supported
      ? new IntersectionObserver(
          (entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer?.disconnect();
            setNear(true);
          },
          { rootMargin: NEAR_ROOT_MARGIN }
        )
      : null;

    if (observer) {
      observer.observe(target);
      return () => observer.disconnect();
    }

    // 관찰할 수 없으면 기다리지 않고 붙인다(다음 프레임 — 첫 그리기와 겹치지 않게).
    const frame = window.requestAnimationFrame(() => setNear(true));
    return () => window.cancelAnimationFrame(frame);
  }, [near]);

  return { ref, near };
};

const LazyGiscus = () => {
  const { mode } = useThemeMode();
  const { ref, near } = useNearViewport<HTMLDivElement>();

  return (
    <S.Slot ref={ref}>
      {near ? (
        <Giscus
          repo={GISCUS_CONFIG.repo}
          repoId={GISCUS_CONFIG.repoId}
          category={GISCUS_CONFIG.category}
          categoryId={GISCUS_CONFIG.categoryId}
          mapping={GISCUS_CONFIG.mapping}
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={mode === "light" ? "light" : "dark"}
          lang={GISCUS_CONFIG.lang}
          loading="lazy"
        />
      ) : null}
    </S.Slot>
  );
};

const BlogComments = () =>
  isConfigured ? (
    <LazyGiscus />
  ) : (
    <p>{BLOG_PAGE_UI.giscusNotConfigured}</p>
  );

export default BlogComments;

/**
 * 생성 이유: Trajectory 레일을 framer-motion 없이 스크롤에 맞춰 그리고, 라인 끝이 닿은 도트를 켠다.
 * 역할: 레일 진행선 대체 경로(rAF)와 도트·기간 켜짐(IntersectionObserver)을 맡는 훅이다.
 * 책임: 행(li)의 data-reached와, scroll-driven animation 미지원 브라우저에서만 진행선 transform을 쓴다.
 *
 * 라인 끝 = 스캔선(뷰포트 위에서 RAIL_SCAN_LINE 지점). 라인은 스크롤을 따라 위에서 자라고 끝은 스캔선에 머문다.
 * - 진행선: animation-timeline(view)을 지원하면 CSS가 컴포지터에서 스크롤과 같은 프레임에 그린다(JS 없음).
 *   미지원 브라우저는 스크롤 때만 rAF 한 번으로 트랙 위치를 읽고 scaleY만 쓴다(목록 근처에 있을 때만 듣는다).
 * - 도트: 도트가 스캔선 위로 올라가면 그 행에 data-reached를 단다 — 라인 끝이 도트를 지나는 순간과 같다.
 *   위로 스크롤해 라인이 물러나면 다시 꺼진다. 상태는 DOM 속성이라 React 렌더가 없다.
 * - 모션이 꺼져 있으면(JS 없음·동작 줄이기·인쇄) 아무것도 하지 않는다 — CSS가 완성 상태로 둔다.
 */
"use client";

import { useEffect, type RefObject } from "react";

/** 라인 끝이 머무는 뷰포트 높이 비율(위에서부터) — CSS 진행 범위와 도트 판정선이 함께 쓴다. */
export const RAIL_SCAN_LINE = 0.7;

/** 도트·행 연결 훅 — 행은 도트의 부모(li)다. */
export const RAIL_DOT_ATTR = "data-dot";
export const RAIL_REACHED_ATTR = "data-reached";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** 스캔선 위(뷰포트 위로 지나간 곳 포함)를 모두 판정 영역으로 둔다. */
const SCAN_ROOT_MARGIN = `100000px 0px -${Math.round(
  (1 - RAIL_SCAN_LINE) * 100
)}% 0px`;

type RailRefs = {
  listRef: RefObject<HTMLElement | null>;
  /** 레일 트랙 — 진행선의 기준 상자(첫 도트 중심 ~ 목록 끝) */
  trackRef: RefObject<HTMLElement | null>;
  /** 진행선 — 미지원 브라우저에서만 transform을 직접 쓴다 */
  progressRef: RefObject<HTMLElement | null>;
};

const supportsScrollTimeline = () =>
  typeof CSS !== "undefined" && CSS.supports("animation-timeline", "view()");

/** 미지원 브라우저용 — 목록이 근처에 있을 때만 스크롤을 듣고, 프레임마다 한 번 읽고 한 번 쓴다. */
const followScroll = (
  list: HTMLElement,
  track: HTMLElement,
  progress: HTMLElement
) => {
  let frame = 0;

  const update = () => {
    frame = 0;
    const rect = track.getBoundingClientRect();
    const scan = window.innerHeight * RAIL_SCAN_LINE;
    const ratio =
      rect.height > 0
        ? Math.min(Math.max((scan - rect.top) / rect.height, 0), 1)
        : 0;
    progress.style.transform = `scaleY(${ratio.toFixed(4)})`;
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  const near = new IntersectionObserver(
    (entries) => {
      if (entries[entries.length - 1].isIntersecting) {
        window.addEventListener("scroll", schedule, { passive: true });
      } else {
        window.removeEventListener("scroll", schedule);
      }
      // 들고 날 때 한 번 더 맞춰 빠른 스크롤로 건너뛴 끝값(0·1)을 남긴다.
      schedule();
    },
    { rootMargin: "50% 0px" }
  );
  near.observe(list);
  window.addEventListener("resize", schedule, { passive: true });

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    near.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    progress.style.transform = "";
  };
};

export const useTrajectoryRail = ({
  listRef,
  trackRef,
  progressRef,
}: RailRefs) => {
  useEffect(() => {
    const list = listRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!list || !track || !progress) return;
    if (
      !document.documentElement.hasAttribute("data-motion") ||
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      return;
    }

    const dots = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.parentElement?.toggleAttribute(
            RAIL_REACHED_ATTR,
            entry.isIntersecting
          );
        });
      },
      { rootMargin: SCAN_ROOT_MARGIN }
    );
    list
      .querySelectorAll(`[${RAIL_DOT_ATTR}]`)
      .forEach((dot) => dots.observe(dot));

    const stopFollowing = supportsScrollTimeline()
      ? null
      : followScroll(list, track, progress);

    return () => {
      dots.disconnect();
      stopFollowing?.();
    };
  }, [listRef, trackRef, progressRef]);
};

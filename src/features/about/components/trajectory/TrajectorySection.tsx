/**
 * 생성 이유: About 상세에 경험·학력 타임라인을 둔다.
 * 역할: AboutPage Trajectory 챕터다.
 * 책임: Journey 원문 렌더와 스크롤 레일·도트 활성 연출을 관리한다.
 */
"use client";

import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import * as P from "../../AboutPage.styled";
import * as S from "./TrajectorySection.styled";
import { ABOUT_PAGE_UI } from "../../constants";

const ui = ABOUT_PAGE_UI.trajectory;

const TrajectorySection = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const [reached, setReached] = useState<boolean[]>(() =>
    ui.items.map(() => Boolean(reduceMotion)),
  );

  const { scrollYProgress } = useScroll({
    target: listRef,
    // 리스트가 뷰에 들어온 뒤, 끝 항목이 화면 중하단을 지날 때까지 채움
    offset: ["start 0.72", "end 0.28"],
  });

  // 같은 스크롤에서도 라인이 조금 더 아래까지 앞서가게
  const scaleY = useTransform(scrollYProgress, [0, 0.82], [0, 1]);

  const syncDots = useCallback(() => {
    if (reduceMotion) {
      setReached(ui.items.map(() => true));
      return;
    }

    const progressEl = progressRef.current;
    if (!progressEl) return;

    const tipY = progressEl.getBoundingClientRect().bottom;

    const next = itemRefs.current.map((item) => {
      if (!item) return false;
      const dot = item.querySelector<HTMLElement>("[data-dot]");
      if (!dot) return false;
      const dotRect = dot.getBoundingClientRect();
      const dotCenter = dotRect.top + dotRect.height / 2;
      return tipY >= dotCenter;
    });

    setReached((prev) =>
      prev.length === next.length && prev.every((value, i) => value === next[i])
        ? prev
        : next,
    );
  }, [reduceMotion]);

  useMotionValueEvent(scaleY, "change", () => {
    syncDots();
  });

  useEffect(() => {
    syncDots();
    window.addEventListener("resize", syncDots);
    return () => window.removeEventListener("resize", syncDots);
  }, [syncDots]);

  return (
    <P.Chapter $alt $cozy>
      <P.Inner>
        <P.Label>{ui.label}</P.Label>
        <S.Title>{ui.title}</S.Title>
        <S.Subtitle>{ui.subtitle}</S.Subtitle>
        <S.List ref={listRef}>
          <S.Rail aria-hidden />
          <S.RailProgress
            ref={progressRef}
            style={{ scaleY: reduceMotion ? 1 : scaleY }}
            aria-hidden
          />
          {ui.items.map((item, index) => (
            <S.Item
              key={`${item.period}-${item.title}`}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
            >
              <S.Dot data-dot $active={reached[index]} aria-hidden />
              <S.PeriodCol>
                <S.Period $active={reached[index]}>{item.period}</S.Period>
                {"badge" in item && item.badge ? (
                  <S.Badge>{item.badge}</S.Badge>
                ) : null}
              </S.PeriodCol>
              <S.Copy>
                <S.ItemTitle>{item.title}</S.ItemTitle>
                <S.Points>
                  {item.points.map((point) => (
                    <S.Point key={point}>{point}</S.Point>
                  ))}
                </S.Points>
                {"keywords" in item && item.keywords ? (
                  <S.Keywords>
                    {item.keywords.map((keyword) => (
                      <S.Keyword key={keyword}>{keyword}</S.Keyword>
                    ))}
                  </S.Keywords>
                ) : null}
              </S.Copy>
            </S.Item>
          ))}
        </S.List>
      </P.Inner>
    </P.Chapter>
  );
};

export default TrajectorySection;

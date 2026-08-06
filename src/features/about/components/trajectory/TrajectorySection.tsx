/**
 * 생성 이유: About 상세에 경험·학력 타임라인을 둔다.
 * 역할: AboutPage Trajectory 챕터다.
 * 책임: Journey 원문 렌더와 스크롤에 따라 왼쪽 레일이 아래로 이어지는 연출을 관리한다.
 */
"use client";

import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import * as P from "../../AboutPage.styled";
import * as S from "./TrajectorySection.styled";
import { ABOUT_PAGE_UI } from "../../constants";

const ui = ABOUT_PAGE_UI.trajectory;

const TrajectorySection = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.78", "end 0.42"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <P.Chapter $alt $cozy>
      <P.Inner>
        <P.Label>{ui.label}</P.Label>
        <S.Title>{ui.title}</S.Title>
        <S.Subtitle>{ui.subtitle}</S.Subtitle>
        <S.List ref={listRef}>
          <S.Rail aria-hidden />
          <S.RailProgress
            style={{ scaleY: reduceMotion ? 1 : scaleY }}
            aria-hidden
          />
          {ui.items.map((item) => (
            <S.Item key={`${item.period}-${item.title}`}>
              <S.PeriodCol>
                <S.Period>{item.period}</S.Period>
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

/**
 * 생성 이유: About 상세에 경험·학력 타임라인을 둔다.
 * 역할: AboutPage Trajectory 챕터다.
 * 책임: Journey 원문 렌더와 스크롤 레일·도트 활성·행 등장 연출을 관리한다.
 *
 * 정적 완성형으로 바꾸지 말 것. 라인은 스크롤에 따라 위에서 자라고,
 * 도트는 라인 끝이 닿을 때 켜져야 한다(useTrajectoryRail — framer-motion 없이 CSS view timeline·rAF·IO).
 * 행은 화면에 들어올 때 구분선이 그어지고 기간·본문·키워드가 차례로 쓸려 들어온다(한 번만).
 * 모션 축소·JS 없음 환경은 스타일이 라인을 끝까지 그리고 도트·기간을 모두 켠 상태로 둔다.
 */
"use client";

import { useRef } from "react";

import { Reveal, SweepText } from "@/components/common/motion";
import * as P from "../../AboutPage.styled";
import * as S from "./TrajectorySection.styled";
import { RAIL_DOT_ATTR, useTrajectoryRail } from "./useTrajectoryRail";
import { ABOUT_PAGE_UI } from "../../constants";

const ui = ABOUT_PAGE_UI.trajectory;

const dotHook = { [RAIL_DOT_ATTR]: "" };

const TrajectorySection = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useTrajectoryRail({ listRef, trackRef, progressRef });

  return (
    <S.Chapter id={ui.id} $cozy>
      <P.Inner>
        <SweepText as={P.Label}>{ui.label}</SweepText>
        <S.Header>
          <SweepText as={S.Title}>{ui.title}</SweepText>
          <SweepText as={S.Subtitle}>{ui.subtitle}</SweepText>
        </S.Header>
        <S.List ref={listRef}>
          <S.RailTrack ref={trackRef} aria-hidden>
            <S.Rail />
            <S.RailProgress ref={progressRef} />
          </S.RailTrack>
          {ui.items.map((item) => (
            <Reveal
              key={`${item.period}-${item.title}`}
              as={S.Item}
              variant="group"
            >
              <S.Dot {...dotHook} aria-hidden />
              <S.PeriodCol>
                <S.Period>{item.period}</S.Period>
                {"badge" in item && typeof item.badge === "string" && item.badge ? (
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
              </S.Copy>
              {"keywords" in item && item.keywords ? (
                <S.Keywords aria-label={ui.keywordsLabel}>
                  {item.keywords.map((keyword) => (
                    <S.Keyword key={keyword}>{keyword}</S.Keyword>
                  ))}
                </S.Keywords>
              ) : null}
            </Reveal>
          ))}
        </S.List>
      </P.Inner>
    </S.Chapter>
  );
};

export default TrajectorySection;

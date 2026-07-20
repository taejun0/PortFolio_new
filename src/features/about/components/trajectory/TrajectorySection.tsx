/**
 * 생성 이유: About 상세에 경험·학력 타임라인을 둔다.
 * 역할: AboutPage Trajectory 챕터다.
 * 책임: PortfolioPage Journey 원문 기반 기간·포인트·키워드를 렌더링한다.
 */
"use client";

import * as P from "../../AboutPage.styled";
import * as S from "./TrajectorySection.styled";
import { ABOUT_PAGE_UI } from "../../constants";

const ui = ABOUT_PAGE_UI.trajectory;

const TrajectorySection = () => (
  <P.Chapter $alt $cozy>
    <P.Inner>
      <P.Label>{ui.label}</P.Label>
      <S.Title>{ui.title}</S.Title>
      <S.Subtitle>{ui.subtitle}</S.Subtitle>
      <S.List>
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

export default TrajectorySection;

/**
 * 생성 이유: About me 본문을 히어로와 분리한다.
 * 역할: About 섹션 컴포넌트다.
 * 책임: PortfolioPage About 원문·인적 정보를 렌더링한다.
 */
"use client";

import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./AboutSection.styled";
import { MAIN_ABOUT_UI, MAIN_SECTION_IDS } from "../../constants";

const AboutSection = () => (
  <P.Section id={MAIN_SECTION_IDS.about} $alt>
    <P.SectionInner>
      <P.Label>{MAIN_ABOUT_UI.label}</P.Label>
      <P.Title>{MAIN_ABOUT_UI.title}</P.Title>
      <S.Grid>
        <S.Copy>
          <S.QuoteLead>{MAIN_ABOUT_UI.quoteLead}</S.QuoteLead>
          <S.Quote>{MAIN_ABOUT_UI.quote}</S.Quote>
          {MAIN_ABOUT_UI.paragraphs.map((paragraph) => (
            <P.Body key={paragraph}>{paragraph}</P.Body>
          ))}
        </S.Copy>
        <S.Facts>
          {MAIN_ABOUT_UI.facts.map((fact) => (
            <S.Fact key={fact}>{fact}</S.Fact>
          ))}
        </S.Facts>
      </S.Grid>
    </P.SectionInner>
  </P.Section>
);

export default AboutSection;

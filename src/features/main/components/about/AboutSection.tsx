/**
 * 생성 이유: About me 요약을 메인에 두고 상세는 AboutPage로 보낸다.
 * 역할: 메인 About 섹션 컴포넌트다.
 * 책임: 능력 지표 후킹·짧은 소개·사진·팩트와 /about 진입 CTA를 렌더링한다.
 */
"use client";

import Link from "next/link";

import PortraitFrame from "@/components/common/portraitFrame/PortraitFrame";
import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./AboutSection.styled";
import {
  MAIN_ABOUT_UI,
  MAIN_SECTION_IDS,
  MAIN_STATS_UI,
} from "../../constants";
import { ROUTES } from "@/constants/routes";

const AboutSection = () => (
  <P.Section id={MAIN_SECTION_IDS.about} $alt>
    <P.SectionInner>
      <P.Label>{MAIN_ABOUT_UI.label}</P.Label>
      <P.Title>{MAIN_ABOUT_UI.title}</P.Title>

      <S.Stats aria-label="핵심 지표">
        {MAIN_STATS_UI.items.map((item) => (
          <S.Stat key={`${item.value}-${item.unit}`}>
            <S.StatValue>{item.value}</S.StatValue>
            <S.StatUnit>{item.unit}</S.StatUnit>
            <S.StatDetail>{item.detail}</S.StatDetail>
          </S.Stat>
        ))}
      </S.Stats>

      <S.Layout>
        <S.Portrait>
          <PortraitFrame
            src={MAIN_ABOUT_UI.photo}
            alt={MAIN_ABOUT_UI.photoAlt}
            sizes="(max-width: 768px) 55vw, 296px"
            priority
            aspectRatio="3 / 4"
          />
        </S.Portrait>
        <S.Copy>
          <S.Quote>{MAIN_ABOUT_UI.quote}</S.Quote>
          <S.QuoteLead>{MAIN_ABOUT_UI.quoteLead}</S.QuoteLead>
          {MAIN_ABOUT_UI.paragraphs.map((paragraph) => (
            <S.Body key={paragraph}>{paragraph}</S.Body>
          ))}
          <S.Facts>
            {MAIN_ABOUT_UI.facts.map((fact) => (
              <S.Fact key={fact.label}>
                <S.FactLabel>{fact.label}</S.FactLabel>
                <S.FactValue>{fact.value}</S.FactValue>
              </S.Fact>
            ))}
          </S.Facts>
          <Link href={ROUTES.ABOUT}>
            <P.TextLink>
              {MAIN_ABOUT_UI.cta}
              <HoverArrow aria-hidden />
            </P.TextLink>
          </Link>
        </S.Copy>
      </S.Layout>
    </P.SectionInner>
  </P.Section>
);

export default AboutSection;

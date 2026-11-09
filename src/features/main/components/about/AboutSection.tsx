/**
 * 생성 이유: About me 요약을 메인에 두고 상세는 AboutPage로 보낸다.
 * 역할: 메인 About 섹션 컴포넌트다.
 * 책임: 능력 지표 후킹·짧은 소개·사진·팩트와 /about 진입 CTA를 렌더링한다.
 *       등장은 공용 모션 프리미티브로만 한다 — 라벨·타이틀·인용은 어절 스윕, 지표는 칸마다 짧은 순차 스윕,
 *       초상·문단·팩트는 블록 스윕(같이 들어오면 컨트롤러가 읽는 순서대로 60ms씩 잇는다).
 */
"use client";

import Link from "next/link";

import PortraitFrame from "@/components/common/portraitFrame/PortraitFrame";
import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, RollText, SweepText } from "@/components/common/motion";
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
      <SweepText as={P.Label}>{MAIN_ABOUT_UI.label}</SweepText>
      <SweepText as={P.Title}>{MAIN_ABOUT_UI.title}</SweepText>

      {/* 띠의 규칙선은 그대로 두고 지표 칸(숫자·단위·설명)이 왼쪽부터 차례로 쓸려 들어온다 */}
      <Reveal as={S.Stats} variant="stagger" aria-label={MAIN_STATS_UI.label}>
        {MAIN_STATS_UI.items.map((item) => (
          <S.Stat key={`${item.value}-${item.unit}`}>
            <S.StatValue>{item.value}</S.StatValue>
            <S.StatUnit>{item.unit}</S.StatUnit>
            <S.StatDetail>{item.detail}</S.StatDetail>
          </S.Stat>
        ))}
      </Reveal>

      <S.Layout>
        <Reveal as={S.Portrait}>
          <PortraitFrame
            src={MAIN_ABOUT_UI.photo}
            alt={MAIN_ABOUT_UI.photoAlt}
            sizes={S.PORTRAIT_SIZES}
            aspectRatio="3 / 4"
          />
        </Reveal>
        <S.Copy>
          <SweepText as={S.Quote}>{MAIN_ABOUT_UI.quote}</SweepText>
          <Reveal as={S.QuoteLead}>{MAIN_ABOUT_UI.quoteLead}</Reveal>
          {MAIN_ABOUT_UI.paragraphs.map((paragraph) => (
            <Reveal as={S.Body} key={paragraph}>
              {paragraph}
            </Reveal>
          ))}
          {/* 팩트·CTA는 한 덩어리로 초상 아래 모서리에 맞춘다 */}
          <Reveal as={S.Details}>
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
                <RollText>{MAIN_ABOUT_UI.cta}</RollText>
                <HoverArrow aria-hidden />
              </P.TextLink>
            </Link>
          </Reveal>
        </S.Copy>
      </S.Layout>
    </P.SectionInner>
  </P.Section>
);

export default AboutSection;

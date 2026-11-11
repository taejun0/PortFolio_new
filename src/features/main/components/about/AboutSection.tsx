/**
 * 생성 이유: About me 요약을 메인에 두고 상세는 AboutPage로 보낸다.
 * 역할: 메인 About 섹션 컴포넌트다.
 * 책임: 능력 지표·짧은 소개·사진·최근 인턴십과 /about 진입 CTA를 렌더링한다.
 *       등장은 공용 모션 프리미티브로만 한다 — 라벨·타이틀·인용은 어절 스윕, 지표는 칸마다 짧은 순차 스윕,
 *       초상·문단·경험은 블록 스윕(같이 들어오면 컨트롤러가 읽는 순서대로 60ms씩 잇는다).
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
  <P.Section id={MAIN_SECTION_IDS.about} $alt $fit>
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
          <Reveal as={S.Body}>{MAIN_ABOUT_UI.summary}</Reveal>
          <Reveal as={S.Experience}>
            <S.ExperienceLabel>{MAIN_ABOUT_UI.experience.label}</S.ExperienceLabel>
            <S.ExperienceTitle>{MAIN_ABOUT_UI.experience.title}</S.ExperienceTitle>
            <S.Body>{MAIN_ABOUT_UI.experience.summary}</S.Body>
            <Link href={MAIN_ABOUT_UI.experience.href}>
              <P.TextLink>
                <RollText>{MAIN_ABOUT_UI.experience.cta}</RollText>
                <HoverArrow aria-hidden />
              </P.TextLink>
            </Link>
          </Reveal>
          <Reveal as={S.Details}>
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

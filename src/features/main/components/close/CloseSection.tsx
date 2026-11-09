/**
 * 생성 이유: 메인을 연락 장면으로 마무리하기 위함이다.
 * 역할: Contact 섹션 컴포넌트다.
 * 책임: 공용 섹션 헤더(라벨·타이틀·보조 문구)와 세로형 앞·뒷면 명함
 *       (초상·인사말 / 가용 배지·작업·연락 채널·메일 CTA)을 렌더링한다.
 *       등장: 라벨·타이틀·보조 문구는 어절 스윕(섹션 헤더 공통), 명함은 앞면 → 뒷면 순서로 왼쪽부터 쓸려 들어온다.
 */
"use client";

import Image from "next/image";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, RollText, SweepText } from "@/components/common/motion";
import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./CloseSection.styled";
import {
  MAIN_CLOSE_UI,
  MAIN_HERO_UI,
  MAIN_SECTION_IDS,
} from "../../constants";
import { SITE_CONFIG } from "@/lib/siteConfig";

type Channel = (typeof MAIN_CLOSE_UI.channels)[number];

const MAILTO_HREF = `mailto:${SITE_CONFIG.email}`;

const channelHref = (kind: Channel["hrefKind"]) => {
  if (kind === "mailto") return MAILTO_HREF;
  if (kind === "github") return SITE_CONFIG.github;
  return SITE_CONFIG.velog;
};

/** 표시용 주소는 SITE_CONFIG에서 파생해 URL과 어긋나지 않게 한다. */
const channelValue = (key: Channel["valueKey"]) => {
  if (key === "email") return SITE_CONFIG.email;
  if (key === "githubPath") return SITE_CONFIG.githubPath;
  return SITE_CONFIG.velog
    .replace(/^https?:\/\//, "")
    .replace(/\/posts\/?$/, "");
};

/** 작업 목록을 사이트 공통 번호(01·02…)로 표기한다. */
const toIndex = (index: number) => String(index + 1).padStart(2, "0");

const CloseSection = () => (
  <S.Section
    id={MAIN_SECTION_IDS.close}
    data-close-layout="business-card"
    $fit
  >
    <P.SectionInner>
      <SweepText as={P.Label}>{MAIN_CLOSE_UI.label}</SweepText>
      <S.Header>
        <SweepText as={P.Title} $flush>
          {MAIN_CLOSE_UI.title}
        </SweepText>
        <SweepText as={S.Aside}>{MAIN_CLOSE_UI.note}</SweepText>
      </S.Header>

      {/* 두 장이 함께 들어오면 컨트롤러가 문서 순서(앞면 → 뒷면)로 잇는다 — 지연을 직접 주지 않는다 */}
      <S.Deck data-close-deck>
        <Reveal
          as={S.Card}
          variant="group"
          aria-label={MAIN_CLOSE_UI.frontLabel}
        >
          <S.Front>
            <S.Arch>
              <Image
                src={MAIN_CLOSE_UI.photo}
                alt={MAIN_CLOSE_UI.photoAlt}
                fill
                sizes="(max-width: 480px) 45vw, 220px"
              />
            </S.Arch>
            <S.Quote>
              {MAIN_CLOSE_UI.quoteLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </S.Quote>
          </S.Front>
        </Reveal>

        <Reveal
          as={S.Card}
          variant="group"
          aria-label={MAIN_CLOSE_UI.backLabel}
        >
          <S.Back>
            <S.Identity>
              <S.Badge>
                <S.BadgeDot aria-hidden />
                {MAIN_CLOSE_UI.availability}
              </S.Badge>
              <S.Name>{SITE_CONFIG.author}</S.Name>
              <S.Role>{MAIN_HERO_UI.roles[0]}</S.Role>
            </S.Identity>

            <S.Group>
              <S.GroupHead>
                {MAIN_CLOSE_UI.worksLabel}{" "}
                <S.GroupSep aria-hidden>_</S.GroupSep>{" "}
                {MAIN_CLOSE_UI.worksTitle}
              </S.GroupHead>
              <S.WorksList>
                {MAIN_CLOSE_UI.works.map((item, index) => (
                  <S.WorksItem key={item}>
                    <S.WorksIndex aria-hidden>{toIndex(index)}</S.WorksIndex>
                    {item}
                  </S.WorksItem>
                ))}
              </S.WorksList>
            </S.Group>

            <S.Group>
              <S.Contacts aria-label={MAIN_CLOSE_UI.channelsLabel}>
                {MAIN_CLOSE_UI.channels.map((channel) => {
                  const external = channel.hrefKind !== "mailto";

                  return (
                    <li key={channel.label}>
                      <S.Row
                        href={channelHref(channel.hrefKind)}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        title={channel.hint}
                      >
                        {/* 공백은 그리드에서 렌더링되지 않고, 링크 이름만 "Email 주소"처럼 띄어 읽히게 한다 */}
                        <S.RowLabel>{channel.label}</S.RowLabel>{" "}
                        <S.RowValue>{channelValue(channel.valueKey)}</S.RowValue>
                        {external && (
                          <>
                            {" "}
                            <S.SrOnly>{MAIN_CLOSE_UI.newTab}</S.SrOnly>
                          </>
                        )}
                        <S.RowArrow data-hover-arrow aria-hidden />
                      </S.Row>
                    </li>
                  );
                })}
              </S.Contacts>

              <S.Cta href={MAILTO_HREF}>
                <RollText>{MAIN_CLOSE_UI.cta}</RollText>
                <HoverArrow aria-hidden />
              </S.Cta>
            </S.Group>
          </S.Back>
        </Reveal>
      </S.Deck>
    </P.SectionInner>
  </S.Section>
);

export default CloseSection;

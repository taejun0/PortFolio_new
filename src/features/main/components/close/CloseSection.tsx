/**
 * 생성 이유: 메인을 연락 장면으로 마무리하기 위함이다.
 * 역할: Contact 섹션 컴포넌트다.
 * 책임: 세로형 앞·뒷면 명함과 연락 채널을 렌더링한다.
 */
"use client";

import Image from "next/image";

import * as S from "./CloseSection.styled";
import {
  MAIN_CLOSE_UI,
  MAIN_HERO_UI,
  MAIN_SECTION_IDS,
} from "../../constants";
import { SITE_CONFIG } from "@/lib/siteConfig";

const channelHref = (
  kind: (typeof MAIN_CLOSE_UI.channels)[number]["hrefKind"]
) => {
  if (kind === "mailto") return `mailto:${SITE_CONFIG.email}`;
  if (kind === "github") return SITE_CONFIG.github;
  return SITE_CONFIG.velog;
};

const channelValue = (
  key: (typeof MAIN_CLOSE_UI.channels)[number]["valueKey"]
) => {
  if (key === "email") return SITE_CONFIG.email;
  if (key === "githubPath") return SITE_CONFIG.githubPath;
  return "velog.io/@taejun0";
};

const CloseSection = () => (
  <S.Section id={MAIN_SECTION_IDS.close} data-close-layout="business-card">
    <S.Frame>
      <S.Kicker>{MAIN_CLOSE_UI.label}</S.Kicker>

      <S.Deck data-close-deck>
      <S.Card aria-label="명함 앞면">
        <S.Front>
          <S.FrontStack>
            <S.Arch>
              <Image
                src={MAIN_CLOSE_UI.photo}
                alt={MAIN_CLOSE_UI.photoAlt}
                fill
                sizes="280px"
                style={{ objectFit: "cover", objectPosition: "center 36%" }}
              />
            </S.Arch>
            <S.Quote>
              {MAIN_CLOSE_UI.quoteLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </S.Quote>
          </S.FrontStack>
        </S.Front>
      </S.Card>

      <S.Card aria-label="명함 뒷면">
        <S.Back>
          <S.Identity>
            <S.Name>{SITE_CONFIG.author}</S.Name>
            <S.Role>{MAIN_HERO_UI.roles[0]}</S.Role>
          </S.Identity>

          <S.Body>
            <S.Contacts>
              {MAIN_CLOSE_UI.channels.map((channel) => (
                <S.Row
                  key={channel.label}
                  href={channelHref(channel.hrefKind)}
                  target={channel.hrefKind === "mailto" ? undefined : "_blank"}
                  rel={
                    channel.hrefKind === "mailto"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  title={channel.hint}
                >
                  <S.RowLabel>{channel.label}</S.RowLabel>
                  <S.RowValue>{channelValue(channel.valueKey)}</S.RowValue>
                </S.Row>
              ))}
            </S.Contacts>

            <S.Note>{MAIN_CLOSE_UI.note}</S.Note>

            <S.Rule aria-hidden />

            <S.Works>
              <S.WorksHead>
                {MAIN_CLOSE_UI.worksLabel}
                <S.WorksSep aria-hidden> _ </S.WorksSep>
                {MAIN_CLOSE_UI.worksTitle}
              </S.WorksHead>
              <S.WorksList>
                {MAIN_CLOSE_UI.works.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </S.WorksList>
            </S.Works>
          </S.Body>
        </S.Back>
      </S.Card>
    </S.Deck>
    </S.Frame>
  </S.Section>
);

export default CloseSection;

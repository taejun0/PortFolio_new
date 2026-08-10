/**
 * 생성 이유: 메인을 연락 장면으로 마무리하기 위함이다.
 * 역할: Contact 섹션 컴포넌트다.
 * 책임: 카피·가능 상태·채널 카드·메일 CTA를 렌더링한다.
 */
"use client";

import * as S from "./CloseSection.styled";
import { MAIN_CLOSE_UI, MAIN_SECTION_IDS } from "../../constants";
import { SITE_CONFIG } from "@/lib/siteConfig";
import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";

const channelHref = (kind: (typeof MAIN_CLOSE_UI.channels)[number]["hrefKind"]) => {
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
  <S.Section id={MAIN_SECTION_IDS.close}>
    <S.Inner>
      <S.Intro>
        <S.Label>{MAIN_CLOSE_UI.label}</S.Label>
        <S.Title>{MAIN_CLOSE_UI.title}</S.Title>
        <S.Body>{MAIN_CLOSE_UI.body}</S.Body>
        <S.StatusRow>
          <S.StatusDot aria-hidden />
          <S.Status>{MAIN_CLOSE_UI.availability}</S.Status>
        </S.StatusRow>
        <S.Cta href={`mailto:${SITE_CONFIG.email}`}>
          {MAIN_CLOSE_UI.cta}
          <HoverArrow aria-hidden />
        </S.Cta>
      </S.Intro>

      <S.Channels aria-label="연락 채널">
        {MAIN_CLOSE_UI.channels.map((channel) => (
          <S.Channel
            key={channel.label}
            href={channelHref(channel.hrefKind)}
            target={channel.hrefKind === "mailto" ? undefined : "_blank"}
            rel={
              channel.hrefKind === "mailto" ? undefined : "noopener noreferrer"
            }
          >
            <S.ChannelTop>
              <S.ChannelLabel>{channel.label}</S.ChannelLabel>
              <S.ChannelHint>{channel.hint}</S.ChannelHint>
            </S.ChannelTop>
            <S.ChannelValue>{channelValue(channel.valueKey)}</S.ChannelValue>
            <S.ChannelArrow data-hover-arrow aria-hidden />
          </S.Channel>
        ))}
      </S.Channels>
    </S.Inner>
  </S.Section>
);

export default CloseSection;

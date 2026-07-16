/**
 * 생성 이유: 메인을 짧은 연락 장면으로 마무리하기 위함이다.
 * 역할: Contact 섹션 컴포넌트다.
 * 책임: Simplefolio식 중앙 CTA와 GitHub·Email 링크를 렌더링한다.
 */
"use client";

import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./CloseSection.styled";
import { MAIN_CLOSE_UI, MAIN_SECTION_IDS } from "../../constants";
import { SITE_CONFIG } from "@/lib/siteConfig";

const CloseSection = () => (
  <P.Section id={MAIN_SECTION_IDS.close} $alt>
    <S.Inner>
      <P.Label>{MAIN_CLOSE_UI.label}</P.Label>
      <P.Title>{MAIN_CLOSE_UI.title}</P.Title>
      <S.Body>{MAIN_CLOSE_UI.body}</S.Body>
      <S.LinkRow>
        {SITE_CONFIG.email && (
          <S.Cta href={`mailto:${SITE_CONFIG.email}`}>{MAIN_CLOSE_UI.cta}</S.Cta>
        )}
      </S.LinkRow>
      <S.Secondary>
        {SITE_CONFIG.github && (
          <S.SecondaryLink
            href={SITE_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {MAIN_CLOSE_UI.githubLabel}
          </S.SecondaryLink>
        )}
        {SITE_CONFIG.email && (
          <S.SecondaryLink href={`mailto:${SITE_CONFIG.email}`}>
            {MAIN_CLOSE_UI.emailLabel}
          </S.SecondaryLink>
        )}
      </S.Secondary>
    </S.Inner>
  </P.Section>
);

export default CloseSection;

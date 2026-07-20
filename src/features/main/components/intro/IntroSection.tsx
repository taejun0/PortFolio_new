/**
 * 생성 이유: Thomas Eduardo식 히어로를 메인 조합과 분리한다.
 * 역할: Intro(Hero) 섹션 컴포넌트다.
 * 책임: 역할·이름·소개·스크롤 힌트만 렌더링한다. (마퀴는 About으로 이동)
 */
"use client";

import * as S from "./IntroSection.styled";
import ExpandableName from "./expandableName/ExpandableName";
import { MAIN_HERO_UI, MAIN_SECTION_IDS } from "../../constants";

const IntroSection = () => (
  <S.Section id={MAIN_SECTION_IDS.intro}>
    <S.Inner>
      <S.Roles>
        {MAIN_HERO_UI.roles.map((role, index) => (
          <S.Role key={role}>
            {index > 0 ? <S.RoleDot aria-hidden>·</S.RoleDot> : null}
            <span>{role}</span>
          </S.Role>
        ))}
      </S.Roles>
      <S.DisplayWrap>
        <ExpandableName text={MAIN_HERO_UI.displayName} />
      </S.DisplayWrap>
      <S.Title>{MAIN_HERO_UI.title}</S.Title>
    </S.Inner>
    <S.ScrollHint href={MAIN_HERO_UI.scrollHref} aria-label="아래로 스크롤">
      <S.ScrollMouse aria-hidden />
      <span>{MAIN_HERO_UI.scroll}</span>
    </S.ScrollHint>
  </S.Section>
);

export default IntroSection;

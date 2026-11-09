/**
 * 생성 이유: Thomas Eduardo식 히어로를 메인 조합과 분리한다.
 * 역할: Intro(Hero) 섹션 컴포넌트다.
 * 책임: 역할·이름·소개·스크롤 힌트를 렌더링하고 인트로 순서를 정한다. (마퀴는 About으로 이동)
 *       h1의 접근 이름은 숨긴 글자(nameLabel)가 주고, 렌즈 네임은 장식으로 보조기기에서 뺀다.
 *       스플래시가 걷히면 이름 렌즈 웨이브가 좌→우로 지나가고, 웨이브가 앞 글자를 지나간 뒤
 *       역할 라벨 → 소개 문장이 같은 방향의 커튼으로 걷히며, 웨이브가 끝나면 스크롤 힌트가 들어온다.
 *       라벨·소개 문장은 커튼이라 글자가 첫 페인트부터 칠해져 있다(LCP 안전·깜빡임 없음).
 */
"use client";

import { RollText, SweepText } from "@/components/common/motion";
import { VisuallyHidden } from "@/components/common/visuallyHidden/VisuallyHidden.styled";

import * as S from "./IntroSection.styled";
import ExpandableName from "./expandableName/ExpandableName";
import { MAIN_HERO_UI, MAIN_SECTION_IDS } from "../../constants";

/**
 * 첫 화면 커튼에 더하는 지연(s) — 스플래시 신호 + 0.1s에 출발하는 이름 웨이브(1.15s)를 기준으로,
 * 렌즈가 라벨·소개 문장의 가로 폭을 막 지나간 시점에 각 줄이 걷히기 시작한다.
 */
const LABEL_CURTAIN_DELAY_S = 0.35;
const TITLE_CURTAIN_DELAY_S = 0.5;

const IntroSection = () => (
  <S.Section id={MAIN_SECTION_IDS.intro}>
    <S.Inner>
      <SweepText
        as={S.Roles}
        variant="curtain"
        delay={LABEL_CURTAIN_DELAY_S}
      >
        {MAIN_HERO_UI.roles.join(" · ")}
      </SweepText>
      {/* h1 이름은 숨긴 글자가 주고, 그림 글자(렌즈 네임)는 보조기기에서 뺀다 */}
      <S.DisplayWrap>
        <VisuallyHidden>{MAIN_HERO_UI.nameLabel}</VisuallyHidden>
        <ExpandableName text={MAIN_HERO_UI.displayName} />
      </S.DisplayWrap>
      <SweepText
        as={S.Title}
        variant="curtain"
        delay={TITLE_CURTAIN_DELAY_S}
      >
        {MAIN_HERO_UI.title}
      </SweepText>
    </S.Inner>
    <S.ScrollHint href={MAIN_HERO_UI.scrollHref}>
      <S.ScrollMouse aria-hidden />
      <RollText>{MAIN_HERO_UI.scroll}</RollText>
      <VisuallyHidden> {MAIN_HERO_UI.scrollHint}</VisuallyHidden>
    </S.ScrollHint>
  </S.Section>
);

export default IntroSection;

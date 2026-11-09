/**
 * 생성 이유: 메인에 기술 스택 섹션을 추가한다.
 * 역할: Stack 섹션 컴포넌트다.
 * 책임: 섹션 헤더(라벨·타이틀·보조 문구)와 공용 기술 쇼케이스를 렌더링한다.
 *       헤더는 라벨→제목→보조 문구 순으로 어절 스윕을 타고, 쇼케이스는 기준선·탭·슬라이드가 이어 등장한다.
 */
"use client";

import { SweepText } from "@/components/common/motion";
import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./StackSection.styled";
import { MAIN_SECTION_IDS, MAIN_STACK_UI } from "../../constants";
import StackShowcase from "@/features/stack/components/StackShowcase";

const StackSection = () => (
  <P.Section id={MAIN_SECTION_IDS.stack} $alt>
    <P.SectionInner>
      <SweepText as={P.Label}>{MAIN_STACK_UI.label}</SweepText>
      <S.Header>
        <SweepText as={P.Title} $flush>
          {MAIN_STACK_UI.title}
        </SweepText>
        <SweepText as={S.Aside}>{MAIN_STACK_UI.aside}</SweepText>
      </S.Header>
      <StackShowcase />
    </P.SectionInner>
  </P.Section>
);

export default StackSection;

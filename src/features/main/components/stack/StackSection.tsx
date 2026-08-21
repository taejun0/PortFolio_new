/**
 * 생성 이유: 메인에 기술 스택 섹션을 추가한다.
 * 역할: Stack 섹션 컴포넌트다.
 * 책임: 핵심 스택과 보조 도구 그룹을 렌더링한다.
 */
"use client";

import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./StackSection.styled";
import { MAIN_SECTION_IDS, MAIN_STACK_UI } from "../../constants";
import StackShowcase from "@/features/stack/components/StackShowcase";

const StackSection = () => (
  <P.Section id={MAIN_SECTION_IDS.stack} $alt>
    <P.SectionInner>
      <P.Label>{MAIN_STACK_UI.label}</P.Label>
      <S.Header>
        <P.Title $flush>{MAIN_STACK_UI.title}</P.Title>
        <S.Aside>{MAIN_STACK_UI.aside}</S.Aside>
      </S.Header>
      <StackShowcase />
    </P.SectionInner>
  </P.Section>
);

export default StackSection;

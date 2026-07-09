/**
 * 생성 이유: 개발 사고방식 섹션을 메인 조합과 분리한다.
 * 역할: Thinking 섹션 컴포넌트다.
 * 책임: PortfolioPage Development Philosophy 원문을 번호 리스트로 보여 준다.
 */
"use client";

import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./ThinkingSection.styled";
import { MAIN_SECTION_IDS, MAIN_THINKING_UI } from "../../constants";

const ThinkingSection = () => (
  <P.Section id={MAIN_SECTION_IDS.thinking}>
    <P.SectionInner>
      <P.Label>{MAIN_THINKING_UI.label}</P.Label>
      <P.Title>{MAIN_THINKING_UI.title}</P.Title>
      <S.Steps>
        {MAIN_THINKING_UI.steps.map((step, index) => (
          <S.Step key={step.title}>
            <S.StepIndex>{String(index + 1).padStart(2, "0")}</S.StepIndex>
            <S.StepTitle>{step.title}</S.StepTitle>
            <S.StepBody>{step.body}</S.StepBody>
          </S.Step>
        ))}
      </S.Steps>
    </P.SectionInner>
  </P.Section>
);

export default ThinkingSection;

/**
 * 생성 이유: About 상세에 실제 작업 중심의 기술 인덱스를 둔다.
 * 역할: AboutPage Tools 챕터다.
 * 책임: 챕터 헤더(라벨·타이틀·보조 링크)와 공용 기술 쇼케이스를 렌더링한다.
 *       라벨·타이틀은 어절 스윕, 보조 링크는 블록 스윕으로 메인 Stack 섹션과 같은 순서로 등장한다.
 */
"use client";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, SweepText } from "@/components/common/motion";
import * as P from "../../AboutPage.styled";
import * as S from "./ToolsSection.styled";
import { ABOUT_PAGE_UI } from "../../constants";
import StackShowcase from "@/features/stack/components/StackShowcase";

const ui = ABOUT_PAGE_UI.tools;

const ToolsSection = () => (
  <S.Chapter>
    <P.Inner>
      <SweepText as={P.Label}>{ui.label}</SweepText>
      <S.Header>
        <SweepText as={S.Title}>{ui.title}</SweepText>
        <Reveal as={S.AsideLink} href={ui.asideHref}>
          {ui.aside}
          <HoverArrow aria-hidden />
        </Reveal>
      </S.Header>
      <StackShowcase />
    </P.Inner>
  </S.Chapter>
);

export default ToolsSection;

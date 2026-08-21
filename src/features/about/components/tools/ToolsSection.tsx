/**
 * 생성 이유: About 상세에 실제 작업 중심의 기술 인덱스를 둔다.
 * 역할: AboutPage Tools 챕터다.
 * 책임: 핵심 스택과 보조 도구 그룹을 렌더링한다.
 */
"use client";

import Link from "next/link";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import * as P from "../../AboutPage.styled";
import * as S from "./ToolsSection.styled";
import { ABOUT_PAGE_UI } from "../../constants";
import StackShowcase from "@/features/stack/components/StackShowcase";

const ui = ABOUT_PAGE_UI.tools;

const ToolsSection = () => (
  <P.Chapter>
    <P.Inner>
      <S.Header>
        <div>
          <P.Label>{ui.label}</P.Label>
          <P.Title>{ui.title}</P.Title>
        </div>
        <Link href={ui.asideHref}>
          <S.Aside>
            {ui.aside}
            <HoverArrow aria-hidden />
          </S.Aside>
        </Link>
      </S.Header>
      <StackShowcase />
    </P.Inner>
  </P.Chapter>
);

export default ToolsSection;

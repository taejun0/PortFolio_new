/**
 * 생성 이유: 메인에 기술 스택 섹션을 추가한다.
 * 역할: Stack 섹션 컴포넌트다.
 * 책임: 6개 카테고리 그룹과 stackImage 아이콘을 렌더링한다.
 */
"use client";

import Image from "next/image";

import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./StackSection.styled";
import { MAIN_SECTION_IDS, MAIN_STACK_UI } from "../../constants";
import { STACK_GROUPS } from "@/features/stack/constants";

const StackSection = () => (
  <P.Section id={MAIN_SECTION_IDS.stack} $alt>
    <P.SectionInner>
      <P.Label>{MAIN_STACK_UI.label}</P.Label>
      <S.Header>
        <P.Title $flush>{MAIN_STACK_UI.title}</P.Title>
        <S.Aside>{MAIN_STACK_UI.aside}</S.Aside>
      </S.Header>
      <S.Grid>
        {STACK_GROUPS.map((group) => (
          <S.Column key={group.index}>
            <S.Index>{group.index}</S.Index>
            <S.Title>{group.title}</S.Title>
            <S.Description>{group.description}</S.Description>
            <S.Icons>
              {group.items.map((item) => (
                <S.Icon key={item.name} title={item.name} aria-label={item.name}>
                  <Image
                    src={item.image}
                    alt=""
                    width={28}
                    height={28}
                    sizes="28px"
                  />
                </S.Icon>
              ))}
            </S.Icons>
          </S.Column>
        ))}
      </S.Grid>
    </P.SectionInner>
  </P.Section>
);

export default StackSection;

/**
 * 생성 이유: About 상세에 일상 툴 그리드를 둔다.
 * 역할: AboutPage Tools 챕터다.
 * 책임: stackImage 기반 6개 카테고리 그룹을 렌더링한다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";

import * as P from "../../AboutPage.styled";
import * as S from "./ToolsSection.styled";
import { ABOUT_PAGE_UI } from "../../constants";
import { STACK_GROUPS } from "@/features/stack/constants";

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
          <S.Aside>{ui.aside} →</S.Aside>
        </Link>
      </S.Header>
      <S.Grid>
        {STACK_GROUPS.map((group) => (
          <S.Group key={group.index}>
            <S.GroupHead>
              <S.Index>{group.index}</S.Index>
              <S.GroupTitle>{group.title}</S.GroupTitle>
            </S.GroupHead>
            <S.Tools>
              {group.items.map((item) => (
                <S.Tool key={item.name}>
                  <S.Icon aria-hidden>
                    <Image
                      src={item.image}
                      alt=""
                      width={32}
                      height={32}
                      sizes="32px"
                    />
                  </S.Icon>
                  <S.Name>{item.name}</S.Name>
                </S.Tool>
              ))}
            </S.Tools>
          </S.Group>
        ))}
      </S.Grid>
    </P.Inner>
  </P.Chapter>
);

export default ToolsSection;

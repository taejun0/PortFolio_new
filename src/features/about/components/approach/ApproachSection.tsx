/**
 * 생성 이유: About 상세에 Development Philosophy 탭 UI를 둔다.
 * 역할: AboutPage Approach 챕터다.
 * 책임: 소통·협업·경험 탭 선택과 본문 전환을 렌더링한다.
 */
"use client";

import { useState } from "react";

import * as P from "../../AboutPage.styled";
import * as S from "./ApproachSection.styled";
import { ABOUT_PAGE_UI } from "../../constants";

const ui = ABOUT_PAGE_UI.approach;

const ApproachSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = ui.cards[activeIndex];

  return (
    <P.Chapter id={ui.id}>
      <P.Inner>
        <P.Label>{ui.label}</P.Label>
        <P.Title>{ui.title}</P.Title>

        <S.Stage>
          <S.Tabs role="tablist" aria-label={ui.title}>
            {ui.cards.map((card, index) => {
              const selected = index === activeIndex;

              return (
                <S.Tab
                  key={card.title}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  $active={selected}
                  onClick={() => setActiveIndex(index)}
                >
                  <S.TabIndex $active={selected}>{card.index}</S.TabIndex>
                  <S.TabLabel $active={selected}>{card.title}</S.TabLabel>
                </S.Tab>
              );
            })}
          </S.Tabs>

          <S.Panel key={active.title} role="tabpanel">
            <S.Body>
              {active.paragraphs.map((paragraph) => (
                <S.Paragraph key={paragraph.slice(0, 32)}>
                  {paragraph}
                </S.Paragraph>
              ))}
            </S.Body>
          </S.Panel>
        </S.Stage>
      </P.Inner>
    </P.Chapter>
  );
};

export default ApproachSection;

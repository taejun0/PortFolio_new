/**
 * 생성 이유: About 상세에 Development Philosophy 탭 UI를 둔다.
 * 역할: AboutPage Approach 챕터다.
 * 책임: 소통·협업·경험 탭 선택(클릭·화살표·Home/End 키)과 본문 전환을 렌더링한다.
 *
 * 본문 전환은 흐린 페이드가 아니라 가로 스윕이다(의도된 결정 — 투명도 크로스페이드를 다시 넣지 말 것).
 * 나가는 본문은 왼쪽부터 지워지며 오른쪽으로 밀리고, 들어오는 문단이 뒤따라 왼쪽부터 쓸려 들어온다(panelSweep).
 * 세 패널을 한 칸에 겹쳐 두고 선택된 것만 보이게 해, 탭을 바꿔도 아래 챕터가 튀지 않는다.
 * 동작 줄이기에서는 본문이 즉시 바뀐다.
 */
"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Reveal, SweepText } from "@/components/common/motion";
import * as P from "../../AboutPage.styled";
import * as S from "./ApproachSection.styled";
import { canSweepPanels, sweepPanels } from "./panelSweep";
import { ABOUT_PAGE_UI } from "../../constants";

const ui = ABOUT_PAGE_UI.approach;

/** 키 → 다음 탭 인덱스. 가로(모바일)·세로(데스크톱) 배치 모두 화살표 두 축을 받는다. */
const KEY_TO_INDEX: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

const ApproachSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shownIndexRef = useRef(activeIndex);
  const baseId = useId();
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;

  // 새 패널이 보이게 커밋된 직후·페인트 전에 스윕을 건다 — 새 본문이 한 프레임도 통째로 비치지 않는다.
  useLayoutEffect(() => {
    const previous = shownIndexRef.current;
    shownIndexRef.current = activeIndex;
    if (previous === activeIndex || !canSweepPanels()) return;
    sweepPanels(panelRefs.current[previous], panelRefs.current[activeIndex]);
  }, [activeIndex]);

  /** 로빙 tabindex — 탭 목록 안에서는 화살표로 이동하며 바로 선택한다. */
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const toIndex = KEY_TO_INDEX[event.key];
    if (!toIndex) return;

    event.preventDefault();
    const next = toIndex(activeIndex, ui.cards.length);
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <P.Chapter id={ui.id}>
      <P.Inner>
        <SweepText as={P.Label}>{ui.label}</SweepText>
        <SweepText as={P.Title}>{ui.title}</SweepText>

        <S.Stage>
          <Reveal
            as={S.Tabs}
            variant="stagger"
            role="tablist"
            aria-label={ui.title}
            onKeyDown={handleKeyDown}
          >
            {ui.cards.map((card, index) => {
              const selected = index === activeIndex;

              return (
                <S.Tab
                  key={card.title}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={tabId(index)}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId(index)}
                  tabIndex={selected ? 0 : -1}
                  $active={selected}
                  onClick={() => setActiveIndex(index)}
                >
                  <S.TabIndex $active={selected}>{card.index}</S.TabIndex>
                  <S.TabLabel $active={selected}>{card.title}</S.TabLabel>
                </S.Tab>
              );
            })}
          </Reveal>

          <Reveal as={S.Panels} variant="group">
            {ui.cards.map((card, index) => {
              const selected = index === activeIndex;
              const [lead, ...rest] = card.paragraphs;

              return (
                <S.Panel
                  key={card.title}
                  ref={(node) => {
                    panelRefs.current[index] = node;
                  }}
                  id={panelId(index)}
                  role="tabpanel"
                  aria-labelledby={tabId(index)}
                  tabIndex={selected ? 0 : -1}
                  $active={selected}
                >
                  <S.Lead>{lead}</S.Lead>
                  {rest.map((paragraph) => (
                    <S.Paragraph key={paragraph.slice(0, 32)}>
                      {paragraph}
                    </S.Paragraph>
                  ))}
                </S.Panel>
              );
            })}
          </Reveal>
        </S.Stage>
      </P.Inner>
    </P.Chapter>
  );
};

export default ApproachSection;

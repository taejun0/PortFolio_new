/**
 * 생성 이유: About 상세에 기술 이름 마퀴를 둔다.
 * 역할: About 프로필 챕터 하단 마퀴다.
 * 책임: Tools & Partners 목록 한 벌(읽힘)과 이음매용 복사본 한 벌(aria-hidden)을 렌더링하고,
 *       스크롤 반응 배속·탭 정지 토글은 useMarqueeVelocity에 맡긴다. 흐름 자체는 스타일의 CSS 애니메이션이다.
 *
 * 움직이는 줄이라 마우스를 올리거나 키보드로 포커스하면 멈추고(섹션이 탭 순서에 들어가는 이유),
 * 터치·펜으로 탭하면 멈춘 채 두었다가 다시 탭하면 흐른다. 동작 줄이기에서는 처음부터 정지한 한 줄이다.
 */
"use client";

import { useRef } from "react";

import * as S from "./MarqueeSection.styled";
import { useMarqueeVelocity } from "./useMarqueeVelocity";
import { ABOUT_PAGE_UI } from "../../constants";

type MarqueeSectionProps = {
  embedded?: boolean;
};

const MarqueeSection = ({ embedded = false }: MarqueeSectionProps) => {
  const { label, items } = ABOUT_PAGE_UI.marquee;
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useMarqueeVelocity({ rootRef, trackRef });

  return (
    <S.Section
      ref={rootRef}
      $embedded={embedded}
      aria-label={label}
      tabIndex={0}
    >
      <S.Viewport>
        <S.Track ref={trackRef}>
          <S.Group>
            {items.map((item) => (
              <S.Item key={item}>{item}</S.Item>
            ))}
          </S.Group>
          <S.Group aria-hidden>
            {items.map((item) => (
              <S.Item key={item}>{item}</S.Item>
            ))}
          </S.Group>
        </S.Track>
      </S.Viewport>
    </S.Section>
  );
};

export default MarqueeSection;

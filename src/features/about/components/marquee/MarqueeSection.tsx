/**
 * 생성 이유: About 상세에 기술 이름 마퀴를 둔다.
 * 역할: About 프로필 챕터 하단 마퀴다.
 * 책임: Tools & Partners 라벨과 무한 스크롤 트랙만 렌더링한다.
 */
"use client";

import * as S from "./MarqueeSection.styled";
import { ABOUT_PAGE_UI } from "../../constants";

type MarqueeSectionProps = {
  embedded?: boolean;
};

const MarqueeSection = ({ embedded = false }: MarqueeSectionProps) => {
  const { label, items } = ABOUT_PAGE_UI.marquee;
  const loop = [...items, ...items];

  return (
    <S.Section $embedded={embedded} aria-label={label}>
      <S.Viewport>
        <S.Track>
          {loop.map((item, index) => (
            <S.Item key={`${item}-${index}`}>{item}</S.Item>
          ))}
        </S.Track>
      </S.Viewport>
    </S.Section>
  );
};

export default MarqueeSection;

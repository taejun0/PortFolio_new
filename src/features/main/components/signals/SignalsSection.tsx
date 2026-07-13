/**
 * 생성 이유: 레퍼런스의 양방향 카드 마퀴를 메인 증명 섹션으로 옮긴다.
 * 역할: Signals 섹션 — 위 줄 RTL / 아래 줄 LTR 무한 스크롤이다.
 * 책임: 철학·경험 카드 두 줄의 방향 반대 마퀴 렌더링만 담당한다.
 */
"use client";

import * as S from "./SignalsSection.styled";
import { MAIN_SECTION_IDS, MAIN_SIGNALS_UI } from "../../constants";

const MarqueeRow = ({
  items,
  direction,
}: {
  items: readonly { title: string; body: string; meta: string }[];
  direction: "rtl" | "ltr";
}) => {
  const loop = [...items, ...items];

  return (
    <S.RowViewport>
      <S.RowTrack $direction={direction}>
        {loop.map((item, index) => (
          <S.Card key={`${item.title}-${index}`}>
            <S.Quote aria-hidden>“</S.Quote>
            <S.CardTitle>{item.title}</S.CardTitle>
            <S.CardBody>{item.body}</S.CardBody>
            <S.Divider />
            <S.CardMeta>{item.meta}</S.CardMeta>
          </S.Card>
        ))}
      </S.RowTrack>
    </S.RowViewport>
  );
};

const SignalsSection = () => (
  <S.Section id={MAIN_SECTION_IDS.signals}>
    <S.Header>
      <S.Label>{MAIN_SIGNALS_UI.label}</S.Label>
      <S.Title>{MAIN_SIGNALS_UI.title}</S.Title>
    </S.Header>
    <S.Rows>
      <MarqueeRow items={MAIN_SIGNALS_UI.topRow} direction="rtl" />
      <MarqueeRow items={MAIN_SIGNALS_UI.bottomRow} direction="ltr" />
    </S.Rows>
  </S.Section>
);

export default SignalsSection;

/**
 * 생성 이유: 없는 주소에서 Next 기본 404(테마를 무시하는 흰/검은 화면·영문 문구) 대신 사이트 화면을 보여 준다.
 * 역할: 루트 not-found 라우트가 렌더링하는 404 feature 컴포넌트다.
 * 책임: 라벨·제목·안내 문구와 홈으로 가는 CTA를 사이트 셸(헤더·푸터) 안에 렌더링한다.
 *       모션은 다른 페이지 첫 화면과 같은 문법이다 — 제목은 캔버스색 커튼이 걷히는 스윕(첫 페인트부터 칠해져
 *       LCP 안전), 라벨·안내는 어절 스윕, CTA는 블록 스윕으로 차분히 들어온다.
 */
"use client";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, RollText, SweepText } from "@/components/common/motion";
import { motionTokens } from "@/styles/theme";
import * as S from "./NotFoundPage.styled";
import { NOT_FOUND_UI } from "./constants";
import { ROUTES } from "@/constants/routes";

const NotFoundPage = () => (
  <S.Wrapper>
    <S.Inner>
      <SweepText as={S.Label}>{NOT_FOUND_UI.label}</SweepText>
      <SweepText
        as={S.Title}
        variant="curtain"
        duration={motionTokens.duration.title}
      >
        {NOT_FOUND_UI.title}
      </SweepText>
      <SweepText as={S.Body}>{NOT_FOUND_UI.body}</SweepText>
      <Reveal as={S.Cta} href={ROUTES.MAIN}>
        <RollText>{NOT_FOUND_UI.cta}</RollText>
        <HoverArrow aria-hidden />
      </Reveal>
    </S.Inner>
  </S.Wrapper>
);

export default NotFoundPage;

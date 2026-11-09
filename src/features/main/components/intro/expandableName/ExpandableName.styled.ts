/**
 * 생성 이유: 확장형 디스플레이 네임 스타일을 로직과 분리한다.
 * 역할: 압축 디스플레이 페이스(쉬는 상태), 균등 슬롯 안의 렌즈형 확장 시각, 인트로 웨이브를 정의한다.
 * 책임: 컨테이너 기준 글자 크기·끝 글자 가장자리 정렬, scale·리프트 변수(--sx·--sy·--ty) 소비,
 *       스플래시 신호에 맞춘 CSS 인트로 웨이브(글자별 --wave-delay)만 소유한다. 색은 단색으로 둔다.
 */
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import {
  REST_SCALE_X,
  REST_SCALE_Y,
  SMOOTHSTEP_CURVE,
  SPACE_SLOT,
  WAVE_SCALE_X,
} from "./nameLens";

/** 히어로 토큰 대비 확대 — 압축 페이스라 토큰보다 크게 세워도 슬롯 폭이 남는다 */
const TOKEN_FONT_RATIO = 1.5;
/** 슬롯 폭 대비 글자 크기 상한 — 렌즈 최대 확장에서도 이웃 글자와 겹치지 않는 값 */
const SLOT_FONT_RATIO = 1.3;
/** Pretendard Bold 대문자 평균 잉크 폭(em) — 끝 글자 정렬 보정용 */
const CAP_INK_EM = 0.625;

type TrackProps = {
  /** 슬롯 단위 수(글자 1, 공백은 Space 비율) */
  $slots: number;
};

/**
 * 슬롯 중앙 정렬 때문에 생기는 좌우 여백만큼 트랙을 넓혀
 * 첫·끝 글자 잉크가 라벨·소개 문장과 같은 가장자리에 서게 한다.
 * 거터보다 넓게 번지면 가로 스크롤이 생기므로 거터에서 멈춘다.
 */
const edgeBleed = (slots: number, scaleX: number, gutter: string) => {
  if (slots <= 1) return "0px";
  const inkHalf = ((CAP_INK_EM * scaleX) / 2).toFixed(4);
  const spread = (slots / (slots - 1)).toFixed(4);
  return `max(calc(${gutter} * -1), calc((100cqi / ${slots} / 2 - ${inkHalf}em) * ${spread} * -1))`;
};

const restTransform = `translate3d(0, 0em, 0) scaleX(${REST_SCALE_X}) scaleY(${REST_SCALE_Y})`;

/**
 * 인트로 웨이브 — 렌즈가 지나가는 동안 글자가 가로로만 자연 폭까지 펴졌다 접힌다.
 * 시작·끝이 쉬는 상태(--sx 기본값)와 같아 들어오고 나갈 때 튀지 않고, 구간 곡선은 smoothstep이라
 * JS(waveAmount)가 같은 값을 이어 그릴 수 있다. 테마와 무관해야 이름이 바뀌지 않아 테마 전환에도 다시 돌지 않는다.
 */
export const nameWave = keyframes`
  0% {
    transform: ${restTransform};
    animation-timing-function: ${SMOOTHSTEP_CURVE};
  }
  50% {
    transform: translate3d(0, 0em, 0) scaleX(${WAVE_SCALE_X}) scaleY(${REST_SCALE_Y});
    animation-timing-function: ${SMOOTHSTEP_CURVE};
  }
  100% {
    transform: ${restTransform};
  }
`;

/** data-wave="off" — JS가 렌즈와 함께 웨이브를 넘겨받으면 붙인다(CSS 웨이브를 멈춘다) */
export const Name = styled.span`
  display: block;
  width: 100%;
  container-type: inline-size;
  /* Safari는 접두사 속성만 읽는다 — 자동 접두사 없이 직접 쓴다 */
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
`;

export const Track = styled.span<TrackProps>`
  --sx: ${REST_SCALE_X};
  --sy: ${REST_SCALE_Y};
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  margin-inline: ${({ theme, $slots }) =>
    edgeBleed($slots, REST_SCALE_X, theme.layout.gutter)};
  font-size: min(
    calc(
      ${({ theme }) => theme.typography.heroName.fontSize} *
        ${TOKEN_FONT_RATIO}
    ),
    calc(100cqi / ${({ $slots }) => $slots} * ${SLOT_FONT_RATIO})
  );
  line-height: ${({ theme }) => theme.typography.heroName.lineHeight};
  overflow: visible;

  @media (prefers-reduced-motion: reduce) {
    /* 자연 폭(scale 1)으로 고정되므로 가장자리 보정도 자연 폭 기준 */
    margin-inline: ${({ theme, $slots }) =>
      edgeBleed($slots, 1, theme.layout.gutter)};
  }
`;

export const Slot = styled.span`
  display: flex;
  flex: 1 1 0;
  align-items: flex-end;
  justify-content: center;
  min-width: 0;
  overflow: visible;
`;

/** 글자 래퍼 — 움직임은 안쪽 Glyph(인트로 웨이브·렌즈)가 맡으므로 정적이다. */
export const Fall = styled.span`
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
`;

export const Glyph = styled.span`
  display: inline-block;
  font-size: 1em;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.heroName.letterSpacing};
  line-height: ${({ theme }) => theme.typography.heroName.lineHeight};
  color: ${({ theme }) => theme.colors.text};
  /* 매 프레임 JS가 값을 쓰므로 CSS transition은 두지 않는다 (이중 보간 방지) */
  transform: translate3d(0, var(--ty, 0em), 0) scaleX(var(--sx, 1))
    scaleY(var(--sy, 1));
  transform-origin: center bottom;

  /*
   * 인트로 웨이브는 스플래시가 걷히는 순간(html[data-splash-done]) CSS만으로 출발한다.
   * hydration을 기다리지 않고 컴포지터에서 돌아, 스플래시를 본 첫 방문·바로 걷히는 재방문·느린 기기 모두
   * 라벨·소개 문장 커튼과 같은 시계로 흐른다. JS 없음(data-motion 없음)·인쇄·동작 줄이기에서는 돌지 않는다.
   * fill은 backwards만 — 끝난 뒤에도 키프레임이 transform을 붙잡으면 렌즈 변수가 먹히지 않는다.
   */
  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion][data-splash-done="1"] ${Name}:not([data-wave="off"]) & {
      animation: ${nameWave} var(--wave-duration, 0.4s) linear
        var(--wave-delay, 0s) backwards;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }
`;

/** 공백 — 렌즈·웨이브 일정이 쓰는 SPACE_SLOT과 같은 비율로 자란다 */
export const Space = styled.span`
  flex: ${SPACE_SLOT} 1 0;
  min-width: 0.5rem;
`;

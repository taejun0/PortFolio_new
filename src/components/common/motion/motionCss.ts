/**
 * 생성 이유: 호버 밑줄·순차 등장처럼 여러 화면이 같은 가로 모션을 쓰게 한다.
 * 역할: 모션 토큰으로 만든 Emotion css 조각과 트랜지션 문자열 헬퍼다.
 * 책임: 조각이 붙은 요소의 모션 시각만 소유한다. 등장 시점 판정은 revealController가 맡는다.
 *       모든 이동은 transform·clip-path로만 하고, 동작 줄이기에서는 움직임 없이 상태만 바뀐다.
 */
import { css } from "@emotion/react";

import { motionTokens } from "@/styles/theme";

const { duration, stagger, curve } = motionTokens;

type DurationKey = keyof typeof motionTokens.duration;

/** 같은 길이·곡선(ease.out)의 transition 값 — `transition: ${motionTransition(["color", "transform"])};` */
export const motionTransition = (
  properties: string | readonly string[],
  length: DurationKey | number = "hover"
) => {
  const seconds = typeof length === "number" ? length : duration[length];
  const list = typeof properties === "string" ? [properties] : properties;
  return list.map((property) => `${property} ${seconds}s ${curve.out}`).join(", ");
};

/* ───────────────────────── 밑줄 스윕 ───────────────────────── */

type Pseudo = "after" | "before";

export type UnderlineSweepOptions = {
  /** 선을 그릴 가상 요소 — 이미 ::after를 쓰는 요소면 "before" */
  pseudo?: Pseudo;
  /** 선 두께 */
  thickness?: string;
  /** 글자 아래로 내려가는 거리(양수면 박스 아래) — inset을 주면 무시된다 */
  offset?: string;
  /** 선 색(기본 글자색) */
  color?: string;
  /** 행 전체 너비 선처럼 위치를 직접 정할 때 — 예: "auto 0 0 0" */
  inset?: string;
};

/** 밑줄이 켜진 상태 — 다른 부모의 호버로 켤 때 `${Card}:hover & { ${underlineSweepActive()} }` */
export const underlineSweepActive = (pseudo: Pseudo = "after") => css`
  &::${pseudo} {
    transform: scaleX(1);
    transform-origin: left center;
  }
`;

/**
 * 호버·키보드 포커스 때 왼쪽에서 오른쪽으로 그어지고, 떠날 때 오른쪽으로 빠지는 1px 선.
 * 요소에 position: relative를 준다(이미 위치 지정된 요소면 뒤에서 덮어쓴다). 한 줄짜리 링크·행에 쓴다.
 */
export const underlineSweep = ({
  pseudo = "after",
  thickness = "1px",
  offset = "0.18em",
  color = "currentColor",
  inset,
}: UnderlineSweepOptions = {}) => css`
  position: relative;

  &::${pseudo} {
    content: "";
    position: absolute;
    ${inset
      ? `inset: ${inset};`
      : `left: 0; right: 0; bottom: calc(${offset} * -1);`}
    height: ${thickness};
    background: ${color};
    pointer-events: none;
    transform: scaleX(0);
    transform-origin: right center;
    transition: ${motionTransition("transform")};
  }

  @media (hover: hover) {
    &:hover {
      ${underlineSweepActive(pseudo)}
    }
  }

  &:focus-visible {
    ${underlineSweepActive(pseudo)}
  }

  @media (prefers-reduced-motion: reduce) {
    &::${pseudo} {
      transition: none;
    }
  }
`;

/* ───────────────────────── 순차 등장(자식) ───────────────────────── */

export type StaggerChildrenOptions = {
  /** 직접 자식 선택자 — "> *"·"> li"·"> [data-item]"처럼 >로 시작한다 */
  children?: string;
  /** 자식 사이 간격(s) */
  step?: number;
  /** 누적 상한(s) — 이 뒤 자식은 같은 시점에 시작한다 */
  max?: number;
};

/** 호스트 선택자 기준 순차 등장 CSS 문자열 — 전역 스타일(variant="stagger")과 staggerChildren이 같이 쓴다. */
export const buildStaggerCss = (
  host: string,
  {
    children = "> *",
    step = stagger.item,
    max = stagger.max,
  }: StaggerChildrenOptions = {}
) => {
  const count = Math.max(1, Math.floor(max / step) + 1);
  const delays = Array.from({ length: count - 1 }, (_, index) => {
    const nth = index + 2;
    const seconds = Math.min((nth - 1) * step, max);
    return `${host} ${children}:nth-child(${nth}) { --stagger-delay: ${seconds.toFixed(3)}s; }`;
  }).join("\n");

  return `
    ${host}[data-reveal-state="pending"] ${children} {
      clip-path: inset(0 100% 0 0);
      transform: translateX(var(--motion-sweep-x));
    }
    ${host}[data-reveal-state="in"] ${children} {
      animation: motion-sweep var(--reveal-duration, var(--motion-reveal))
        var(--motion-ease)
        calc(var(--reveal-delay, 0s) + var(--stagger-delay, 0s)) backwards;
    }
    ${delays}
    ${host} ${children}:nth-child(n + ${count + 1}) { --stagger-delay: ${max.toFixed(3)}s; }
  `;
};

/**
 * 리빌 요소의 직접 자식이 차례로 쓸려 들어온다 — 호스트는 variant="group"(시각 없이 상태만)으로 등록한다.
 * 기본("> *", 60ms)이면 이 조각 없이 variant="stagger"만으로 충분하고, 자식 선택자·간격을 바꿀 때 쓴다.
 */
export const staggerChildren = (options: StaggerChildrenOptions = {}) => css`
  @media screen and (prefers-reduced-motion: no-preference) {
    ${buildStaggerCss('html[data-motion="live"] &', options)}
  }
`;

/* ───────────────────────── 롤 텍스트 트리거 ───────────────────────── */

/**
 * RollText가 굴러간 상태 — RollText 요소([data-roll])에 적용한다.
 * 앞면은 오른쪽으로 빠지고, 복사본(루트의 ::after 생성 콘텐츠)이 왼쪽에서 제자리로 들어온다.
 */
export const rollTextActive = css`
  [data-roll-face] {
    transform: translateX(105%);
  }

  &::after {
    transform: translateX(0);
  }
`;

/**
 * a·button 밖의 부모(카드 li, 행 div 등)의 호버·키보드 포커스로 안쪽 RollText를 굴린다.
 * a·button 안의 RollText는 이 조각 없이도 그 링크·버튼의 호버·포커스에 반응한다.
 */
export const rollTextParent = css`
  @media (hover: hover) {
    &:hover [data-roll] {
      ${rollTextActive}
    }
  }

  &:focus-visible [data-roll],
  &:has(:focus-visible) [data-roll] {
    ${rollTextActive}
  }
`;

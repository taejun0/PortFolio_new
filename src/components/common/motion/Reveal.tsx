/**
 * 생성 이유: 섹션 블록·카드·리스트를 같은 가로 스윕 언어로 등장시킨다.
 * 역할: 블록 단위 리빌 래퍼다(sweep·curtain·fade·stagger).
 * 책임: data-reveal 마크업·커튼 색·ref 연결만 맡는다. 판정은 revealController, 시각은 전역 모션 스타일이 소유한다.
 *
 * - sweep(기본): 왼쪽에서 열리는 clip-path 마스크 + 짧은 translateX. 첫 화면에서는 애니메이션 없이 보인다.
 * - curtain: 캔버스색 덮개가 왼쪽부터 걷힌다. 내용은 첫 페인트부터 칠해져 있어 페이지 첫 제목·첫 이미지(LCP 후보)에 쓴다.
 *   ::after를 덮개로 쓰므로 ::after를 직접 꾸민 요소에는 걸지 말고 감싼다.
 * - fade: 투명도만. 아이콘처럼 작은 요소용.
 * - stagger: 자신은 그대로 두고 직접 자식이 차례로 sweep 된다(최대 0.45s 누적).
 * - group: 자신은 시각 없이 상태만 받는다. staggerChildren(자식 선택자·간격 지정)이나
 *   `&[data-reveal-state="in"]` 규칙을 직접 쓸 때 쓴다.
 *
 * 주의
 * - content-visibility: auto인 요소에는 직접 걸지 않는다. 리빌이 호스트를 잘라 두는 동안 크롬이 그 하위 트리를
 *   건너뛴 채(칠하지 않음) 두어, 스윕 내내 비어 있다가 끝난 모습으로 튀어나온다. 리빌만 담은 섹션(메인·About)에
 *   content-visibility를 두는 것은 괜찮다 — 안쪽 요소를 감싸거나 리빌을 안쪽에 둔다.
 * - 자기 transform·clip-path·opacity를 직접 움직이는 요소(슬라이더 등)에도 걸지 말고 감싼다.
 */
"use client";

import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  Ref,
} from "react";

import {
  CURTAIN_START_S,
  CURTAIN_TONES,
  type CurtainTone,
  type RevealVariant,
} from "./constants";
import { useMergedRef } from "./mergeRefs";
import type { RevealInfo } from "./revealController";
import { useReveal } from "./useReveal";

type RevealOwnProps<T extends ElementType> = {
  /** 렌더할 태그나 styled 컴포넌트(ref·data 속성을 DOM까지 넘겨야 한다) — 기본 div */
  as?: T;
  variant?: RevealVariant;
  /** 배치 스태거에 더할 지연(s) */
  delay?: number;
  /** 등장 길이(s) — 기본 theme.motion.duration.reveal(curtain은 첫 화면 커튼 길이 duration.curtain) */
  duration?: number;
  /** curtain 덮개 색 — 요소 뒤 배경과 맞춘다(기본 canvas) */
  curtain?: CurtainTone;
  onReveal?: (info: RevealInfo) => void;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement>;
};

export type RevealProps<T extends ElementType = "div"> = RevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealOwnProps<T>>;

type RevealStyleOptions = {
  curtain: boolean;
  tone?: CurtainTone;
  delay?: number;
  duration?: number;
};

/**
 * 커튼 색·길이·시작 지연을 인라인 변수로 SSR에 넣는다.
 * hydration 전에 CSS가 커튼을 걷기 시작해도 컨트롤러가 같은 값으로 이어받아 애니메이션이 튀지 않는다.
 */
export const revealStyle = (
  style: CSSProperties | undefined,
  { curtain, tone, delay, duration }: RevealStyleOptions
): CSSProperties | undefined => {
  const vars: Record<string, string> = {};
  if (tone) vars["--reveal-curtain"] = CURTAIN_TONES[tone];
  if (duration !== undefined) vars["--reveal-duration"] = `${duration}s`;
  if (curtain) vars["--reveal-delay"] = `${CURTAIN_START_S + (delay ?? 0)}s`;
  return Object.keys(vars).length ? ({ ...vars, ...style } as CSSProperties) : style;
};

const Reveal = <T extends ElementType = "div">({
  as,
  variant = "sweep",
  delay,
  duration,
  curtain,
  onReveal,
  style,
  ref,
  ...rest
}: RevealProps<T>) => {
  const Tag: ElementType = as ?? "div";
  const reveal = useReveal<HTMLElement, RevealVariant>({
    variant,
    delay,
    onReveal,
  });
  const mergedRef = useMergedRef(reveal.ref, ref);

  return (
    <Tag
      {...rest}
      data-reveal={reveal["data-reveal"]}
      ref={mergedRef}
      style={revealStyle(style, {
        curtain: variant === "curtain",
        tone: curtain,
        delay,
        duration,
      })}
    />
  );
};

export default Reveal;

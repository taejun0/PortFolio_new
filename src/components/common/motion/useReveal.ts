/**
 * 생성 이유: 감싸는 요소를 늘리지 않고 기존 styled 요소에 바로 리빌을 붙이게 한다.
 * 역할: 요소를 revealController에 등록하는 ref와 data-reveal 속성을 함께 돌려주는 훅이다.
 * 책임: 등록·해제와 콜백 최신화만 맡는다. 판정은 컨트롤러, 시각은 전역 모션 스타일이 소유한다.
 */
"use client";

import { useCallback, useLayoutEffect, useRef, type RefCallback } from "react";

import type { RevealAttrValue } from "./constants";
import { registerReveal, type RevealInfo } from "./revealController";

/**
 * 등장 길이를 바꾸려면 요소의 CSS에 `--reveal-duration: 1.15s;`를 준다(SSR로 들어가 커튼 이어받기와도 맞는다).
 * delay는 JS가 재생하는 리빌에만 더해진다 — 첫 화면 커튼까지 늦추려면 Reveal·SweepText의 delay prop을 쓴다.
 */
export type UseRevealOptions<V extends RevealAttrValue = RevealAttrValue> = {
  /** data-reveal 값 — 기본 "sweep" */
  variant?: V;
  /** 배치 스태거에 더할 지연(s) */
  delay?: number;
  /** 보이기 시작할 때(애니메이션 시작 전 지연 포함 정보와 함께) 호출된다 */
  onReveal?: (info: RevealInfo) => void;
};

export type RevealBindings<T extends HTMLElement, V extends RevealAttrValue> = {
  ref: RefCallback<T>;
  "data-reveal": V;
};

/**
 * @example
 * const reveal = useReveal<HTMLLIElement>();
 * return <S.Item {...reveal}>…</S.Item>;
 */
export const useReveal = <
  T extends HTMLElement = HTMLElement,
  V extends RevealAttrValue = "sweep",
>({
  variant = "sweep" as V,
  delay,
  onReveal,
}: UseRevealOptions<V> = {}): RevealBindings<T, V> => {
  const onRevealRef = useRef(onReveal);

  useLayoutEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  const ref = useCallback<RefCallback<T>>(
    (node) => {
      if (!node) return;
      return registerReveal(node, {
        delay,
        onReveal: (info) => onRevealRef.current?.(info),
      });
    },
    [delay]
  );

  return { ref, "data-reveal": variant };
};

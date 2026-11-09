/**
 * 생성 이유: Reveal·SweepText가 내부 등록 ref와 바깥에서 넘긴 ref를 함께 걸어야 한다.
 * 역할: React 19 ref 콜백(정리 함수 반환 포함)과 ref 객체를 하나의 콜백으로 합치는 훅이다.
 * 책임: ref 연결·해제 순서만 맡는다.
 */
"use client";

import { useCallback, type Ref, type RefCallback } from "react";

const attach = <T>(ref: Ref<T> | undefined, node: T) => {
  if (typeof ref === "function") return ref(node);
  if (ref) ref.current = node;
  return undefined;
};

export const useMergedRef = <T>(
  own: RefCallback<T>,
  outer: Ref<T> | undefined
): RefCallback<T> =>
  useCallback(
    (node: T | null) => {
      const ownCleanup = own(node);
      const outerCleanup = attach(outer, node);
      return () => {
        if (typeof ownCleanup === "function") ownCleanup();
        if (typeof outerCleanup === "function") outerCleanup();
        else if (typeof outer === "function") outer(null);
        else if (outer) outer.current = null;
      };
    },
    [own, outer]
  );

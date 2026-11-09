/**
 * 생성 이유: "글씨가 쫙 옆으로 넘어가는" 가로 스윕을 제목·라벨에 같은 문법으로 쓴다.
 * 역할: 문자열을 어절 span으로 나눠 읽는 순서대로 쓸려 들어오게 하는 텍스트 리빌이다.
 * 책임: 어절 분할·어절별 지연·블록 모드 판정·커튼 색 마크업만 맡는다. 판정은 revealController, 시각은 전역 모션 스타일이 소유한다.
 *
 * - 어절(공백 단위)로만 나눈다 → 한글은 keep-all 줄바꿈 그대로, 스크린리더는 원문 그대로 읽는다.
 *   어절 사이 공백은 실제 텍스트 노드로 남아 접근 가능한 이름·복사·검색이 원문과 같다.
 * - "\n"은 줄바꿈(<br>)으로 바꾼다(앞에 공백을 둬 이름에서 단어가 붙지 않게 한다).
 * - sweep(기본): 어절마다 clip-path가 왼쪽부터 열리며 0.32em 미끄러진다. 첫 화면에서는 애니메이션 없이 보인다.
 *   어절이 TEXT_SWEEP_MAX_WORDS(6)개를 넘는 문장은 블록 모드다 — 같은 어절 span(줄바꿈·접근 가능한 글자 그대로)을
 *   그리되 어절별 애니메이션 없이 호스트 하나가 블록 sweep(data-reveal="sweep")으로 등장한다. 어절마다 도는
 *   애니메이션은 매 프레임 메인 스레드에서 스타일이 다시 계산돼, 긴 요약·부제 하나가 수십 개를 동시에 돌렸다.
 *   블록 sweep은 호스트의 clip-path·transform이라 블록 호스트(as={p·div 등 display:block 요소})가 필요하다
 *   — 기본 span(인라인)에는 transform이 먹지 않는다. 어절을 여러 개씩 묶은 inline-block은 줄바꿈이 바뀌어 쓰지 않는다.
 * - curtain: 어절마다 캔버스색 덮개가 걷힌다. 글자는 첫 페인트부터 칠해져 있어 페이지 첫 제목(LCP 후보)에 쓴다.
 *   길이와 상관없이 어절 캐스케이드를 유지한다.
 * - 제목·라벨·리드 문장용이다(어절 간격은 총 0.45s 안으로 줄어든다). 여러 문장짜리 문단은 Reveal을 쓴다.
 */
"use client";

import {
  Fragment,
  useMemo,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type Ref,
} from "react";

import { motionTokens } from "@/styles/theme";

import {
  TEXT_REVEAL_VALUE,
  TEXT_SWEEP_MAX_WORDS,
  type CurtainTone,
  type SweepTextVariant,
} from "./constants";
import { useMergedRef } from "./mergeRefs";
import { revealStyle } from "./Reveal";
import type { RevealInfo } from "./revealController";
import { useReveal } from "./useReveal";

type SweepTextOwnProps<T extends ElementType> = {
  /** 렌더할 태그나 styled 컴포넌트 — 기본 span(기존 제목 안에 넣을 때) */
  as?: T;
  /** 원문 문자열 — "\n"은 줄바꿈 */
  children: string;
  variant?: SweepTextVariant;
  /** 배치 스태거에 더할 지연(s) */
  delay?: number;
  /**
   * 어절 하나가 열리는 길이(s) — 기본은 sweep이 duration.text(블록 모드는 블록 길이 duration.reveal),
   * curtain이 duration.curtainText다. 큰 첫 제목은 duration.title
   */
  duration?: number;
  /** curtain 덮개 색 — 글자 뒤 배경과 맞춘다(기본 canvas) */
  curtain?: CurtainTone;
  onReveal?: (info: RevealInfo) => void;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement>;
};

export type SweepTextProps<T extends ElementType = "span"> =
  SweepTextOwnProps<T> &
    Omit<ComponentPropsWithoutRef<T>, keyof SweepTextOwnProps<T>>;

type Word = { text: string; delay: string };

/** 호스트의 data-reveal 값 — 어절 변형(text·text-curtain) 또는 긴 sweep 문장의 블록 sweep */
type SweepTextRevealValue =
  | (typeof TEXT_REVEAL_VALUE)[SweepTextVariant]
  | "sweep";

/** HTML 공백(스페이스·탭 등)으로만 자른다 — NBSP로 묶은 어절은 그대로 둔다. */
const WORD_SEPARATOR = /[ \t\f\r]+/;

const WIDE_GLYPH = /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\u3040-\u30ff\u4e00-\u9fff]/;
const SPACE_EM = 0.26;

/** Pretendard 기준 대략의 글자 폭(em) — 한글은 넓고 라틴 소문자는 좁다 */
const glyphEm = (glyph: string) => {
  if (WIDE_GLYPH.test(glyph)) return 0.92;
  if (/[A-Z0-9]/.test(glyph)) return 0.66;
  if (/[a-z]/.test(glyph)) return 0.54;
  return 0.36;
};

/**
 * 어절 지연을 앞선 글자 폭에 비례시킨다 → 어절마다 열리는 가장자리가 한 줄기 스윕처럼 같은 속도로 이어진다.
 * 줄이 바뀌어도 누적이라 읽는 순서대로 흐르고, 마지막 어절 지연은 stagger.max 안으로 줄인다.
 */
const splitWords = (text: string): Word[][] => {
  const lines = text
    .split("\n")
    .map((line) => line.split(WORD_SEPARATOR).filter(Boolean));
  const { perEm, max } = motionTokens.stagger;

  let offsetEm = 0;
  const offsets = lines.map((words) =>
    words.map((word) => {
      const start = offsetEm;
      offsetEm += Array.from(word).reduce((sum, glyph) => sum + glyphEm(glyph), 0);
      offsetEm += SPACE_EM;
      return start;
    })
  );
  const last = Math.max(0, ...offsets.flat());
  const scale = last * perEm > max ? max / (last * perEm) : 1;

  return lines.map((words, lineIndex) =>
    words.map((word, wordIndex) => ({
      text: word,
      delay: `${(offsets[lineIndex][wordIndex] * perEm * scale).toFixed(3)}s`,
    }))
  );
};

const SweepText = <T extends ElementType = "span">({
  as,
  children,
  variant = "sweep",
  delay,
  duration,
  curtain,
  onReveal,
  style,
  ref,
  ...rest
}: SweepTextProps<T>) => {
  const Tag: ElementType = as ?? "span";
  const lines = useMemo(() => splitWords(children), [children]);
  /* 긴 sweep 문장은 호스트 하나가 블록으로 쓸려 들어온다 — 어절 마크업은 그대로 둔다 */
  const block =
    variant === "sweep" && lines.flat().length > TEXT_SWEEP_MAX_WORDS;
  const reveal = useReveal<HTMLElement, SweepTextRevealValue>({
    variant: block ? "sweep" : TEXT_REVEAL_VALUE[variant],
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
    >
      {/* 루트가 flex·grid여도 어절·공백이 하나의 인라인 흐름으로 남게 감싼다 */}
      <span>
        {lines.map((words, lineIndex) => (
          <Fragment key={lineIndex}>
            {lineIndex > 0 ? (
              <>
                {" "}
                <br />
              </>
            ) : null}
            {words.map((word, wordIndex) => (
              <Fragment key={wordIndex}>
                {wordIndex > 0 ? " " : null}
                <span
                  data-sweep-word=""
                  style={
                    block
                      ? undefined
                      : ({ "--word-delay": word.delay } as CSSProperties)
                  }
                >
                  {word.text}
                </span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
};

export default SweepText;

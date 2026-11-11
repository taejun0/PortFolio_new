/**
 * 생성 이유: Thomas Eduardo식 가변 폭 이름 연출을 히어로 본문과 분리한다.
 * 역할: 압축 디스플레이 페이스로 쉬다가 렌즈(인트로 웨이브·마우스·터치)에 반응하는 히어로 네임이다.
 * 책임: 스플래시가 걷힐 때 CSS가 그리는 좌→우 인트로 웨이브의 일정(글자별 --wave-delay)을 SSR로 넣고,
 *       마우스 근접·터치 렌즈를 React 렌더 없이 rAF + CSS 변수(--sx·--sy·--ty)로 보간한다.
 *       렌즈를 쥐는 순간 진행 중인 웨이브는 JS가 같은 시계로 넘겨받아 렌즈와 함께 끊김 없이 그린다.
 *       이름 글자는 장식이다(aria-hidden) — h1의 접근 이름은 IntroSection의 숨긴 글자가 준다.
 *
 * 레이아웃 읽기 규칙 (프레임마다 강제 레이아웃을 만들지 않는다):
 * - 루트의 문서 기준 상자·슬롯 중심은 ResizeObserver(레이아웃 직후) 시점에만 잰다. 루트와 조상을 함께 관찰해
 *   줄바꿈·폰트 교체로 가운데 정렬 위치가 바뀌어도 다시 잰다.
 * - 포인터·터치는 문서 좌표(pageX·pageY — 이벤트를 만들 때 정해져 레이아웃을 읽지 않음)로 받아 캐시와만 비교하고,
 *   rAF 틱은 스타일 변수만 쓴다. 그래서 스크롤 위치를 따로 읽지 않는다.
 * - 포인터·터치 리스너는 이름이 화면 근처에 있을 때만(IntersectionObserver) 붙인다.
 *
 * 심미 원칙 (Pretendard는 wdth 축이 없음):
 * - 슬롯 폭은 고정 → transform만 바뀌어 레이아웃이 흔들리지 않음
 * - 쉬는 상태도 의도된 압축 페이스로 읽힘 → 첫 페인트부터 칠해져(LCP 안전) 커서 없는 터치 기기에서도 이름이 보임
 * - 인트로는 높이·색을 두고 가로로만 펴졌다 접히는 웨이브, 렌즈도 색을 바꾸지 않는다(단색)
 * - 터치 기기는 인트로 웨이브와 손가락 렌즈로 확장을 경험(패시브 리스너, 스크롤 방해 없음)
 * - reduced motion은 CSS가 자연 폭(transform: none)으로 고정하고 JS는 아무것도 칠하지 않음
 * - 스플래시 신호는 html[data-splash-done]으로 받는다 — 생략 경로처럼 첫 페인트 전에 붙든 준비 후 퇴장 때 붙든
 *   CSS가 그 순간 출발하므로 dismiss 이벤트를 따로 기다리거나 hydration에 묶이지 않는다.
 */
"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

import * as S from "./ExpandableName.styled";
import {
  LENS_LIFT_EM,
  LENS_SCALE_X,
  LENS_SCALE_Y,
  REST_SCALE_X,
  REST_SCALE_Y,
  SPACE_SLOT,
  WAVE_SCALE_X,
  buildWaveSchedule,
  lensAmount,
  waveAmount,
} from "./nameLens";

/** 세로 거리 가중 — 렌즈를 가로로 넓은 타원으로 만든다 */
const Y_WEIGHT = 0.55;
/** 렌즈 반경·히트 패드 — 슬롯 폭 배수라 화면 폭과 무관하게 두세 글자만 반응 */
const LENS_RADIUS_SLOTS = 1.45;
const HIT_PAD_SLOTS = 0.9;
const HIT_PAD_MIN_PX = 48;
/**
 * 포인터·터치 리스너를 붙여 두는 범위 — 이름이 뷰포트에서 이만큼 바깥까지 들어와 있을 때만 듣는다.
 * 히트 패드(슬롯 폭 × 0.9, 가장 넓은 화면에서 약 150px)보다 넓어야 패드 안 포인터를 놓치지 않는다.
 */
const LISTEN_MARGIN_PX = 200;

/** 렌즈 추종 시간 상수(ms) — 위치 / 켜짐 / 꺼짐 */
const FOLLOW_TAU_MS = 55;
const ENGAGE_TAU_MS = 70;
const RELEASE_TAU_MS = 160;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COARSE_POINTER_QUERY = "(hover: none), (pointer: coarse)";

type ExpandableNameProps = {
  text: string;
};

const ExpandableName = ({ text }: ExpandableNameProps) => {
  const letters = useMemo(() => Array.from(text), [text]);
  const slotUnits = useMemo(
    () =>
      letters.reduce((sum, char) => sum + (char === " " ? SPACE_SLOT : 1), 0),
    [letters]
  );
  const wave = useMemo(() => buildWaveSchedule(letters), [letters]);
  const rootRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const chars = Array.from(text);
    const timing = buildWaveSchedule(chars);
    const slots = slotRefs.current;
    const glyphs = glyphRefs.current;
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const coarsePointer = window.matchMedia(COARSE_POINTER_QUERY).matches;

    /** 루트의 문서 기준 상자와 루트 기준 슬롯 중심 — 레이아웃이 바뀔 때(ResizeObserver)만 다시 잰다 */
    const box = { left: 0, top: 0, right: 0, bottom: 0 };
    const centers: Array<{ x: number; y: number } | null> = [];
    let slotWidth = 0;
    let measured = false;

    const measure = () => {
      /*
       * 문서 위치는 offset 체인으로 구한다 — transform을 무시하므로 페이지 진입 스윕(translateX)이 도는 중에 재도
       * 스윕이 끝난 뒤의 자리와 같다(getBoundingClientRect는 그 순간의 이동량까지 캐시에 남긴다).
       */
      let left = 0;
      let top = 0;
      for (let node: HTMLElement | null = root; node; ) {
        const parent = node.offsetParent as HTMLElement | null;
        left += node.offsetLeft + (parent?.clientLeft ?? 0);
        top += node.offsetTop + (parent?.clientTop ?? 0);
        node = parent;
      }
      box.left = left;
      box.top = top;
      box.right = left + root.offsetWidth;
      box.bottom = top + root.offsetHeight;

      // 슬롯 중심은 루트 기준 상대값이라 같은 이동을 받는 두 상자의 차이로 잰다
      const base = root.getBoundingClientRect();
      slotWidth = 0;
      chars.forEach((char, index) => {
        const slot = slots[index];
        if (!slot || char === " ") {
          centers[index] = null;
          return;
        }
        const rect = slot.getBoundingClientRect();
        slotWidth = Math.max(slotWidth, rect.width);
        centers[index] = {
          x: rect.left + rect.width / 2 - base.left,
          y: rect.top + rect.height / 2 - base.top,
        };
      });
      measured = true;
    };

    /** 렌즈(문서 좌표)와 목표 — strength 0이면 쉬는 상태 */
    const lens = { x: 0, y: 0, strength: 0 };
    const target = { x: 0, y: 0, strength: 0 };
    /** JS가 이어 그리는 인트로 웨이브의 시작 시각(문서 타임라인 ms) — null이면 CSS가 그리는 중이거나 끝남 */
    let waveClock: number | null = null;
    /** CSS 웨이브 인계는 처음 렌즈를 쥘 때 한 번만 확인한다(포인터 이동마다 애니메이션을 조회하지 않게) */
    let waveChecked = false;
    /**
     * CSS 웨이브가 끝난 글자 수 — 전부 끝났으면 인계 확인을 건너뛴다
     * (getAnimations는 스타일을 강제로 다시 계산한다).
     */
    const waveGlyphCount = timing.delays.filter((delay) => delay !== null)
      .length;
    let waveEndedCount = 0;
    let frame = 0;
    let lastTime = 0;

    /** 쉬는 값은 CSS(S.Track)가 소유하므로 인라인 변수를 걷어 낸다 */
    const clearGlyph = (glyph: HTMLSpanElement) => {
      glyph.style.removeProperty("--sx");
      glyph.style.removeProperty("--sy");
      glyph.style.removeProperty("--ty");
    };

    /** 캐시한 기하만 읽고 스타일 변수만 쓴다 — 레이아웃을 읽지 않는다 */
    const paint = (now: number) => {
      const radius = slotWidth * LENS_RADIUS_SLOTS;
      const lensOn = lens.strength > 0 && radius > 0;
      const waveTime = waveClock === null ? -1 : (now - waveClock) / 1000;

      chars.forEach((_, index) => {
        const glyph = glyphs[index];
        const center = centers[index];
        if (!glyph || !center) return;

        let lensPart = 0;
        if (lensOn) {
          const dx = lens.x - (box.left + center.x);
          const dy = (lens.y - (box.top + center.y)) * Y_WEIGHT;
          const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / radius);
          lensPart = lensAmount(proximity) * lens.strength;
        }

        const delay = timing.delays[index];
        const wavePart =
          waveTime < 0 || delay === null
            ? 0
            : waveAmount((waveTime - delay) / timing.duration);

        if (lensPart <= 0 && wavePart <= 0) {
          clearGlyph(glyph);
          return;
        }

        // 렌즈와 웨이브가 겹치면 더 펴진 쪽을 따른다 — 곱하지 않으므로 렌즈 최대치를 넘지 않는다
        const scaleX = Math.max(
          REST_SCALE_X + (LENS_SCALE_X - REST_SCALE_X) * lensPart,
          REST_SCALE_X + (WAVE_SCALE_X - REST_SCALE_X) * wavePart
        );
        glyph.style.setProperty("--sx", scaleX.toFixed(3));
        glyph.style.setProperty(
          "--sy",
          (REST_SCALE_Y + (LENS_SCALE_Y - REST_SCALE_Y) * lensPart).toFixed(3)
        );
        glyph.style.setProperty(
          "--ty",
          `${(LENS_LIFT_EM * lensPart).toFixed(4)}em`
        );
      });
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;

      const follow = 1 - Math.exp(-dt / FOLLOW_TAU_MS);
      lens.x += (target.x - lens.x) * follow;
      lens.y += (target.y - lens.y) * follow;
      const tau =
        target.strength > lens.strength ? ENGAGE_TAU_MS : RELEASE_TAU_MS;
      lens.strength +=
        (target.strength - lens.strength) * (1 - Math.exp(-dt / tau));
      if (Math.abs(target.strength - lens.strength) < 0.004) {
        lens.strength = target.strength;
      }
      if (waveClock !== null && (now - waveClock) / 1000 >= timing.end) {
        waveClock = null;
      }

      paint(now);

      const running =
        waveClock !== null ||
        lens.strength !== target.strength ||
        (lens.strength > 0 &&
          Math.hypot(target.x - lens.x, target.y - lens.y) > 0.5);
      if (running) frame = window.requestAnimationFrame(tick);
      else lastTime = 0;
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(tick);
    };

    const onWaveEnd = (event: AnimationEvent) => {
      if (event.animationName === S.nameWave.name) waveEndedCount += 1;
    };

    /**
     * 진행 중인(지연 대기 포함) CSS 인트로 웨이브를 같은 시계로 넘겨받는다.
     * CSS 애니메이션의 startTime은 rAF 시각과 같은 문서 타임라인이라, 멈춘 자리부터 JS가 같은 함수로 이어 그린다.
     */
    const takeOverWave = () => {
      if (waveChecked) return;
      waveChecked = true;
      // 글자마다 끝을 이미 들었으면 넘겨받을 것이 없다
      if (waveGlyphCount > 0 && waveEndedCount >= waveGlyphCount) return;
      let found = false;
      let clock = Number.POSITIVE_INFINITY;
      for (const glyph of glyphs) {
        if (!glyph || typeof glyph.getAnimations !== "function") continue;
        for (const animation of glyph.getAnimations()) {
          if ((animation as CSSAnimation).animationName !== S.nameWave.name) {
            continue;
          }
          found = true;
          if (typeof animation.startTime === "number") {
            clock = Math.min(clock, animation.startTime);
          }
        }
      }
      // 이미 끝났거나 처음부터 돌지 않은(data-motion 없음) 웨이브는 넘겨받을 것이 없다
      if (!found) return;
      root.dataset.wave = "off";
      // 막 생겨 아직 시작 시각이 없으면(첫 프레임 전) 지금부터 같은 일정으로 그린다
      waveClock = Number.isFinite(clock) ? clock : performance.now();
    };

    /** 문서 좌표가 루트 상자 + 히트 패드 안인지 — 캐시만 비교한다 */
    const isNear = (x: number, y: number) => {
      if (!measured) return false;
      const pad = Math.max(HIT_PAD_MIN_PX, slotWidth * HIT_PAD_SLOTS);
      return (
        x >= box.left - pad &&
        x <= box.right + pad &&
        y >= box.top - pad &&
        y <= box.bottom + pad
      );
    };

    const engage = (x: number, y: number) => {
      // 스플래시가 덮고 있는 동안에는 반응하지 않는다(보이지 않는 렌즈가 인트로 웨이브를 가로채지 않게)
      if (
        reducedMotion.matches ||
        document.documentElement.dataset.splashDone !== "1"
      ) {
        return;
      }
      takeOverWave();
      if (lens.strength < 0.02) {
        lens.x = x;
        lens.y = y;
      }
      target.x = x;
      target.y = y;
      target.strength = 1;
      schedule();
    };

    const release = () => {
      if (target.strength === 0) return;
      target.strength = 0;
      schedule();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (isNear(event.pageX, event.pageY)) {
        engage(event.pageX, event.pageY);
        return;
      }
      release();
    };

    let touchId: number | null = null;

    const findTouch = (list: TouchList) => {
      for (let index = 0; index < list.length; index += 1) {
        if (list[index].identifier === touchId) return list[index];
      }
      return null;
    };

    const onTouchStart = (event: TouchEvent) => {
      if (touchId !== null) return;
      const touch = event.changedTouches[0];
      if (!touch || !isNear(touch.pageX, touch.pageY)) return;
      touchId = touch.identifier;
      engage(touch.pageX, touch.pageY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchId === null || target.strength === 0) return;
      const touch = findTouch(event.changedTouches);
      if (!touch) return;
      target.x = touch.pageX;
      target.y = touch.pageY;
      schedule();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchId === null || !findTouch(event.changedTouches)) return;
      touchId = null;
      release();
    };

    const onReducedMotionChange = () => {
      if (!reducedMotion.matches) return;
      touchId = null;
      target.strength = 0;
      lens.strength = 0;
      waveClock = null;
      paint(performance.now());
    };

    /** 포인터·터치 리스너 — 이름이 화면 근처에 있을 때만 붙어 있다 */
    let listening = false;

    const listen = () => {
      if (listening) return;
      listening = true;
      if (!coarsePointer) {
        window.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
        document.documentElement.addEventListener("mouseleave", release);
      }
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    };

    const unlisten = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", release);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };

    // 레이아웃 직후 콜백이라 읽어도 강제 레이아웃이 없다 — 관찰을 시작하면 첫 측정도 여기서 한다
    const resizeObserver = new ResizeObserver(() => {
      measure();
      if (waveClock !== null || lens.strength > 0) schedule();
    });
    for (
      let node: HTMLElement | null = root;
      node && node !== document.body;
      node = node.parentElement
    ) {
      resizeObserver.observe(node);
    }

    // 화면 근처를 벗어나면 리스너를 떼고 렌즈를 놓는다(쥔 터치도 잊는다)
    const visibility = new IntersectionObserver(
      (entries) => {
        if (entries[entries.length - 1]?.isIntersecting) {
          listen();
          return;
        }
        unlisten();
        touchId = null;
        release();
      },
      { rootMargin: `${LISTEN_MARGIN_PX}px` }
    );
    visibility.observe(root);

    root.addEventListener("animationend", onWaveEnd);
    window.addEventListener("blur", release);
    reducedMotion.addEventListener("change", onReducedMotionChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      unlisten();
      root.removeEventListener("animationend", onWaveEnd);
      window.removeEventListener("blur", release);
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      glyphs.forEach((glyph) => {
        if (glyph) clearGlyph(glyph);
      });
    };
  }, [text]);

  return (
    <S.Name ref={rootRef} aria-hidden>
      <S.Track
        $slots={slotUnits}
        style={
          {
            "--wave-duration": `${wave.duration.toFixed(3)}s`,
          } as CSSProperties
        }
      >
        {letters.map((char, index) =>
          char === " " ? (
            <S.Space key={`space-${index}`} />
          ) : (
            <S.Slot
              key={`${char}-${index}`}
              ref={(node) => {
                slotRefs.current[index] = node;
              }}
            >
              <S.Fall>
                <S.Glyph
                  ref={(node) => {
                    glyphRefs.current[index] = node;
                  }}
                  style={
                    {
                      "--wave-delay": `${(wave.delays[index] ?? 0).toFixed(3)}s`,
                    } as CSSProperties
                  }
                >
                  {char}
                </S.Glyph>
              </S.Fall>
            </S.Slot>
          )
        )}
      </S.Track>
    </S.Name>
  );
};

export default ExpandableName;

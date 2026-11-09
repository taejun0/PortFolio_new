/**
 * 생성 이유: About 마퀴가 스크롤 속도에 반응해 빨라졌다가 제 속도로 가라앉게 한다.
 * 역할: CSS 기본 흐름(컴포지터에서 도는 drift 애니메이션)의 재생 배속만 바꾸는 훅이다. 트랜스폼은 쓰지 않는다.
 * 책임: 스크롤 속도 측정·배속 lerp·방향 전환, 터치·펜 탭 일시정지 토글, 동작 줄이기 전환 뒤 애니메이션 다시 잡기만 맡는다.
 *
 * - 흐름은 늘 CSS 애니메이션이다 — 메인 스레드가 바빠도 멈추지 않는다. 훅은 그 CSSAnimation을 한 번 잡아
 *   updatePlaybackRate로 배속만 바꾼다. 화면 안에서 가만히 있을 때는 rAF도, 스크롤 리스너 호출도 없다.
 * - 스크롤 리스너(passive)는 섹션이 화면 안에 있을 때만 단다(IntersectionObserver). 속도는 스크롤 이벤트 시각 사이의
 *   scrollY 차이다. 배속이 목표에 닿을 때까지만 rAF가 돌고, 가라앉으면 멈춘다.
 * - 아래로 스크롤하면 왼쪽, 위로 스크롤하면 오른쪽(음수 배속)으로 흐른다. 방향은 마지막 스크롤을 따라 유지되고,
 *   바뀔 때도 배속이 0을 지나 부드럽게 돌아선다. 음수 배속이 애니메이션 시작점(0)에 닿지 않도록
 *   잡는 순간 같은 위상 그대로 currentTime을 아주 먼 지점으로 옮겨 둔다(보이는 위치는 그대로).
 * - 마우스 호버·키보드 포커스 정지는 CSS animation-play-state 몫이다. play()·pause()를 부르면 CSS 재생 상태가
 *   무시되므로 부르지 않는다. 호버가 없는 기기는 탭(끌지 않고 뗀 터치·펜)으로 섹션의 data-paused를 켜고 끈다(WCAG 2.2.2).
 * - 동작 줄이기면 CSS가 애니메이션을 없앤다. 실행 중 다시 허용되면 새로 생긴 애니메이션을 다시 잡는다.
 */
"use client";

import { useEffect, type RefObject } from "react";

/** 기본 한 바퀴(한 벌 폭) 시간(s) — CSS drift 길이다. */
export const MARQUEE_LOOP_S = 42;

/** 탭으로 켜고 끄는 지속 정지 표시 — 섹션에 붙고 스타일이 재생 상태를 멈춘다. */
export const MARQUEE_PAUSED_ATTR = "data-paused";

/** 스크롤 1px/s당 더해지는 배속 — 1,500px/s로 내리면 기본의 약 3배 */
const BOOST_PER_PX_S = 1 / 750;
/** 더해지는 배속 상한 — 아무리 빨리 굴려도 기본의 3.5배를 넘지 않는다 */
const MAX_BOOST = 2.5;
/** 이보다 느린 스크롤(px/s)은 방향을 바꾸지 않는다(관성 꼬리·1px 보정 무시) */
const DIRECTION_DEADZONE = 80;

/**
 * 지수 lerp 시간 상수(s) — 프레임레이트와 무관하게 1 − e^(−dt/τ)씩 다가간다(약 3τ에 95%).
 * 스크롤 속도는 빠르게 따라가고, 빨라질 때는 짧게, 제 속도로 돌아올 때·방향을 틀 때는 길게 가라앉는다.
 */
const VELOCITY_TAU = 0.08;
const ACCEL_TAU = 0.2;
const SETTLE_TAU = 0.6;

/** 끊긴 프레임·긴 이벤트 간격에서 한 번에 셈하는 최대 시간(s) */
const MAX_FRAME_S = 1 / 20;
/** 배속이 목표에 이만큼 다가가면 목표에 붙이고 rAF를 멈춘다 */
const SETTLE_EPSILON = 0.01;
/** 이보다 작은 배속 변화는 애니메이션에 넘기지 않는다(넘길 때마다 컴포지터와 다시 맞춘다) */
const RATE_STEP = 0.004;

/** 음수 배속이 시작점(0)에 닿지 않게 옮겨 두는 바퀴 수 — 3.5배로 거꾸로 흘러도 수십 시간 걸린다 */
const REWIND_ROOM_LOOPS = 10000;

/** 탭으로 보는 최대 이동(px) — 넘으면 끌기·스크롤이다 */
const TAP_SLOP_PX = 10;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const approach = (value: number, target: number, dt: number, tau: number) =>
  value + (target - value) * (1 - Math.exp(-dt / tau));

/** CSS drift를 잡아 같은 위상의 먼 지점으로 옮긴다 — 보이는 위치는 그대로다. */
const grabDrift = (track: HTMLElement) => {
  const drift = track
    .getAnimations()
    .find(
      (animation): animation is CSSAnimation =>
        animation instanceof CSSAnimation
    );
  if (!drift) return null;

  const loopMs = MARQUEE_LOOP_S * 1000;
  const time = drift.currentTime;
  const phase =
    typeof time === "number" ? ((time % loopMs) + loopMs) % loopMs : 0;
  drift.currentTime = REWIND_ROOM_LOOPS * loopMs + phase;
  return drift;
};

type MarqueeRefs = {
  /** 마퀴 섹션 — 화면 안 판정·탭 정지 토글 */
  rootRef: RefObject<HTMLElement | null>;
  /** 두 벌을 담은 트랙 — CSS drift가 걸린 요소 */
  trackRef: RefObject<HTMLElement | null>;
};

export const useMarqueeVelocity = ({ rootRef, trackRef }: MarqueeRefs) => {
  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    let drift: CSSAnimation | null = null;
    /** 애니메이션에 마지막으로 넘긴 배속 */
    let applied = 1;
    let rate = 1;
    let direction = 1;
    let velocity = 0;
    let lastY = 0;
    let lastScrollAt = 0;
    /** 지난 프레임 뒤 스크롤 이벤트가 있었는지 — 없으면 그 프레임의 스크롤 속도는 0이다 */
    let scrolled = false;
    let lastTick = 0;
    let frame = 0;
    let listening = false;

    const apply = (next: number, exact = false) => {
      if (!drift || next === applied) return;
      if (!exact && Math.abs(next - applied) < RATE_STEP) return;
      applied = next;
      drift.updatePlaybackRate(next);
    };

    const sleep = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTick = 0;
    };

    /** 스크롤이 남긴 배속을 지우고 기본 속도(마지막 방향)에 붙인다. */
    const rest = () => {
      sleep();
      velocity = 0;
      rate = direction;
      apply(rate, true);
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = lastTick ? Math.min((now - lastTick) / 1000, MAX_FRAME_S) : 0;
      lastTick = now;

      const quiet = !scrolled;
      scrolled = false;
      if (quiet) velocity = approach(velocity, 0, dt, VELOCITY_TAU);
      if (Math.abs(velocity) > DIRECTION_DEADZONE) {
        direction = Math.sign(velocity);
      }

      const boost = Math.min(Math.abs(velocity) * BOOST_PER_PX_S, MAX_BOOST);
      const target = direction * (1 + boost);
      const speedingUp =
        Math.abs(target) > Math.abs(rate) && target * rate >= 0;
      rate = approach(rate, target, dt, speedingUp ? ACCEL_TAU : SETTLE_TAU);

      // 스크롤이 멈추고 배속이 기본 속도에 닿으면 rAF를 거둔다 — 다음 스크롤 이벤트가 다시 깨운다.
      if (
        quiet &&
        boost < SETTLE_EPSILON &&
        Math.abs(rate - target) < SETTLE_EPSILON
      ) {
        rest();
        return;
      }
      apply(rate);
      frame = window.requestAnimationFrame(tick);
    };

    const onScroll = (event: Event) => {
      const y = window.scrollY;
      const gap = event.timeStamp - lastScrollAt;
      // 리스너를 단 뒤 첫 이벤트는 기준점만 잡는다(그 전 위치를 모른다).
      if (lastScrollAt && gap > 0) {
        const dt = Math.min(gap / 1000, MAX_FRAME_S);
        velocity = approach(velocity, (y - lastY) / dt, dt, VELOCITY_TAU);
      }
      lastY = y;
      lastScrollAt = event.timeStamp;
      scrolled = true;
      if (!frame && drift) frame = window.requestAnimationFrame(tick);
    };

    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        lastScrollAt = 0;
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    };

    // 화면 안에서만 스크롤을 듣는다. 화면을 벗어나면 남은 배속을 바로 기본 속도로 돌린다.
    const visibility = new IntersectionObserver((entries) => {
      const inView = entries[entries.length - 1].isIntersecting;
      listen(inView && drift !== null);
      if (!inView) rest();
    });

    const acquire = () => {
      drift = grabDrift(track);
      if (!drift) return;
      applied = drift.playbackRate;
      rate = applied;
      direction = Math.sign(applied) || 1;
      visibility.observe(root);
    };

    const release = () => {
      sleep();
      listen(false);
      visibility.disconnect();
      drift = null;
    };

    // 동작 줄이기로 바뀌면 CSS가 애니메이션을 없앤다 — 다시 허용되면 스타일이 새 애니메이션을 만든 뒤 잡는다.
    let acquireFrame = 0;
    const onMotionChange = () => {
      window.cancelAnimationFrame(acquireFrame);
      release();
      if (!reducedMotion.matches) {
        acquireFrame = window.requestAnimationFrame(acquire);
      }
    };

    // 터치·펜 탭(끌지 않고 뗌) — 섹션의 지속 정지 표시를 켜고 끈다. 스크롤로 이어지면 pointercancel이 온다.
    let tapStart: { id: number; x: number; y: number } | null = null;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || !event.isPrimary) return;
      tapStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!tapStart || event.pointerId !== tapStart.id) return;
      const moved = Math.hypot(
        event.clientX - tapStart.x,
        event.clientY - tapStart.y
      );
      tapStart = null;
      if (moved <= TAP_SLOP_PX) root.toggleAttribute(MARQUEE_PAUSED_ATTR);
    };
    const onPointerCancel = () => {
      tapStart = null;
    };

    if (!reducedMotion.matches) acquire();
    reducedMotion.addEventListener("change", onMotionChange);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerCancel);

    // 언마운트(StrictMode 재마운트 포함) — 리스너를 거두고 배속만 기본 속도로 돌려 둔다(위치는 그대로).
    return () => {
      window.cancelAnimationFrame(acquireFrame);
      reducedMotion.removeEventListener("change", onMotionChange);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerCancel);
      rest();
      release();
    };
  }, [rootRef, trackRef]);
};

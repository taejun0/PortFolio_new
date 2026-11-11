/**
 * 생성 이유: 페이지·컴포넌트마다 IntersectionObserver를 만들지 않고 리빌 판정을 한곳에서 한다.
 * 역할: 리빌 요소 등록, 첫 화면 판정, 단일 IntersectionObserver, 배치 스태거, 스플래시 대기를 맡는 모듈 컨트롤러다.
 * 책임: data-reveal-state·--reveal-delay·html[data-motion]만 쓴다. 가림·애니메이션 시각은 motionGlobalStyles가 소유한다.
 *
 * 판정 규칙
 * - 첫 로드(SSR로 이미 칠해진 화면): 등록을 다음 애니메이션 프레임까지 모아 한 번에 위치를 잰다(읽기 → 쓰기).
 *   hydration 커밋마다 재지 않아 같은 프레임의 등록이 레이아웃 계산 한 번으로 끝난다. 화면 밖이라 렌더링을 건너뛴
 *   content-visibility:auto 구획 안의 요소는 재지 않는다(재면 구획마다 레이아웃이 따로 강제된다) — 구획 상자로
 *   위(바로 보임)·아래(판정선 대기)만 가린다.
 *   뷰포트 안·위 → 애니메이션 없이 "shown"(깜빡임·LCP 지연 없음).
 *   단 커튼 변형은 첫 페인트부터 덮여 있었으므로 걷어 내며 등장한다 — html[data-splash-done]이 이미 붙어
 *   CSS가 걷기 시작했으면 그 애니메이션을 그대로 이어받고("in"), 아직 스플래시 중이면 "pending"으로 두었다가
 *   dismiss 신호에 재생한다. 뷰포트 아래 → "pending", 판정선에 들어오면 "in".
 * - 클라이언트 내비게이션으로 새로 마운트: 아직 칠해지지 않았으므로 같은 태스크의 마이크로태스크에서(페인트 전에)
 *   모두 "pending"으로 두고, IO 첫 콜백이 화면 안 요소를 "in"으로 바꾼다(첫 프레임이 곧 애니메이션 시작 상태라 깜빡임이 없다).
 * - 빠르게 훑을 때: 판정선을 넘는 순간 스크롤 속도가 FLING_SPEED_PX_S를 넘거나, 윗변이 이미 뷰포트
 *   FLING_SHOW_LINE 위까지 들어와 있으면(점프·프레임 건너뜀) 애니메이션 없이 바로 보이고, 그 뒤 FLING_HOLD_MS 동안
 *   넘어오는 블록도 같다 — 쓸려 들어오는 동안 빈 섹션이 지나가지 않는다. 속도는 위치를 읽지 않고 IO 기록(판정선을
 *   넘어 들어온 거리)과 스크롤 이벤트 시각(프레임 간격)으로 잰다 — 스크롤 중에도 레이아웃을 강제하지 않는다.
 *   관찰을 시작할 때 이미 화면 안이던 요소(내비게이션 직후 첫 화면)는 스크롤로 넘어온 게 아니므로 그대로 등장한다.
 *   판정선(REVEAL_ROOT_MARGIN)은 느린 스크롤의 차분한 타이밍을 위해 그대로다.
 * - 한 번 보인 요소는 되돌리지 않는다(위로 스크롤해도 다시 재생하지 않음).
 * - 연속 스크롤로 배치가 이어 들어오면, 앞 배치의 예약된 시작이 끝나기 전 아래 배치는 그 뒤에 잇는다(chainCarry,
 *   최대 CHAIN_CARRY_MAX_S).
 */
import { SPLASH_DISMISS_EVENT } from "@/components/layout/splash/events";
import { motionTokens } from "@/styles/theme";

import {
  CHAIN_CARRY_MAX_S,
  CURTAIN_FAILSAFE_S,
  CURTAIN_START_S,
  CURTAIN_VALUES,
  FLING_HOLD_MS,
  FLING_SHOW_LINE,
  FLING_SPEED_PX_S,
  MOTION_ARMED,
  MOTION_ATTR,
  MOTION_LIVE,
  READY_FAILSAFE_MS,
  REVEAL_ATTR,
  REVEAL_LINE,
  REVEAL_ROOT_MARGIN,
  REVEAL_STATE_ATTR,
  SCROLL_IDLE_MS,
  type RevealState,
} from "./constants";

export type RevealInfo = {
  /** false면 애니메이션 없이 바로 보였다(첫 화면·동작 줄이기·이미 지나간 요소) */
  animated: boolean;
  /** 애니메이션 시작까지 남은 지연(s) */
  delay: number;
};

export type RevealOptions = {
  /** 배치 스태거에 더해지는 추가 지연(s) */
  delay?: number;
  /** 보이기 시작할 때 한 번(마운트마다) 호출된다 — 멱등하게 작성한다 */
  onReveal?: (info: RevealInfo) => void;
};

type RevealEntry = {
  el: HTMLElement;
  delay: number;
  onReveal?: (info: RevealInfo) => void;
  /** IO가 관찰 시작 뒤 첫 기록을 이미 줬는지 — 첫 기록이 교차면 스크롤로 넘어온 게 아니라 처음부터 화면 안이었다 */
  seen: boolean;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const entries = new Map<HTMLElement, RevealEntry>();
const queue = new Set<HTMLElement>();
let flushScheduled = false;
let booted = false;
let enabled = false;
let ready = false;
let readyTimer = 0;
let observer: IntersectionObserver | null = null;
let awaitingReady: HTMLElement[] = [];
let initialPath = "";
let navigated = false;
/** 부트 스크립트가 첫 페인트 전에 커튼을 켰는지 — 아니었다면 첫 화면 커튼은 이미 맨 내용으로 보였다. */
let armedAtBoot = false;
/** 지금까지 예약한 마지막 시작 시각(performance.now, ms)과 그 요소 — 연속 배치가 읽는 순서를 잇는다. */
let chainEnd = 0;
let chainTail: HTMLElement | null = null;
/**
 * 마지막 두 스크롤 이벤트 시각(ms) — 프레임 간격만 잰다. 스크롤 위치는 읽지 않는다
 * (scrollY·innerHeight는 밀린 스타일·레이아웃을 강제로 계산시킨다 — IO 기록의 좌표로 대신한다).
 */
let scrollEventPrev = 0;
let scrollEventLast = 0;
/** 이 시각(performance.now, ms)까지는 플링으로 보고 판정선을 넘는 블록을 바로 보인다 */
let flingUntil = 0;

const getState = (el: HTMLElement) =>
  el.getAttribute(REVEAL_STATE_ATTR) as RevealState | null;

const setState = (el: HTMLElement, state: RevealState) => {
  el.setAttribute(REVEAL_STATE_ATTR, state);
};

const notify = (entry: RevealEntry, info: RevealInfo) => {
  entry.onReveal?.(info);
};

const show = (entry: RevealEntry) => {
  setState(entry.el, "shown");
  notify(entry, { animated: false, delay: 0 });
};

/**
 * CSS가 hydration 전에 시작한 커튼 애니메이션을 이어받는다.
 * "in" 규칙이 등록 전 규칙과 같은 선언이고 --reveal-delay도 그대로라 애니메이션이 다시 시작되지 않는다.
 */
const adopt = (entry: RevealEntry) => {
  const { el } = entry;
  const inline = parseFloat(el.style.getPropertyValue("--reveal-delay"));
  const delay = Number.isFinite(inline) ? inline : CURTAIN_START_S;
  if (!Number.isFinite(inline)) {
    el.style.setProperty("--reveal-delay", `${CURTAIN_START_S}s`);
  }
  setState(el, "in");
  notify(entry, { animated: true, delay });
};

const byDocumentOrder = (a: HTMLElement, b: HTMLElement) =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/**
 * 앞 배치의 시작이 아직 예약돼 있고 이 배치가 문서상 그 뒤라면, 앞 배치 마지막 시작 + item에서 이어 간다.
 * 연속 스크롤에서 다음 프레임에 들어온 아래 요소가 위 요소보다 먼저 출발해 캐스케이드가 뒤집히지 않게 한다.
 * 이어 붙는 대기는 CHAIN_CARRY_MAX_S를 넘지 않고, 앞 시작이 모두 지났으면(일반적인 한 개씩 들어오는 스크롤) 0이다.
 */
const chainCarry = (first: HTMLElement, now: number) => {
  if (chainEnd <= now || !chainTail?.isConnected) return 0;
  if (byDocumentOrder(chainTail, first) > 0) return 0;
  const { item } = motionTokens.stagger;
  return Math.min(CHAIN_CARRY_MAX_S, (chainEnd - now) / 1000 + item);
};

/**
 * 함께 보이게 된 요소들을 읽는 순서대로 스태거한다 — 한 배치의 누적 지연은 stagger.max를 넘지 않는다.
 * chain: 앞 배치의 남은 캐스케이드 뒤에 잇는다(revealNow처럼 사용자가 직접 연 요소는 기다리지 않는다).
 */
const play = (elements: HTMLElement[], offset: number, chain = true) => {
  const batch = elements
    .filter((el) => entries.has(el) && getState(el) === "pending")
    .sort(byDocumentOrder);
  if (batch.length === 0) return;

  const { item, max } = motionTokens.stagger;
  const step = batch.length > 1 ? Math.min(item, max / (batch.length - 1)) : 0;
  const now = performance.now();
  const start = offset + (chain ? chainCarry(batch[0], now) : 0);

  batch.forEach((el, index) => {
    const entry = entries.get(el);
    if (!entry) return;
    const delay = start + entry.delay + index * step;
    el.style.setProperty("--reveal-delay", `${delay.toFixed(3)}s`);
    setState(el, "in");
    notify(entry, { animated: true, delay });
  });

  const lastStart = now + (start + (batch.length - 1) * step) * 1000;
  if (chain && lastStart >= chainEnd) {
    chainEnd = lastStart;
    chainTail = batch[batch.length - 1];
  }
};

/** 스크롤 이벤트 시각만 기록한다(위치를 읽지 않아 레이아웃을 강제하지 않는다). */
const onScroll = (event: Event) => {
  scrollEventPrev = scrollEventLast;
  scrollEventLast = event.timeStamp;
};

/**
 * 스크롤로 판정선을 넘어 들어온 기록들을 보고 지금 빠르게 훑는 중인지 정한다(같은 콜백의 기록은 같은 프레임이다).
 * - 깊이 들어옴: 윗변이 이미 뷰포트 FLING_SHOW_LINE 위 — 점프·프레임 건너뜀.
 * - 빠름: 판정선을 넘어 들어온 거리 ÷ 스크롤 이벤트 사이 프레임 간격 > FLING_SPEED_PX_S.
 *   넘어 들어온 거리는 지난 프레임 스크롤 양의 하한이라 느린 스크롤을 플링으로 잘못 보지 않는다.
 * 판정선 위치는 기록의 rootBounds.bottom(뷰포트의 REVEAL_LINE 지점)이다 — 레이아웃을 읽지 않는다.
 */
const detectFling = (crossings: IntersectionObserverEntry[], now: number) => {
  const frame = scrollEventLast - scrollEventPrev;
  const scrolling =
    now - scrollEventLast < SCROLL_IDLE_MS && frame > 0 && frame < SCROLL_IDLE_MS;
  return crossings.some((record) => {
    const line = record.rootBounds?.bottom;
    if (line === undefined) return false;
    const { top } = record.boundingClientRect;
    if (top < (line / REVEAL_LINE) * FLING_SHOW_LINE) return true;
    return scrolling && ((line - top) / frame) * 1000 > FLING_SPEED_PX_S;
  });
};

const onIntersect = (records: IntersectionObserverEntry[]) => {
  const now = performance.now();
  const crossings: IntersectionObserverEntry[] = [];
  const batch: HTMLElement[] = [];

  records.forEach((record) => {
    const el = record.target as HTMLElement;
    const entry = entries.get(el);
    // 관찰 시작 뒤 첫 기록 — 이때 교차면 처음부터 화면 안이었다(내비게이션 직후 첫 화면).
    const initial = !!entry && !entry.seen;
    if (entry) entry.seen = true;
    if (!record.isIntersecting) return;
    observer?.unobserve(el);
    if (!entry || getState(el) !== "pending") return;
    // 판정선을 건너뛰어 이미 뷰포트 위로 지나간 요소(빠른 스크롤·해시 점프)는 애니메이션 없이 보인다.
    if (record.boundingClientRect.bottom <= 0) {
      show(entry);
      return;
    }
    if (initial) batch.push(el);
    else crossings.push(record);
  });

  if (crossings.length > 0) {
    if (detectFling(crossings, now)) flingUntil = now + FLING_HOLD_MS;
    // 빠르게 훑는 중이면 쓸려 들어오는 동안 비어 보이지 않게 바로 보이고, 아니면 평소대로 등장한다.
    crossings.forEach((record) => {
      const el = record.target as HTMLElement;
      const entry = entries.get(el);
      if (!entry) return;
      if (now < flingUntil) show(entry);
      else batch.push(el);
    });
  }

  play(batch, 0);
};

const markReady = () => {
  if (ready) return;
  ready = true;
  window.clearTimeout(readyTimer);
  window.removeEventListener(SPLASH_DISMISS_EVENT, markReady);
  const waiting = awaitingReady;
  awaitingReady = [];
  play(waiting, CURTAIN_START_S);
};

/** 실행 중 동작 줄이기로 바뀌면 남은 요소를 모두 그 자리에서 보인다(CSS도 같은 미디어 쿼리로 가림을 푼다). */
const onReducedMotionChange = (event: MediaQueryListEvent) => {
  if (!event.matches) return;
  enabled = false;
  observer?.disconnect();
  awaitingReady = [];
  entries.forEach((entry) => {
    if (getState(entry.el) === "pending") show(entry);
  });
};

/** 문서를 처음 연 주소 — 모듈이 늦게 로드돼도 내비게이션 타이밍이 첫 주소를 알려 준다. */
const readInitialPath = () => {
  try {
    const [navigation] = performance.getEntriesByType("navigation");
    if (navigation?.name) return new URL(navigation.name).pathname;
  } catch {
    /* 타이밍 API가 없으면 현재 주소로 대신한다 */
  }
  return window.location.pathname;
};

/** 첫 문서 주소에서 한 번이라도 벗어났다면 이후 등록은 모두 클라이언트 내비게이션의 새 마운트다. */
const isFreshMount = () => {
  if (!navigated && window.location.pathname !== initialPath) navigated = true;
  return navigated;
};

type NavigateEventLike = Event & {
  navigationType?: string;
  hashChange?: boolean;
  destination?: { url: string };
};

/**
 * 리빌이 없는 페이지를 거쳐 첫 주소로 돌아온 경우도 새 마운트로 알아보도록 내비게이션 자체를 듣는다.
 * Navigation API(push·traverse, 경로가 바뀐 replace)와 popstate(뒤로·앞으로)만 본다 — 같은 페이지의 해시 이동은 제외.
 * 판정을 놓쳐도 첫 로드 규칙(화면 안은 그대로 보임)으로 떨어져 깜빡임은 생기지 않는다.
 */
const watchNavigation = () => {
  const markNavigated = () => {
    navigated = true;
  };
  window.addEventListener("popstate", markNavigated, { once: true });

  const navigation = (window as Window & { navigation?: EventTarget })
    .navigation;
  if (!navigation) return;
  const onNavigate = (event: Event) => {
    const { navigationType, hashChange, destination } =
      event as NavigateEventLike;
    if (hashChange) return;
    const samePath =
      !!destination &&
      new URL(destination.url).pathname === window.location.pathname;
    if (navigationType === "replace" && samePath) return;
    navigated = true;
    navigation.removeEventListener("navigate", onNavigate);
  };
  navigation.addEventListener("navigate", onNavigate);
};

const boot = () => {
  if (booted) return;
  booted = true;

  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  enabled =
    !reducedMotion.matches && typeof IntersectionObserver !== "undefined";
  initialPath = readInitialPath();
  armedAtBoot =
    document.documentElement.getAttribute(MOTION_ATTR) === MOTION_ARMED;

  if (!enabled) {
    // 부트 스크립트가 켜 둔 커튼까지 거둬 모든 요소를 그대로 보인다.
    document.documentElement.removeAttribute(MOTION_ATTR);
    return;
  }

  observer = new IntersectionObserver(onIntersect, {
    rootMargin: REVEAL_ROOT_MARGIN,
    threshold: 0,
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  watchNavigation();

  ready = document.documentElement.dataset.splashDone === "1";
  if (!ready) {
    window.addEventListener(SPLASH_DISMISS_EVENT, markReady);
    readyTimer = window.setTimeout(() => {
      // 실제 화면 준비를 기다리는 스플래시는 자체 안전 제한이 관리한다.
      if (document.documentElement.dataset.splash !== "play") markReady();
    }, READY_FAILSAFE_MS);
  }

  reducedMotion.addEventListener("change", onReducedMotionChange);
};

/**
 * 위치를 재도 레이아웃이 따로 강제되지 않는 요소인지(스타일만 읽는다).
 * 화면 밖이라 렌더링을 건너뛴 content-visibility:auto 구획 안의 요소는 위치를 재면 구획마다 레이아웃이 따로 강제되므로,
 * 재지 않고 IO에 맡긴다(화면 밖이 분명하다 — 위로 지나간 요소는 IO가 바로 보인다). display:none 안의 요소도 같다 —
 * 보이게 되면 IO가 판정선·깊이 규칙으로 가른다. contentVisibilityAuto 옵션을 줘야 한다: 옵션 없는 checkVisibility는
 * 그 구획을 강제로 풀어 계산한다. checkVisibility가 없는 브라우저는 예전처럼 모두 잰다.
 */
const measurable = (el: HTMLElement) =>
  typeof el.checkVisibility !== "function" ||
  el.checkVisibility({ contentVisibilityAuto: true });

/**
 * 잴 수 없는 요소 대신 위치를 볼 상자 — 렌더링을 건너뛰지 않은 가장 가까운 조상(건너뛴 구획이면 그 구획 자신,
 * display:none이면 보이는 부모)이다. 구획 상자는 내용 없이도 크기가 잡혀 있어 재도 내용 레이아웃이 강제되지 않는다.
 */
const renderedAncestor = (el: HTMLElement) => {
  let node = el.parentElement;
  while (node && !node.checkVisibility({ contentVisibilityAuto: true })) {
    node = node.parentElement;
  }
  return node;
};

const flush = () => {
  flushScheduled = false;
  const batch = Array.from(queue);
  queue.clear();
  if (batch.length === 0) return;

  if (!enabled || !observer) {
    batch.forEach((el) => {
      const entry = entries.get(el);
      if (entry) notify(entry, { animated: false, delay: 0 });
    });
    return;
  }

  const io = observer;
  const fresh = isFreshMount();
  const splashDone = document.documentElement.dataset.splashDone === "1";
  // CSS 안전장치가 이미 커튼을 걷었을 시간이면 다시 덮지 않는다.
  const curtainFailSafePassed =
    document.documentElement.dataset.splash !== "play" &&
    performance.now() / 1000 >= CURTAIN_FAILSAFE_S - 0.15;
  // 첫 로드만 잰다(새 마운트는 아무것도 읽지 않는다). 잴 수 있는지(스타일)를 먼저 보고 위치를 모아 읽어
  // 레이아웃 계산이 이 프레임에 한 번이다. 잴 수 없는 요소는 렌더된 조상 상자로 위·아래만 가린다(proxy).
  // 뷰포트 높이는 그 뒤에 읽어 추가 계산이 없다.
  const canMeasure = fresh ? null : batch.map(measurable);
  const boxes = canMeasure
    ? batch.map((el, index) => {
        if (canMeasure[index]) {
          return { rect: el.getBoundingClientRect(), proxy: false };
        }
        const host = renderedAncestor(el);
        return host ? { rect: host.getBoundingClientRect(), proxy: true } : null;
      })
    : null;
  const viewportHeight = boxes ? window.innerHeight : 0;
  const forReady: HTMLElement[] = [];

  batch.forEach((el, index) => {
    const entry = entries.get(el);
    if (!entry) return;

    const state = getState(el);
    if (state === "in" || state === "shown") {
      // StrictMode·ref 교체로 다시 등록된 요소 — 상태는 그대로 두고 알림만 준다.
      notify(entry, { animated: false, delay: 0 });
      return;
    }
    if (state === "pending") {
      if (!awaitingReady.includes(el)) io.observe(el);
      return;
    }

    const box = boxes?.[index];
    if (!box || (box.proxy && box.rect.top >= viewportHeight)) {
      // 새 마운트, 또는 뷰포트 아래의 건너뛴 구획 안 — 칠해지기 전에 가리고 판정선을 기다린다.
      setState(el, "pending");
      io.observe(el);
      return;
    }

    const { rect } = box;
    // 위로 지나간 구획 안·화면 안의 display:none(탭·접힌 패널)·이미 지나간 요소는 애니메이션 없이 둔다.
    // 0×0은 checkVisibility가 없는 브라우저의 display:none이다.
    if (box.proxy || (rect.width === 0 && rect.height === 0) || rect.bottom <= 0) {
      show(entry);
      return;
    }

    if (rect.top < viewportHeight) {
      const curtain = CURTAIN_VALUES.has(el.getAttribute(REVEAL_ATTR) ?? "");
      if (!curtain || !armedAtBoot) {
        // 덮여 있지 않았던 내용(커튼 아님·부트 스크립트가 못 돌았음)은 다시 가리지 않는다.
        show(entry);
      } else if (splashDone) {
        // CSS가 이미 커튼을 걷기 시작했다(또는 이번 프레임에 시작한다) — 같은 선언·같은 지연으로 이어받는다.
        adopt(entry);
      } else if (curtainFailSafePassed) {
        show(entry);
      } else {
        setState(el, "pending");
        forReady.push(el);
      }
      return;
    }

    setState(el, "pending");
    io.observe(el);
  });

  document.documentElement.setAttribute(MOTION_ATTR, MOTION_LIVE);

  if (forReady.length === 0) return;
  if (ready) play(forReady, CURTAIN_START_S);
  else awaitingReady.push(...forReady);
};

/**
 * 리빌 요소를 등록한다. 요소에는 SSR 단계부터 data-reveal(변형)이 있어야 한다.
 * 판정 시점: 클라이언트 내비게이션의 새 마운트는 마이크로태스크 한 번으로 모아 첫 페인트 전에,
 * 이미 칠해진 첫 로드는 다음 애니메이션 프레임에 한 번으로 모아 판정한다(hydration 커밋마다 레이아웃을 강제하지 않는다).
 * @returns 등록 해제 함수(언마운트 시 호출)
 */
export const registerReveal = (el: HTMLElement, options: RevealOptions = {}) => {
  if (typeof window === "undefined") return () => undefined;

  // 멱등. isFreshMount보다 먼저여야 한다 — boot가 첫 주소를 정하기 전에는 모든 첫 로드가 내비게이션으로 잡힌다.
  boot();

  entries.set(el, {
    el,
    delay: options.delay ?? 0,
    onReveal: options.onReveal,
    seen: false,
  });
  queue.add(el);

  if (!flushScheduled) {
    flushScheduled = true;
    // 커튼은 그동안 CSS가 돌리고 adopt가 그대로 이어받으므로, 첫 로드를 한 프레임 미뤄도 보이는 차이가 없다.
    if (isFreshMount()) queueMicrotask(flush);
    else requestAnimationFrame(flush);
  }

  return () => {
    entries.delete(el);
    queue.delete(el);
    observer?.unobserve(el);
    // 떠난 페이지의 DOM을 붙잡지 않는다(다음 배치는 연결 여부로도 걸러진다).
    if (chainTail === el) chainTail = null;
  };
};

/** 판정선을 기다리지 않고 지금 등장시킨다(탭을 연 직후 등). 이미 보인 요소는 무시한다. */
export const revealNow = (el: HTMLElement | null | undefined) => {
  if (!el || getState(el) !== "pending") return;
  observer?.unobserve(el);
  awaitingReady = awaitingReady.filter((waiting) => waiting !== el);
  play([el], 0, false);
};

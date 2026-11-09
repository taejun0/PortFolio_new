/**
 * 생성 이유: 리빌 컨트롤러·전역 CSS·부트 스크립트가 같은 속성 이름과 타이밍을 공유해야 한다.
 * 역할: 모션 시스템의 data 속성 계약, 변형(variant) 이름, 안전장치 타이밍, 판정 임계값(어절 수·이어 붙임·플링) 상수다.
 * 책임: 문자열 계약의 단일 출처만 소유한다. 실제 동작은 revealController, 시각은 motionGlobalStyles가 맡는다.
 *
 * 계약 요약
 * - html[data-motion]  없음 = 모션 꺼짐(JS 없음·동작 줄이기), "armed" = 부트 스크립트가 켬(커튼이 첫 페인트부터 덮음),
 *                      "live" = 컨트롤러가 넘겨받음(요소 상태가 가시성을 결정)
 * - html[data-splash-done="1"] 스플래시 소유(splashBoot)의 신호 — 붙는 순간 첫 화면 커튼이 걷히기 시작할 수 있다
 * - [data-reveal]      컴포넌트가 SSR로 그리는 변형 이름
 * - [data-reveal-state] 컨트롤러만 쓰는 상태 — "pending"(가림) → "in"(등장 애니메이션) | "shown"(애니메이션 없이 보임)
 * - --reveal-delay     최종 지연(초). 커튼은 SSR 인라인 값(CURTAIN_START_S + delay)으로 시작하고,
 *                      JS가 재생하는 리빌은 컨트롤러가 배치 순번 스태거 + delay로 덮어쓴다
 * - --reveal-duration  등장 길이(초) — Reveal·SweepText의 duration prop이 SSR 인라인으로 넣거나 CSS에서 직접 준다
 */
export const MOTION_ATTR = "data-motion";
export const MOTION_ARMED = "armed";
export const MOTION_LIVE = "live";

export const REVEAL_ATTR = "data-reveal";
export const REVEAL_STATE_ATTR = "data-reveal-state";

export type RevealState = "pending" | "in" | "shown";

/**
 * Reveal·useReveal이 받는 블록 변형
 * - group: 자신은 아무 시각도 없이 상태만 받는다 — staggerChildren·직접 쓴 CSS가
 *   `&[data-reveal-state="pending" | "in"]`로 자식을 움직일 때 쓴다.
 */
export type RevealVariant = "sweep" | "curtain" | "fade" | "stagger" | "group";

/** SweepText가 쓰는 글자 변형 — data-reveal 값은 TEXT_REVEAL_VALUE로 바뀐다 */
export type SweepTextVariant = "sweep" | "curtain";

export const TEXT_REVEAL_VALUE = {
  sweep: "text",
  curtain: "text-curtain",
} as const satisfies Record<SweepTextVariant, string>;

/**
 * sweep 변형이 어절마다 따로 쓸려 들어오는 최대 어절 수.
 * 이보다 긴 문장(프로젝트 요약·페이지 부제 등)은 같은 어절 마크업을 그대로 두고 호스트 하나가 블록 sweep으로 등장한다
 * — 어절마다 도는 애니메이션은 매 프레임 메인 스레드 스타일 재계산이라, 긴 문장 하나가 수십 개를 동시에 돌렸다.
 * 제목·라벨(이 수 이하)과 커튼 변형은 어절 캐스케이드를 유지한다.
 */
export const TEXT_SWEEP_MAX_WORDS = 6;

/** data-reveal에 실제로 들어가는 모든 값 */
export type RevealAttrValue =
  | RevealVariant
  | (typeof TEXT_REVEAL_VALUE)[SweepTextVariant];

/** 첫 페인트부터 덮였다가 걷히는(LCP 안전) 변형 */
export const CURTAIN_VALUES: ReadonlySet<string> = new Set([
  "curtain",
  TEXT_REVEAL_VALUE.curtain,
]);

/**
 * 커튼 색 — 요소 뒤 배경과 같아야 덮개가 보이지 않는다.
 * 섹션 배경과 같은 팔레트 CSS 변수(html[data-theme]를 따름)를 가리켜 첫 페인트·hydration 전후·테마 전환 뒤
 * 모두 섹션과 같은 색이다(motionGlobalStyles의 :root 커튼 변수).
 * 다른 배경(카드·CTA 등) 위라면 그 요소나 조상에 `--reveal-curtain: <색>`을 직접 준다.
 */
export const CURTAIN_TONES = {
  canvas: "var(--motion-canvas)",
  wash: "var(--motion-wash)",
  surface: "var(--motion-surface)",
} as const;

export type CurtainTone = keyof typeof CURTAIN_TONES;

/**
 * 커튼이 걷히기 시작하는 기본 지연(s).
 * html[data-splash-done="1"](스플래시 퇴장 시작, 재방문이면 첫 페인트 전)이 붙으면 CSS가 hydration을 기다리지 않고
 * 이 지연 뒤 커튼을 걷기 시작하고, 컨트롤러는 같은 값으로 그 애니메이션을 이어받는다(다시 시작하지 않는다).
 */
export const CURTAIN_START_S = 0.1;

/**
 * 스플래시 신호가 끝내 오지 않으면(스플래시 오류) CSS가 이 시간 뒤 등록 안 된 커튼을 스스로 걷는다.
 * 컨트롤러는 이 시간을 넘겨 부팅하면 첫 화면 커튼을 애니메이션 없이 바로 보인다(다시 덮지 않는다).
 */
export const CURTAIN_FAILSAFE_S = 3;

/** 스플래시 dismiss 신호를 못 받았을 때 대기 중인 첫 화면 커튼을 걷는 시점(ms) */
export const READY_FAILSAFE_MS = 3200;

/** 리빌 판정선 — 요소 윗변이 뷰포트 높이의 이 비율(아래 8% 선)을 넘으면 등장한다. */
export const REVEAL_LINE = 0.92;

/**
 * 판정선을 IntersectionObserver 루트 아래 경계로 만든 rootMargin("100000px 0px -8% 0px").
 * 위쪽 여백을 크게 줘서 빠른 스크롤·해시 점프로 판정선을 건너뛴 요소도 "교차"로 잡힌다
 * (뷰포트 위로 지나간 요소는 애니메이션 없이 바로 보인다).
 * IO 기록의 rootBounds.bottom이 곧 판정선 위치라, 컨트롤러는 뷰포트 높이를 읽지 않고도 판정선·뷰포트를 안다.
 */
export const REVEAL_ROOT_MARGIN = `100000px 0px -${Math.round((1 - REVEAL_LINE) * 100)}% 0px`;

/**
 * 연속 스크롤에서 앞 배치 뒤에 이어 붙는 대기(chainCarry)의 상한(s).
 * 캐스케이드 순서는 지키되, 빠르게 내려갈 때 아래 블록이 오래 비어 있지 않게 stagger.max보다 짧게 둔다.
 */
export const CHAIN_CARRY_MAX_S = 0.3;

/**
 * 플링 판정 속도(px/s) — 이보다 빠르게 훑는 중이면 판정선을 넘은 블록을 애니메이션 없이 바로 보인다
 * (쓸려 들어오는 동안 빈 섹션이 지나가지 않게). 속도는 스크롤 위치를 읽지 않고 잰다 —
 * 요소가 판정선을 넘어 들어온 거리(직전 프레임 스크롤 양의 하한) ÷ 스크롤 이벤트 사이 프레임 간격.
 */
export const FLING_SPEED_PX_S = 2500;

/** 플링으로 판정한 뒤 이 시간(ms) 동안 판정선을 넘는 블록도 바로 보인다 — 관성 스크롤 내내 같은 처리가 이어진다. */
export const FLING_HOLD_MS = 250;

/** 마지막 스크롤 이벤트가 이 시간(ms)보다 오래됐으면 멈춘 것으로 보고, 이보다 긴 이벤트 간격은 프레임 간격으로 쓰지 않는다. */
export const SCROLL_IDLE_MS = 100;

/**
 * 판정선을 넘은 것으로 처음 잡혔을 때 윗변이 이미 뷰포트 높이의 이 비율보다 위에 있으면(점프·큰 프레임 건너뜀)
 * 애니메이션 없이 바로 보인다. 관찰을 시작한 순간 이미 화면 안이던 요소(내비게이션 직후 첫 화면)는 해당하지 않는다.
 */
export const FLING_SHOW_LINE = 0.7;

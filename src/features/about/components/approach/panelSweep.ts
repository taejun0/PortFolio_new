/**
 * 생성 이유: Approach 탭 본문을 흐린 크로스페이드 없이 가로 스윕으로 바꿔 끼운다.
 * 역할: 나가는 패널을 왼쪽부터 지워 오른쪽으로 밀어내고, 들어오는 패널의 문단을 왼쪽부터 차례로 쓸어 넣는 WAAPI 헬퍼다.
 * 책임: 전환 애니메이션의 시작·중단만 맡는다. 어느 패널이 보이는지(visibility)는 ApproachSection 상태가 정한다.
 *
 * - 투명도는 건드리지 않는다. 지우는 선이 먼저 지나가고 쓰는 선이 뒤따라, 두 글이 겹쳐 보이는 순간이 없다.
 * - 들어오는 문단은 첫 등장(staggerChildren)과 같은 길이·간격·거리라 처음 볼 때와 바꿀 때가 같은 문법이다.
 * - 빠르게 연달아 바꾸면 진행 중인 것을 그 자리에서 이어받는다(나가던 패널로 돌아오면 비운 뒤 다시 쓴다).
 * - 동작 줄이기·모션 꺼짐(html[data-motion] 없음)이면 아무것도 하지 않는다 — 본문이 즉시 바뀐다.
 */
import { motionTokens } from "@/styles/theme";

const { duration, stagger, distance, curve } = motionTokens;

const EXIT_ID = "approach-panel-exit";
const ENTER_ID = "approach-panel-enter";

/** 나가는 패널이 지워지는 동안 오른쪽으로 밀리는 거리 — 들어오는 거리의 절반 */
const EXIT_DRIFT = `calc(${distance.sweep} / 2)`;

/**
 * 지우는 선을 패널 오른쪽 밖까지 보낸다 — ease.out 꼬리에서 마지막 글자 조각이 오래 남지 않고
 * 0.1s 안에 다 지워진다(100%를 넘는 inset은 빈 영역이다).
 */
const EXIT_CLIP_END = "inset(0 0 0 115%)";

/** 지우는 선이 앞서 가도록 첫 문단이 기다리는 시간(s) — 이때 나가는 글은 이미 다 지워져 있다 */
const ENTER_LAG = 0.1;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const canSweepPanels = () =>
  document.documentElement.hasAttribute("data-motion") &&
  !window.matchMedia(REDUCED_MOTION_QUERY).matches;

const cancel = (el: Element, id: string) => {
  el.getAnimations().forEach((animation) => {
    if (animation.id === id) animation.cancel();
  });
};

const exitPanel = (panel: HTMLElement) => {
  // 숨김(visibility) 상태로 바뀐 패널을 지워지는 동안만 보이게 붙잡는다.
  const exit = panel.animate(
    [
      { visibility: "visible", clipPath: "inset(0 0 0 0)", transform: "none" },
      {
        visibility: "visible",
        clipPath: EXIT_CLIP_END,
        transform: `translateX(${EXIT_DRIFT})`,
      },
    ],
    { id: EXIT_ID, duration: duration.hover * 1000, easing: curve.out }
  );
  // 다 지워지면 아직 쓰이던 문단 애니메이션도 거둔다(보이지 않는 상태로 정리).
  exit.addEventListener("finish", () => {
    Array.from(panel.children).forEach((child) => cancel(child, ENTER_ID));
  });
};

const enterPanel = (panel: HTMLElement) => {
  cancel(panel, EXIT_ID);
  Array.from(panel.children).forEach((child, index) => {
    cancel(child, ENTER_ID);
    child.animate(
      [
        {
          clipPath: "inset(0 100% 0 0)",
          transform: `translateX(calc(${distance.sweep} * -1))`,
        },
        { clipPath: "inset(0 0 0 0)", transform: "none" },
      ],
      {
        id: ENTER_ID,
        duration: duration.reveal * 1000,
        delay:
          (ENTER_LAG + Math.min(index * stagger.item, stagger.max)) * 1000,
        easing: curve.out,
        fill: "backwards",
      }
    );
  });
};

/** 탭이 바뀐 커밋 직후(페인트 전)에 부른다 — 첫 프레임부터 나가는 글·비운 칸이 맞게 그려진다. */
export const sweepPanels = (
  outgoing: HTMLElement | null | undefined,
  incoming: HTMLElement | null | undefined
) => {
  if (incoming) enterPanel(incoming);
  if (outgoing && outgoing !== incoming) exitPanel(outgoing);
};

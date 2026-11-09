/**
 * 생성 이유: 리빌 가림·등장 애니메이션을 data 속성 하나로 어떤 요소에든 붙일 수 있게 한다.
 * 역할: 모션 CSS 변수, 공용 키프레임, data-reveal·data-reveal-state 규칙을 담은 전역 스타일이다.
 * 책임: 가림과 등장 시각만 소유한다(GlobalStyle이 SSR로 주입). 상태 전환은 revealController가 한다.
 *
 * 견고성
 * - 가림·애니메이션 규칙은 모두 `screen + prefers-reduced-motion: no-preference` 안에 있다
 *   → 인쇄·동작 줄이기에서는 상태와 상관없이 전부 보인다.
 * - 상태 규칙은 html[data-motion]이 있을 때만 켜진다 → JS가 없으면 아무것도 가리지 않는다.
 * - 커튼은 부트 스크립트(armed)가 켜면 첫 페인트부터 덮고, html[data-splash-done]이 붙는 순간 CSS만으로
 *   걷히기 시작한다(hydration을 기다리지 않음 — 느린 기기에서도 제목이 비어 있는 시간이 짧다).
 *   스플래시 신호가 끝내 없으면 CURTAIN_FAILSAFE_S 뒤 스스로 걷힌다.
 * - 구조 규칙(어절 inline-block, 커튼 호스트 relative)은 항상 같아 JS 유무로 레이아웃이 바뀌지 않는다(CLS 0).
 *   어절은 max-width: 100%·overflow-wrap: anywhere라 단으로 다 못 들어가는 긴 토큰(예: "WebSocket·Redis·Pub/Sub")만
 *   자기 박스 안에서 꺾이고, 폰 폭에서 문서를 넓히지 않는다(min-content로 잡히는 그리드 트랙 안에서도). 단에 들어가는
 *   어절의 줄바꿈은 그대로다.
 * - 길이: 스크롤 리빌(블록·어절)은 --motion-reveal·--motion-text(0.7s), 첫 화면 커튼은 스플래시 퇴장과 맞춘
 *   --motion-curtain·--motion-text-curtain을 쓴다. 커튼의 등록 전 규칙과 "in" 규칙은 같은 변수를 써야
 *   컨트롤러가 이어받을 때 애니메이션이 다시 시작되지 않는다.
 * - 전부 정적 CSS다(테마 함수 없음). 커튼 색도 팔레트 CSS 변수라 html[data-theme]를 따른다.
 */
import { css } from "@emotion/react";

import { motionTokens, theme } from "@/styles/theme";

import { CURTAIN_FAILSAFE_S, CURTAIN_START_S } from "./constants";
import { buildStaggerCss } from "./motionCss";

const { duration, distance, curve } = motionTokens;
const { colors } = theme;

const LIVE = 'html[data-motion="live"]';
const ANY = "html[data-motion]";

const delay = "var(--reveal-delay, 0s)";
const wordDelay = "calc(var(--reveal-delay, 0s) + var(--word-delay, 0s))";
/* 커튼은 SSR 인라인 --reveal-delay가 없을 때(useReveal로 붙인 요소)도 CSS 시작 지연을 쓴다 */
const curtainDelay = `var(--reveal-delay, ${CURTAIN_START_S}s)`;
const curtainWordDelay = `calc(var(--reveal-delay, ${CURTAIN_START_S}s) + var(--word-delay, 0s))`;
const blockLength = "var(--reveal-duration, var(--motion-reveal))";
const textLength = "var(--reveal-duration, var(--motion-text))";
/* 첫 화면 커튼 — 등록 전(CSS만으로 걷힘)·"in"(컨트롤러) 규칙이 같은 값을 써야 이어받기가 맞는다 */
const curtainLength = "var(--reveal-duration, var(--motion-curtain))";
const curtainTextLength = "var(--reveal-duration, var(--motion-text-curtain))";

export const motionGlobalStyles = css`
  :root {
    --motion-ease: ${curve.out};
    --motion-hover: ${duration.hover}s;
    --motion-reveal: ${duration.reveal}s;
    --motion-text: ${duration.text}s;
    --motion-curtain: ${duration.curtain}s;
    --motion-text-curtain: ${duration.curtainText}s;
    --motion-sweep-x: calc(${distance.sweep} * -1);
    --motion-word-x: calc(${distance.word} * -1);
    /* 커튼 색 — 섹션이 칠하는 팔레트 변수와 같은 출처라 첫 페인트·토글 뒤 모두 섹션과 같은 색이다 */
    --motion-canvas: ${colors.background};
    --motion-wash: ${colors.wash};
    --motion-surface: ${colors.surface};
  }

  /* 블록: 왼쪽에서 열리는 마스크 + 짧은 가로 미끄러짐 */
  @keyframes motion-sweep {
    from {
      clip-path: inset(0 100% 0 0);
      transform: translateX(var(--motion-sweep-x));
    }
    to {
      clip-path: inset(0 0 0 0);
      transform: none;
    }
  }

  /*
   * 어절: 위아래 여유를 둔 마스크라 어센더·디센더가 잘리지 않는다.
   * 마스크 끝을 어절 오른쪽 밖(1em)까지 보내 ease.out 꼬리에서 마지막 글자가 늦게 남지 않게 한다
   * — 글자는 일찍 다 보이고 미끄러짐만 천천히 가라앉는다.
   */
  @keyframes motion-word {
    from {
      clip-path: inset(-0.3em 100% -0.3em 0);
      transform: translateX(var(--motion-word-x));
    }
    to {
      clip-path: inset(-0.3em -1em -0.3em 0);
      transform: none;
    }
  }

  @keyframes motion-drift {
    from {
      transform: translateX(var(--motion-word-x));
    }
    to {
      transform: none;
    }
  }

  @keyframes motion-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* 커튼(블록): 오른쪽 끝으로 접히며 왼쪽부터 내용을 드러낸다 — 큰 면적이라 transform으로 합성한다 */
  @keyframes motion-curtain {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }

  /*
   * 커튼(어절): 덮개 왼쪽 가장자리가 어절 오른쪽 밖(1em)까지 지나간다 — 마지막 글자가 늦게 남지 않는다.
   * 왼쪽 inset이 폭을 넘으면 빈 영역이 된다.
   */
  @keyframes motion-uncover {
    from {
      clip-path: inset(0 0 0 0);
    }
    to {
      clip-path: inset(0 0 0 calc(100% + 1em));
    }
  }

  /*
   * 단보다 긴 어절만 자기 박스 안에서 꺾인다. anywhere는 최소 폭(min-content) 기여도 줄여, 어절이 그리드·플렉스
   * 트랙을 화면 밖으로 밀지 않는다(프로젝트 상세 히어로처럼 트랙이 min-content로 잡히는 곳). 단에 들어가는 어절은
   * 꺾이지 않아 줄바꿈은 그대로다.
   */
  [data-sweep-word] {
    display: inline-block;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  [data-reveal="curtain"],
  [data-reveal="text-curtain"] [data-sweep-word] {
    position: relative;
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    /*
     * ── sweep ──
     * 대기 중에는 clip-path·transform이 아니라 투명도로 가린다. 크롬의 IntersectionObserver는 대상 자신의
     * clip-path·transform을 판정에 넣어서, 폭 0으로 잘리고 왼쪽으로 밀린 전폭 요소(x≈0)는 끝내 교차로
     * 잡히지 않는다. 등장 순간에는 키프레임 from(잘림)이 지연 동안 채워져 보이는 변화 없이 이어진다.
     */
    ${LIVE} [data-reveal="sweep"][data-reveal-state="pending"] {
      opacity: 0;
    }

    ${LIVE} [data-reveal="sweep"][data-reveal-state="in"] {
      animation: motion-sweep ${blockLength} var(--motion-ease) ${delay}
        backwards;
    }

    /* ── fade ── */
    ${LIVE} [data-reveal="fade"][data-reveal-state="pending"] {
      opacity: 0;
    }

    ${LIVE} [data-reveal="fade"][data-reveal-state="in"] {
      animation: motion-fade ${blockLength} var(--motion-ease) ${delay}
        backwards;
    }

    /* ── stagger: 직접 자식이 차례로 sweep ── */
    ${buildStaggerCss(`${LIVE} [data-reveal="stagger"]`)}

    /* ── text: 어절마다 마스크가 열리며 읽는 순서대로 쓸려 들어온다 ── */
    ${LIVE} [data-reveal="text"][data-reveal-state="pending"] [data-sweep-word] {
      clip-path: inset(-0.3em 100% -0.3em 0);
      transform: translateX(var(--motion-word-x));
    }

    ${LIVE} [data-reveal="text"][data-reveal-state="in"] [data-sweep-word] {
      animation: motion-word ${textLength} var(--motion-ease) ${wordDelay}
        backwards;
    }

    /*
     * ── curtain(블록): 캔버스색 덮개 — 내용은 첫 페인트부터 아래에 칠해져 있다(LCP 안전) ──
     * 덮개 수명: armed(부트)부터 덮음 → data-splash-done이 붙으면 CSS가 바로 걷기 시작(등록 전)
     * → 컨트롤러가 같은 선언("in")으로 이어받음. 같은 선언·같은 변수라 애니메이션이 다시 시작되지 않는다.
     * 스플래시 신호가 끝내 없으면 등록 안 된 덮개는 CURTAIN_FAILSAFE_S 뒤 스스로 걷힌다.
     */
    ${ANY} [data-reveal="curtain"]:not([data-reveal-state="shown"])::after {
      content: "";
      position: absolute;
      inset: -1px;
      z-index: 1;
      background: var(--reveal-curtain, var(--motion-canvas));
      transform-origin: right center;
      pointer-events: none;
    }

    ${ANY}:not([data-splash-done="1"])
      [data-reveal="curtain"]:not([data-reveal-state])::after {
      animation: motion-curtain ${curtainLength} var(--motion-ease)
        ${CURTAIN_FAILSAFE_S}s both;
    }

    ${ANY}[data-splash-done="1"] [data-reveal="curtain"]:not([data-reveal-state])::after,
    ${LIVE} [data-reveal="curtain"][data-reveal-state="in"]::after {
      animation: motion-curtain ${curtainLength} var(--motion-ease)
        ${curtainDelay} both;
    }

    /* ── text-curtain: 어절마다 덮개가 걷히고 글자는 살짝 따라 미끄러진다(수명은 블록 커튼과 같다) ── */
    ${ANY}
      [data-reveal="text-curtain"]:not([data-reveal-state="shown"])
      [data-sweep-word]::after {
      content: "";
      position: absolute;
      inset: -0.16em -0.06em;
      z-index: 1;
      background: var(--reveal-curtain, var(--motion-canvas));
      pointer-events: none;
    }

    ${ANY}:not([data-splash-done="1"])
      [data-reveal="text-curtain"]:not([data-reveal-state])
      [data-sweep-word]::after {
      animation: motion-uncover ${curtainTextLength} var(--motion-ease)
        calc(${CURTAIN_FAILSAFE_S}s + var(--word-delay, 0s)) both;
    }

    ${ANY}[data-splash-done="1"]
      [data-reveal="text-curtain"]:not([data-reveal-state])
      [data-sweep-word],
    ${LIVE} [data-reveal="text-curtain"][data-reveal-state="in"] [data-sweep-word] {
      animation: motion-drift ${curtainTextLength} var(--motion-ease)
        ${curtainWordDelay} backwards;
    }

    ${ANY}[data-splash-done="1"]
      [data-reveal="text-curtain"]:not([data-reveal-state])
      [data-sweep-word]::after,
    ${LIVE} [data-reveal="text-curtain"][data-reveal-state="in"] [data-sweep-word]::after {
      animation: motion-uncover ${curtainTextLength} var(--motion-ease)
        ${curtainWordDelay} both;
    }
  }
`;

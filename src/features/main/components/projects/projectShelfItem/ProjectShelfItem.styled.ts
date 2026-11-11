/**
 * 생성 이유: Process식 아코디언 책장 패널 스타일을 분리한다.
 * 역할: ProjectShelfItem 접힘(책등·모바일 행)/펼침(미디어 패널) 시각과 전환 모션을 정의한다.
 * 책임: 보이는 창(clip-path)·책등 라벨·표지 베일·하단 스크림·사진 위 카피 대비·전환 타이밍만 소유한다.
 *       칸의 박스는 상태와 무관하게 고정하고 보이는 창만 clip-path로 열고 닫는다 — 호버로 이웃 칸이
 *       밀려나는 레이아웃 이동(CLS)도, 프레임마다의 레이아웃 계산도 없다. 사진·카피는 박스에 고정돼
 *       창이 그 위로 열리고 닫힌다. 데스크톱은 가로(책등), 모바일은 세로(행)로 같은 규칙을 쓴다.
 *       상태는 Item의 data-edge·data-animate로만 바꾼다 — 모든 규칙이 SSR에 미리 들어 있어
 *       호버 순간 새 클래스를 만들지 않는다. 칸 위치도 인라인 --shelf-index로 받아 세 칸이 한 클래스를 쓴다.
 *       사진 위 요소는 테마와 무관하게 다크 팔레트로 4.5:1 이상을 지킨다.
 */
import { css, keyframes, type Theme } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import { motionTransition } from "@/components/common/motion";
import { LIGHT_MODE, motionTokens, palettes } from "@/styles/theme";

/** 칸 상태 — 펼친 칸 앞(before)·펼친 칸(open)·펼친 칸 뒤(after). Item의 data-edge 값이다. */
export type ShelfEdge = "before" | "open" | "after";

/* 상태 선택자 — Item(li)에 붙는다. data-animate는 펼침 상태가 한 번이라도 바뀐 칸에만 있다. */
const OPEN = '[data-edge="open"]';
const CLOSED = '[data-edge]:not([data-edge="open"])';
const OPEN_ANIMATED = '[data-edge="open"][data-animate]';
const CLOSED_ANIMATED = '[data-animate]:not([data-edge="open"])';

/** 사진 위 팔레트 — 라이트 모드에서도 흰 글자·검정 스크림으로 고정한다(CSS 변수가 아닌 리터럴 다크 팔레트). */
const onMedia = palettes.dark;

/** 사진 위 검정 잉크 (알파 %) */
const ink = (alpha: number) =>
  `color-mix(in srgb, ${onMedia.background} ${alpha}%, transparent)`;

/*
 * 하단 스크림 — 카피 뒤에는 대비를 남기고 위로 갈수록 부드럽게 걷어
 * 이미지가 넓게 보이도록 한다. 불투명한 캡션 밴드 없이 하단 52% 안에서만 깔린다.
 */
const SCRIM = `linear-gradient(
  to top,
  ${ink(84)} 0%,
  ${ink(72)} 14%,
  ${ink(52)} 26%,
  ${ink(28)} 36%,
  ${ink(10)} 44%,
  transparent 52%
)`;

/** 모바일 접힌 행 썸네일 */
const THUMB_SIZE = "2.75rem";
const THUMB_INSET = "0.5rem";

const { duration, curve, stagger, distance } = motionTokens;

/** 창이 열리고 닫히는 길이 */
const OPEN_S = duration.hero;
/**
 * 카피가 쓸려 들어오기 시작하는 시점 — 창이 90% 가까이 열린 뒤다.
 * 끝 쪽에서 열리는 칸은 카피가 있는 시작 쪽이 마지막에 드러나서, 그보다 일찍 시작하면 창에 가린다.
 */
const COPY_DELAY_S = 0.24;
/** 접힌 책등 라벨이 다시 들어오는 시점 — 창이 절반쯤 닫힌 뒤 */
const SPINE_DELAY_S = 0.12;
/** 펼칠 때 사진이 옆으로 흘러 자리 잡는 거리(scale 1.03이 남기는 여백 1.5% 안) */
const PAN = "1.4%";

/** 포커스 링 층이 칸 박스 밖으로 넓힌 거리 — 배경은 자기 박스 안에만 칠해져 링 두께만큼 박스를 키운다 */
const RING_BLEED = "5px";

/**
 * 칸의 보이는 창 — 박스에서 접힌 쪽(--cut-start·--cut-end)을 잘라 낸 둥근 사각형.
 * grow만큼 바깥으로(음수면 안쪽으로) 키워 테두리·포커스 링 층도 같은 창에서 만든다.
 * bleed는 그 층 자신의 박스가 칸 박스보다 넓은 거리다(inset 기준점 보정).
 * x는 가로 책장(데스크톱), y는 세로 책장(모바일)이다.
 */
const windowShape = (axis: "x" | "y", grow: string, bleed: string) => {
  const side = `calc(${bleed} - ${grow})`;
  const start = `calc(var(--cut-start) + ${bleed} - ${grow})`;
  const end = `calc(var(--cut-end) + ${bleed} - ${grow})`;
  const round = `round calc(var(--shelf-radius) + ${grow})`;

  return axis === "x"
    ? `inset(${side} ${end} ${side} ${start} ${round})`
    : `inset(${start} ${side} ${end} ${side} ${round})`;
};

const windowClip = (theme: Theme, grow = "0px", bleed = "0px") => css`
  clip-path: ${windowShape("y", grow, bleed)};
  transition: ${motionTransition("clip-path", OPEN_S)};

  @media (min-width: ${theme.breakpoints.tablet}) {
    clip-path: ${windowShape("x", grow, bleed)};
  }
`;

/** 펼친 패널 카피 — 왼쪽에서 열리는 마스크와 짧은 가로 미끄러짐(사이트 공통 스윕 문법) */
const copyIn = keyframes`
  from {
    clip-path: inset(-0.2em 100% -0.2em 0);
    transform: translateX(calc(${distance.sweep} * -1));
  }
  to {
    clip-path: inset(-0.2em 0 -0.2em 0);
    transform: none;
  }
`;

/** 모바일 행 라벨 — 같은 스윕을 글자 크기에 맞춰 짧게 */
const rowLabelIn = keyframes`
  from {
    clip-path: inset(0 100% 0 0);
    transform: translateX(calc(${distance.word} * -1));
  }
  to {
    clip-path: inset(0);
    transform: none;
  }
`;

/*
 * 책등 라벨 — 180° 돌린 세로 글자라 읽는 방향(아래→위)으로 쓸려 들어온다.
 * 로컬 위쪽이 글자 시작이고 회전 뒤 화면 아래가 된다: 아래 inset을 거두면 화면 아래부터 드러나고,
 * 로컬 위로 당겨 둔 위치(회전 뒤 화면 아래)에서 제자리로 올라온다.
 */
const spineLabelIn = keyframes`
  from {
    clip-path: inset(0 0 100% 0);
    transform: rotate(180deg) translateY(-0.5rem);
  }
  to {
    clip-path: inset(0);
    transform: rotate(180deg);
  }
`;

/**
 * 칸 i의 고정 위치 — i × (책등 두께 + 간격). i는 컴포넌트가 인라인 --shelf-index로 넘긴다
 * (값을 보간하면 칸마다 거의 같은 큰 클래스가 하나씩 생긴다).
 */
const SHELF_OFFSET =
  "calc(var(--shelf-index, 0) * (var(--shelf-spine) + var(--shelf-gap)))";

export const Item = styled.li`
  /* 접힌 쪽 길이 — 앞 칸은 끝을, 뒤 칸은 시작을 잘라 책등 두께만 남긴다 */
  --cut-start: 0px;
  --cut-end: 0px;
  /* 책등(행) 위치 — 뒤 칸은 박스 끝쪽에 붙는다. 창 가장자리와 같은 곡선으로 움직인다 */
  --spine-shift: 0px;

  position: absolute;
  top: ${SHELF_OFFSET};
  right: 0;
  left: 0;
  height: var(--shelf-panel);
  isolation: isolate;
  pointer-events: none;

  &[data-edge="before"] {
    --cut-end: var(--shelf-cut);
  }

  &[data-edge="after"] {
    --cut-start: var(--shelf-cut);
    --spine-shift: var(--shelf-cut);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    top: 0;
    right: auto;
    bottom: 0;
    left: ${SHELF_OFFSET};
    width: var(--shelf-panel);
    height: auto;
  }

  /*
   * 키보드 포커스 링 — 링크는 창으로 잘려 outline이 보이지 않는다.
   * 창보다 5px 큰 액센트 층 위에 3px 큰 캔버스 층을 얹어 2px 링(간격 3px)을 같은 창 모양으로 그린다.
   */
  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: calc(${RING_BLEED} * -1);
    z-index: 0;
    opacity: 0;
    pointer-events: none;
  }

  &::before {
    background: ${({ theme }) => theme.colors.accent};
    ${({ theme }) => windowClip(theme, "5px", RING_BLEED)}
  }

  &::after {
    background: ${({ theme }) => theme.colors.background};
    ${({ theme }) => windowClip(theme, "3px", RING_BLEED)}
  }

  &:has(> a:focus-visible)::before,
  &:has(> a:focus-visible)::after {
    opacity: 1;
  }

  @media (forced-colors: active) {
    &::before {
      forced-color-adjust: none;
      background: Highlight;
    }

    &::after {
      forced-color-adjust: none;
      background: Canvas;
    }
  }

  /*
   * 동작 줄이기 — 전역 규칙이 모든 요소에 0.01ms 트랜지션(속성 all)을 걸어 상속되는 visibility가
   * 몇 프레임 늦게 바뀐다. 칸 안은 트랜지션 없이 그 자리에서 바로 바꾼다(색 변화도 즉시).
   */
  @media (prefers-reduced-motion: reduce) {
    &::before,
    &::after,
    & * {
      transition-property: none;
    }
  }
`;

/** 접힘/펼침 내내 유지되는 상세 링크 — 포커스가 상태 전환에 끊기지 않는다. 배경이 2px 테두리가 된다. */
export const Card = styled(Link)`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text} 22%,
    ${({ theme }) => theme.colors.surfaceAlt}
  );
  color: inherit;
  text-decoration: none;
  outline: none;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  ${({ theme }) => windowClip(theme)}
  ${hoverArrowParent}
`;

/** 테두리 2px 안쪽 창 — 사진·카피·책등이 이 창 안에서 보인다. */
export const Window = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  ${({ theme }) => windowClip(theme, `-${theme.layout.borderWidth.card}`)}
`;

export const Media = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: ${onMedia.surfaceAlt};

  /*
   * 모바일 접힌 행 — 불투명한 행이 다 덮은 뒤 큰 표지를 숨긴다. 행과 표지가 같은 창 가장자리에서
   * 함께 안티앨리어싱되면 표지 색이 1px 테두리처럼 비친다(밝은 모드에서 보인다).
   */
  ${CLOSED} & {
    opacity: 0;
    transition: opacity 0s linear ${SPINE_DELAY_S + duration.hover}s;
  }

  img {
    object-fit: cover;
    transition:
      ${motionTransition("transform", "title")},
      ${motionTransition("filter", OPEN_S)};
  }

  /* 접힌 칸은 열릴 쪽 반대편으로 살짝 밀고 키워 두었다가, 펼치면 열리는 방향으로 흘러 자리 잡는다 */
  [data-edge="before"] & img {
    transform: translateX(-${PAN}) scale(1.03);
  }

  [data-edge="after"] & img {
    transform: translateX(${PAN}) scale(1.03);
  }

  @media (hover: hover) {
    ${OPEN} ${Card}:hover & img {
      transform: scale(1.03);
    }
  }

  ${OPEN} ${Card}:focus-visible & img {
    transform: scale(1.03);
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }

  /* 베일 — 접힌 책등 표지를 눌러 두었다가 펼치면 걷는다(데스크톱) */
  &::before {
    background: ${ink(58)};
    opacity: 0;
  }

  /* 하단 스크림 — 사진 위 카피·번호 pill 대비 */
  &::after {
    background: ${SCRIM};
  }

  /*
   * 데스크톱 책등 — 채도를 뺀 표지 + 흐린 베일. 스크린샷 속 글자가 라벨과 겹쳐 읽히지 않게
   * 베일이 뒤를 흐린다(backdrop은 가장자리가 비치지 않는다). 펼치면 베일이 걷히며 초점·색이 돌아오고,
   * 다 걷힌 뒤에 blur 레이어를 내려 펼친 패널에는 필터 비용이 남지 않는다.
   */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${CLOSED} & {
      opacity: 1;
      transition: none;
    }

    /* Safari(18 미만)는 접두사 속성만 읽는다 — 자동 접두사 없이 직접 쓴다 */
    ${CLOSED} &::before {
      opacity: 1;
      -webkit-backdrop-filter: blur(6px);
      backdrop-filter: blur(6px);
      transition: ${motionTransition("opacity", OPEN_S)};
    }

    ${CLOSED} & img {
      filter: grayscale(0.6) brightness(0.92);
    }

    ${OPEN} &::before {
      transition:
        ${motionTransition("opacity", OPEN_S)},
        -webkit-backdrop-filter 0s linear ${OPEN_S}s,
        backdrop-filter 0s linear ${OPEN_S}s;
    }
  }
`;

/** 사진 위 번호 pill */
const onMediaPill = css`
  color: ${onMedia.text};
  background: ${ink(40)};
`;

export const IndexPill = styled.span<{ $onMedia?: boolean }>`
  /* 면 — 라이트는 서피스, 다크는 캔버스 반투명. 사진 위(onMediaPill)는 background를 직접 덮어 모드와 무관하다 */
  --pill-face: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.background} 55%,
    transparent
  );

  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 2.35rem;
  height: 2.1rem;
  padding: 0 0.55rem;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 0;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.text};
  background: var(--pill-face);

  ${LIGHT_MODE} & {
    --pill-face: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.surface} 82%,
      transparent
    );
  }

  ${({ $onMedia }) => $onMedia && onMediaPill}

  /* 데스크톱은 접힌 책등도 사진 위다 */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    ${onMediaPill}
  }
`;

/**
 * 펼친 칸 카피 — 박스에 고정돼 창이 열리며 드러난다. 펼칠 때는 제목→요약→버튼 순으로 쓸려 들어온다.
 * 접을 때는 창보다 먼저 빠르게 걷힌다 — 남는 띠가 카피 쪽(앞 칸은 번호·제목, 뒤 칸은 버튼)이라
 * 닫히는 창에만 맡기면 책등 라벨 옆에 카피 조각이 남는다.
 */
export const PanelCopy = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-areas:
    "index title cta"
    "summary summary summary";
  align-items: center;
  gap: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  padding: ${({ theme }) => theme.space[4]};
  color: ${onMedia.text};
  opacity: 0;
  visibility: hidden;
  transition:
    opacity ${duration.micro}s ${curve.out},
    visibility 0s linear ${duration.micro}s;

  ${OPEN} & {
    opacity: 1;
    visibility: visible;
    transition: none;
  }

  /* 동작 줄이기에서는 애니메이션을 걸지 않아 지연 없이 바로 보인다 */
  @media screen and (prefers-reduced-motion: no-preference) {
    ${OPEN_ANIMATED} & > * {
      animation: ${copyIn} ${duration.reveal}s ${curve.out} ${COPY_DELAY_S}s
        backwards;
    }

    ${OPEN_ANIMATED} & > :nth-child(3) {
      animation-delay: ${COPY_DELAY_S + stagger.item}s;
    }

    ${OPEN_ANIMATED} & > :nth-child(4) {
      animation-delay: ${COPY_DELAY_S + stagger.item * 2}s;
    }
  }

  ${IndexPill} {
    grid-area: index;
  }

  /* 번호 pill은 제목 줄에 맞추고, 요약은 제목 아래에 건다 */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-areas:
      "index title cta"
      ". summary cta";
    column-gap: ${({ theme }) => theme.space[4]};
    padding: ${({ theme }) => theme.space[5]};
  }
`;

export const PanelTitle = styled.h3`
  grid-area: title;
  min-width: 0;
  font-size: clamp(1.25rem, 0.95rem + 0.9vw, 1.85rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: ${onMedia.text};
`;

export const PanelSummary = styled.p`
  grid-area: summary;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 46ch;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: ${({ theme }) => theme.typography.bodySm.lineHeight};
  color: color-mix(in srgb, ${onMedia.text} 86%, transparent);
`;

/** CTA 활성 채움 — 마우스 호버와 키보드 포커스에서만 (터치의 끈적한 :hover 제외) */
const ctaActive = (theme: Theme) => css`
  border-color: ${theme.colors.accent};
  background: ${theme.colors.accent};
  color: ${theme.colors.accentContrast};
`;

/** 패널이 상세 링크임을 알리는 pill — 카드 호버·포커스 시 액센트로 채운다. */
export const DetailCta = styled.span`
  grid-area: cta;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, ${onMedia.text} 30%, transparent);
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: ${onMedia.text};
  transition: ${motionTransition(["background", "border-color", "color"])};

  @media (hover: hover) {
    ${Card}:hover & {
      ${({ theme }) => ctaActive(theme)}
    }
  }

  ${Card}:focus-visible & {
    ${({ theme }) => ctaActive(theme)}
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-self: end;
  }
`;

/**
 * 접힌 칸의 책등(데스크톱 세로 띠)·행(모바일 가로 띠).
 * 창의 남은 띠에 붙어 있다가 칸이 앞↔뒤로 바뀌면 창 가장자리와 함께 미끄러진다.
 * 펼치면 라벨이 읽는 방향으로 빠지며 사라지고, 다시 접히면 읽는 방향으로 쓸려 들어온다.
 * 모바일 행은 불투명해서 뒤의 큰 표지를 가리고 썸네일·제목·번호만 보인다.
 */
export const Spine = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  height: var(--shelf-spine);
  padding: ${({ theme }) =>
    `${theme.space[2]} ${theme.space[4]} ${theme.space[2]} ${THUMB_INSET}`};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  transform: translateY(var(--spine-shift));
  transition:
    ${motionTransition("transform", OPEN_S)},
    opacity ${duration.hover}s ${curve.out} ${SPINE_DELAY_S}s,
    visibility 0s linear 0s;

  ${OPEN} & {
    opacity: 0;
    visibility: hidden;
    transition:
      ${motionTransition("transform", OPEN_S)},
      ${motionTransition("opacity", "ui")},
      visibility 0s linear ${duration.ui}s;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    right: auto;
    bottom: 0;
    flex-direction: column;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.space[4]};
    width: var(--shelf-spine);
    height: auto;
    padding: ${({ theme }) => `${theme.space[5]} ${theme.space[2]}`};
    background: none;
    transform: translateX(var(--spine-shift));
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/** 모바일 행 썸네일 — 데스크톱 책등은 뒤의 표지를 그대로 쓴다 */
export const Thumb = styled.span`
  position: relative;
  flex-shrink: 0;
  width: ${THUMB_SIZE};
  height: ${THUMB_SIZE};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  background: ${onMedia.surfaceAlt};

  img {
    object-fit: cover;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const SpineTitle = styled.h3`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
  transition: ${motionTransition("transform")};

  /* 펼칠 때 읽는 방향으로 빠진다 */
  ${OPEN} & {
    transform: translateX(0.5rem);
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    ${CLOSED_ANIMATED} & {
      animation: ${rowLabelIn} ${duration.reveal}s ${curve.out}
        ${SPINE_DELAY_S}s backwards;
    }
  }

  /*
   * 책등 라벨 — upright로 음절을 쌓지 않고 한 줄을 통째로 눕힌다(sideways).
   * rotate(180deg)로 아래→위로 읽혀 하단 번호 pill에서 시작한다.
   * sideways에서는 한글 글리프가 뒤집히지 않는다.
   */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 0 1 auto;
    min-height: 0;
    max-height: 100%;
    writing-mode: vertical-rl;
    text-orientation: sideways;
    transform: rotate(180deg);
    font-size: ${({ theme }) => theme.typography.heading.fontSize};
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    letter-spacing: ${({ theme }) => theme.typography.heading.letterSpacing};
    line-height: 1.2;
    color: ${onMedia.text};

    ${OPEN} & {
      transform: rotate(180deg) translateY(0.5rem);
    }

    @media screen and (prefers-reduced-motion: no-preference) {
      ${CLOSED_ANIMATED} & {
        animation-name: ${spineLabelIn};
      }
    }
  }
`;

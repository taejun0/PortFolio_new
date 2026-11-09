/**
 * 생성 이유: 헤더 스타일을 렌더링 로직과 분리한다.
 * 역할: Thomas Eduardo식 fixed 오버레이 헤더(좌 로고·중앙 캡슐 네비·우측 테마)와 본문 바로가기 스타일이다.
 * 책임: 겹침 없는 3열 그리드·스크롤 스크림·캡슐·활성 pill(정적 + 전환 중 미끄러지는 반전 잉크 레이어)·
 *       테마 토글 시각(아이콘·이름을 html[data-theme]로 고름)·본문 바로가기·인쇄/JS 없음 대체 시각만 소유한다.
 *       모든 움직임은 transform·clip-path·opacity로만 하고 길이·곡선은 모션 토큰을 따른다.
 */
import styled from "@emotion/styled";
import { css, keyframes, type Theme } from "@emotion/react";
import Link from "next/link";

import { motionTransition } from "@/components/common/motion";
import { LIGHT_MODE, THEME_ATTR } from "@/styles/theme";

/** 테마를 바꾼 직후 새 아이콘이 왼쪽부터 열리며 짧게 미끄러져 들어온다(회전·확대 없음). */
const iconSweep = keyframes`
  from {
    clip-path: inset(-25% 100% -25% 0);
    transform: translateX(-0.3rem);
  }
  to {
    clip-path: inset(-25% -25% -25% 0);
    transform: none;
  }
`;

/**
 * 캡슐 줄 배치 — 실제 네비(Nav)와 반전 잉크 레이어(GlideInk)가 같은 줄(패딩·간격·정렬)을 써야
 * 레이어의 라벨 사본이 실제 라벨과 같은 자리에 놓인다.
 */
const navRow = css`
  display: flex;
  align-items: center;
  gap: 0.1rem;
  padding: 0.25rem;

  /* 390px 미만: 로고·토글과 한 줄에 들어가도록 항목 사이 간격을 없앤다 */
  @media (max-width: 389.98px) {
    gap: 0;
  }
`;

/**
 * 네비 라벨 상자 — 실제 링크(NavLink)와 잉크 레이어의 사본(GlideLabel)이 이 조각 하나를 같이 써서
 * 사본 글자가 실제 글자 위에 픽셀 단위로 겹친다(패딩·글자·자간·대문자·줄바꿈 금지·축소 금지·좁은 폭 조임).
 */
const navLabelBox = ({ theme }: { theme: Theme }) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: clamp(0.35rem, 0.3rem + 0.2vw, 0.5rem)
    clamp(0.55rem, 0.4rem + 0.55vw, 0.9rem);
  font-size: ${theme.typography.nav.fontSize};
  font-weight: ${theme.fonts.weights.semiBold};
  letter-spacing: ${theme.typography.nav.letterSpacing};
  text-transform: uppercase;
  white-space: nowrap;

  /*
   * 390px 미만: 로고·토글과 한 줄에 들어가도록 캡슐을 조인다 (글자 11px·높이·탭 영역은 유지).
   * 360~389px는 이 조임으로 로고까지 들어가고, 그 아래는 로고를 접는다.
   */
  @media (max-width: 389.98px) {
    padding-inline: 0.42rem;
    letter-spacing: 0.08em;
  }

  /* 300px 미만(폴드 커버 화면 등): 한 번 더 조여 토글이 화면 밖으로 밀리지 않게 한다 */
  @media (max-width: 299.98px) {
    padding-inline: 0.32rem;
    letter-spacing: 0.04em;
  }
`;

/**
 * 본문 바로가기 — 모든 페이지의 첫 Tab 정거장.
 * 키보드 포커스 전에는 보이지 않고(투명·왼쪽으로 비켜 있음·포인터 무시, 포커스는 그대로 받는다),
 * :focus-visible이면 헤더 위 로고 자리(gutter 안쪽)에 작은 pill로 쓸려 들어온다. opacity·transform만 움직인다.
 */
export const SkipLink = styled.a`
  position: fixed;
  top: calc(${({ theme }) => theme.layout.headerHeight} / 2);
  left: ${({ theme }) => theme.layout.gutter};
  z-index: 201;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.2;
  white-space: nowrap;
  opacity: 0;
  transform: translate(
    calc(${({ theme }) => theme.motion.distance.sweep} * -1),
    -50%
  );
  pointer-events: none;
  transition: ${motionTransition(["opacity", "transform"], "ui")};

  &:focus-visible {
    opacity: 1;
    transform: translate(0, -50%);
    pointer-events: auto;
  }

  @media print {
    display: none;
  }
`;

/** 문서 맨 위에 붙어 함께 스크롤되는 임계선 — 화면 밖으로 나가면 헤더 스크림을 켠다. */
export const ScrollSentinel = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: ${({ theme }) => theme.space[3]};
  visibility: hidden;
  pointer-events: none;
`;

export const Wrapper = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  pointer-events: none;
  height: ${({ theme }) => theme.layout.headerHeight};

  /*
   * 스크롤 스크림: 캔버스색(현재 모드의 배경 변수) → 투명으로 완만하게 사라지는 그라디언트.
   * 헤더 박스 밖으로 조금 더 내려 경계가 보이지 않게 하고, pointer-events는 헤더에서 상속(none)한다.
   * (마스크 blur는 하단 경계에서 글자 주위에 번짐 halo를 남겨 쓰지 않는다)
   */
  &::before {
    --scrim: ${({ theme }) => theme.colors.background};
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;
    height: calc(100% + ${({ theme }) => theme.space[6]});
    /*
     * 로고 글자 줄(~44%)까지는 완전 불투명 — 92~96%로 두면 큰 섹션 제목이 로고 옆에
     * 회색 잔상("taejun0 Contact me.")으로 비친다. 헤더 하단 이후 ease 곡선으로 사라진다.
     */
    background: linear-gradient(
      to bottom,
      var(--scrim) 0%,
      var(--scrim) 44%,
      color-mix(in srgb, var(--scrim) 86%, transparent) 56%,
      color-mix(in srgb, var(--scrim) 56%, transparent) 68%,
      color-mix(in srgb, var(--scrim) 22%, transparent) 84%,
      transparent 100%
    );
    opacity: ${({ $scrolled }) => ($scrolled ? 1 : 0)};
    transition: ${motionTransition("opacity", "section")};
  }

  /* 인쇄: 페이지마다 반복·겹치지 않게 첫 장 맨 위에 한 번만 두고, 스크림 없이 로고만 남긴다 */
  @media print {
    position: absolute;

    &::before {
      display: none;
    }
  }
`;

export const Bar = styled.div`
  position: relative;
  z-index: 1;
  /* 1fr auto 1fr: 네비는 가운데 열에 고정되고, 좌우 열은 내용보다 작아지지 않아 겹칠 수 없다 */
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: ${({ theme }) => theme.space[2]};
  width: 100%;
  height: 100%;
  padding: 0 ${({ theme }) => theme.layout.gutter};

  /* 로고를 접는 폭: 빈 1열 옆 간격을 줄여 캡슐·토글이 gutter 안에 들어오게 한다 */
  @media (max-width: 359.98px) {
    column-gap: ${({ theme }) => theme.space[1]};
  }
`;

export const Logo = styled(Link)`
  grid-column: 1;
  justify-self: start;
  /*
   * 글자는 작아도 탭 영역·포커스 링 여백을 확보한다.
   * 좌우 padding만큼 음수 margin을 줘 글자는 gutter 선에 그대로 맞춘다.
   */
  padding: ${({ theme }) => theme.space[2]} 0.4rem;
  margin-inline: -0.4rem;
  pointer-events: auto;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  transition: ${motionTransition("color")};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.accent};
  }

  /*
   * 360px 미만: 폰 최소 글자(nav 11px)로 넓어진 캡슐과 토글이 gutter 안에 들어오도록 로고를 접는다.
   * 네비의 Home이 같은 역할(홈 이동·현재 위치 pill)을 한다.
   */
  @media (max-width: 359.98px) {
    display: none;
  }
`;

export const Nav = styled.nav`
  ${navRow}
  /* 로고가 접혀도 자동 배치로 밀리지 않게 열을 고정한다 */
  grid-column: 2;
  position: relative;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.surfaceAlt} 82%,
    transparent
  );
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  pointer-events: auto;

  @media print {
    display: none;
  }
`;

/**
 * 라우트가 바뀌는 동안만 보이는 미끄러지는 pill = 반전 잉크 레이어.
 * 캡슐과 같은 줄에 같은 상자의 라벨 사본을 깔고 텍스트색 바탕·반전 글자로 칠한 뒤, clip-path(inset … round)로
 * pill 모양만 남긴다. 클립이 출발 항목에서 목적 항목으로 옮겨 가는 동안 pill 안 글자는 늘 반전 잉크,
 * pill 밖 실제 라벨은 늘 muted라 미끄러지는 내내 모든 라벨이 읽힌다(링크보다 위, 포인터는 통과).
 * 평소에는 숨어 있고, 활성 표시는 링크의 정적 pill(::before)이 맡는다.
 */
export const GlideInk = styled.span`
  ${navRow}
  position: absolute;
  inset: 0;
  z-index: 2;
  background: ${({ theme }) => theme.colors.text};
  color: ${({ theme }) => theme.colors.accentContrast};
  pointer-events: none;
  -webkit-user-select: none;
  user-select: none;
  visibility: hidden;

  [data-pill-gliding] > & {
    visibility: visible;
  }
`;

/** 잉크 레이어 안의 라벨 사본 — 실제 링크와 같은 상자라 글자가 그 위에 그대로 겹친다. */
export const GlideLabel = styled.span`
  ${navLabelBox}
`;

export const NavLink = styled(Link)`
  ${navLabelBox}
  position: relative;
  z-index: 1;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }

  /*
   * 미끄러지는 동안 실제 라벨은 모두 muted(호버·포커스 중인 목적지도) — pill 안 글자는 잉크 레이어의 사본이 그린다.
   * 즉시 바뀐다: 떠나는 항목이 캡슐 위에서 반전 잉크(어두운 글자)로 남아 사라지거나, 목적지가 pill보다 먼저 물들지 않는다.
   */
  [data-pill-gliding] & {
    color: ${({ theme }) => theme.colors.textMuted};
    transition: none;
  }

  /*
   * 활성 항목은 pill(텍스트색) 위에 올라가므로 반전 잉크를 쓴다 — 전환 없이 바로.
   * 미끄러짐이 끝나 data-pill-gliding이 빠지는 그 프레임에 반전 글자·정적 pill이 함께 나타나고 잉크 레이어가 숨는다.
   */
  &[aria-current="page"] {
    color: ${({ theme }) => theme.colors.accentContrast};
    transition: none;
  }

  [data-pill-gliding] &[aria-current="page"] {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  /*
   * 정적 활성 pill — SSR·hydration 전·JS 없음에서도 첫 페인트부터 활성 글자 뒤에 깔린다(반전 잉크가 묻히지 않음).
   * 링크 박스를 그대로 따라가 리사이즈·폰트 교체에도 측정 없이 맞는다. 전환 중에는 잉크 레이어에 자리를 내준다.
   */
  &[aria-current="page"]::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: ${({ theme }) => theme.colors.text};
  }

  [data-pill-gliding] &[aria-current="page"]::before {
    visibility: hidden;
  }

  /* 캡슐 안쪽 여백(0.25rem) 안에서 링이 캡슐 테두리와 겹치지 않게 간격을 줄인다 */
  &:focus-visible {
    outline-offset: 1px;
  }
`;

export const Actions = styled.div`
  grid-column: 3;
  justify-self: end;
  display: flex;
  align-items: center;
  pointer-events: auto;

  @media print {
    display: none;
  }
`;

/**
 * 테마 토글 — 두 모드의 아이콘·이름을 모두 렌더하고 html[data-theme]로 하나만 남긴다.
 * 부트 스크립트가 첫 페인트 전에 속성을 맞추므로 hydration 전에도 아이콘과 접근 가능한 이름이 맞다
 * (display: none인 쪽은 이름 계산에서도 빠진다).
 */
export const ThemeToggle = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(2rem, 1.7rem + 0.6vw, 2.35rem);
  height: clamp(2rem, 1.7rem + 0.6vw, 2.35rem);
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.surfaceAlt} 88%,
    transparent
  );
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  color: ${({ theme }) => theme.colors.text};
  transition: ${motionTransition(["color", "border-color", "background"])};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 30%,
      transparent
    );
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 8%,
      transparent
    );
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

  /* 다크(기본)면 "라이트로" 쪽(data-for="dark")만, 라이트면 "다크로" 쪽(data-for="light")만 남긴다 */
  ${LIGHT_MODE} & [data-for="dark"],
  html:not([${THEME_ATTR}="light"]) & [data-for="light"] {
    display: none;
  }

  /*
   * JS 없음: 눌러도 아무 일이 없으므로 숨긴다(자리는 유지해 그리드가 흔들리지 않는다).
   * 부트 스크립트가 첫 페인트 전에 data-theme-ready를 붙여 JS 방문자는 첫 프레임부터 보인다.
   */
  html:not([data-theme-ready="1"]) & {
    visibility: hidden;
  }
`;

export const ThemeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /*
   * 사용자가 토글로 바꾼 아이콘만 들어온다 — 숨어 있던(display: none) 아이콘이 보이는 순간 애니메이션이 시작된다.
   * 첫 로드·다른 탭에서 바뀐 모드는 조용히 바뀐다.
   */
  @media screen and (prefers-reduced-motion: no-preference) {
    &[data-icon-enter] {
      animation: ${iconSweep} ${({ theme }) => theme.motion.duration.section}s
        ${({ theme }) => theme.motion.curve.out} backwards;
    }
  }
`;

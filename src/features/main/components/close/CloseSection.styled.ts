/** 가로형 명함의 비율·용지 단차·연락 액션을 정의한다. */
import { css, keyframes, type Theme } from "@emotion/react";
import styled from "@emotion/styled";

import { primaryButton, secondaryButton } from "@/components/common/button/buttonStyles";
import {
  motionTransition,
  underlineSweep,
  underlineSweepActive,
} from "@/components/common/motion";
import { LIGHT_MODE, motionTokens } from "@/styles/theme";
import { Section as SectionBase } from "../shared/SectionPrimitives.styled";

const paper = "#f6f6f6";
const paperLit = "#fcfcfc";
const paperShade = "#ececec";

// 종이 단차와 그림자도 카드 면과 함께 열린다.
const SHADOW_ROOM = "4.5rem";

const cardSweep = keyframes`
  from {
    clip-path: inset(
      -${SHADOW_ROOM} calc(100% + ${SHADOW_ROOM}) -${SHADOW_ROOM} -${SHADOW_ROOM}
    );
    transform: translateX(var(--motion-sweep-x));
  }
  to {
    clip-path: inset(
      -${SHADOW_ROOM} -${SHADOW_ROOM} -${SHADOW_ROOM} -${SHADOW_ROOM}
    );
    transform: none;
  }
`;

const cardFace = (theme: Theme) => css`
  background:
    radial-gradient(
      120% 60% at 50% 0%,
      rgb(255 255 255 / 4%) 0%,
      transparent 62%
    ),
    linear-gradient(
      160deg,
      ${theme.colors.surfaceAlt} 0%,
      ${theme.colors.surface} 58%,
      #0d0d0d 100%
    );
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 9%),
    inset 0 0 0 1px rgb(255 255 255 / 6%),
    -1px 1px 0 #2b2b2b,
    -2px 2px 0 #262626,
    -3px 3px 0 #212121,
    -4px 4px 0 #1c1c1c,
    -16px 22px 40px rgb(0 0 0 / 65%);

  ${LIGHT_MODE} & {
    background: linear-gradient(
      135deg,
      ${paperLit} 0%,
      ${paper} 58%,
      ${paperShade} 100%
    );
    box-shadow:
      inset 1px 1px 0 rgb(255 255 255 / 78%),
      inset -1px -1px 0 rgb(0 0 0 / 7%),
      -1px 1px 0 #d8d8da,
      -2px 2px 0 #d4d4d6,
      -3px 3px 0 #d0d0d2,
      -4px 4px 0 #cbcbcd,
      -10px 14px 22px rgb(0 0 0 / 40%),
      -20px 26px 38px rgb(0 0 0 / 26%);
  }
`;

export const Section = styled(SectionBase)`
  padding-bottom: ${({ theme }) => theme.space[8]};
`;

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  column-gap: ${({ theme }) => theme.space[5]};
  row-gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[7]};
`;

export const Aside = styled.p`
  min-width: 0;
  max-width: 100%;
  font-size: max(0.875rem, 14px);
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-basis: 100%;
  }
`;

/** 충분한 폭의 카드 두 장이 들어갈 때만 나란히 배치한다. */
export const Deck = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 32rem));
  justify-content: center;
  align-items: start;
  gap: ${({ theme }) => theme.space[7]};
  width: 100%;
  margin-inline: auto;
`;

/** 90 × 50의 가로 명함. 연락 버튼은 밖에 두어 용지 비율을 지킨다.
 * 텍스트를 크게 설정한 경우에는 내용을 자르지 않고 높이가 늘어날 수 있다. */
export const Card = styled.article`
  position: relative;
  container-name: business-card;
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  aspect-ratio: 90 / 50;
  border-radius: 3px;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => cardFace(theme)}

  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion="live"] &[data-reveal-state="pending"] {
      opacity: 0;
    }

    html[data-motion="live"] &[data-reveal-state="in"] {
      animation: ${cardSweep} var(--reveal-duration, var(--motion-reveal))
        var(--motion-ease) var(--reveal-delay, 0s) backwards;
    }
  }
`;

export const Front = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.8fr);
  align-items: center;
  gap: clamp(12px, 4cqi, 1.5rem);
  padding: clamp(max(0.75rem, 12px), 4.5cqi, 1.5rem);
`;

export const FrontCopy = styled.div`
  display: grid;
  gap: clamp(8px, 2.5cqi, 1rem);
  min-width: 0;
`;

/** 사진의 아치 프레임과 종이 질감은 포트폴리오의 기존 표현을 유지한다. */
export const Arch = styled.div`
  position: relative;
  justify-self: center;
  width: 100%;
  max-width: 10rem;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 50% 50% 0.12rem 0.12rem / 32% 32% 0.12rem 0.12rem;
  outline: 1px solid color-mix(in srgb, ${({ theme }) => theme.colors.text} 16%, transparent);
  outline-offset: 0.3rem;

  img {
    object-fit: cover;
    object-position: center 36%;
    filter: grayscale(1) contrast(1.04) brightness(0.92);
    transform: scale(1.08);
    transform-origin: center 20%;
  }

  ${LIGHT_MODE} & img {
    filter: grayscale(1) contrast(1.04);
  }
`;

export const Quote = styled.p`
  font-size: clamp(max(1rem, 16px), 3.25cqi, 1.125rem);
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textMuted};

  span { display: block; }
`;

export const Back = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.5fr);
  align-items: center;
  gap: clamp(12px, 4cqi, 1.5rem);
  padding: clamp(max(0.75rem, 12px), 4.5cqi, 1.5rem);
`;

export const Identity = styled.div`
  display: grid;
  justify-items: start;
  gap: clamp(8px, 2.5cqi, 1rem);
  min-width: 0;
`;

const livePing = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  70%,
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
`;

export const Badge = styled.p`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: max(0.875rem, 14px);
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.accent};
`;

export const BadgeDot = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: currentColor;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: inherit;
    opacity: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    &::after {
      animation: ${livePing} 2.4s ${motionTokens.curve.out} infinite;
    }
  }
`;

export const Name = styled.h3`
  font-size: clamp(max(1.5rem, 24px), 6cqi, 2.25rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

export const Role = styled.p`
  font-size: clamp(max(1rem, 16px), 3.25cqi, 1.125rem);
  line-height: 1.5;
  text-wrap: balance;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Contacts = styled.ul`
  display: grid;
  min-width: 0;
`;

/** 라벨을 주소 위에 두어 좁은 카드에서도 주소의 가로 폭을 확보한다. */
export const RowLabel = styled.span`
  font-size: max(0.875rem, 14px);
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.textMuted};

  line-height: 1.3;
`;

export const RowValue = styled.span`
  ${underlineSweep()}
  justify-self: start;
  min-width: 0;
  font-size: clamp(max(1rem, 16px), 3.25cqi, 1.125rem);
  line-height: 1.4;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
  transition: ${motionTransition("color")};
`;

const rowActive = (theme: Theme) => css`
  ${RowValue} {
    color: ${theme.colors.accent};
    ${underlineSweepActive()}
  }
`;

export const Row = styled.a`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: center;
  justify-items: start;
  row-gap: 2px;
  min-height: clamp(44px, 11cqi, 64px);
  border-radius: 4px;

  @media (hover: hover) {
    &:hover { ${({ theme }) => rowActive(theme)} }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    ${({ theme }) => rowActive(theme)}
  }
`;

/** 조작 영역과 상태 메시지는 명함 바깥의 일정한 위치에 둔다. */
export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};
  width: min(100%, 28rem);
  margin: ${({ theme }) => theme.space[8]} auto 0;
`;

export const Cta = styled.a`
  ${({ theme }) => primaryButton(theme)}
  padding-inline: 0.75rem;
`;

export const CopyButton = styled.button`
  ${({ theme }) => secondaryButton(theme)}
  padding-inline: 0.75rem;
`;

export const CopyStatus = styled.p`
  grid-column: 1 / -1;
  min-height: 2.8em;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.4;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;

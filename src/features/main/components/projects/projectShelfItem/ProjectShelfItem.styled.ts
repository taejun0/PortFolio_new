/** 모바일 세로 카드와 데스크톱 고정 박스 책장. 선택 버튼과 상세 링크는 겹치지 않는다. */
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import Link from "next/link";
import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import { motionTransition } from "@/components/common/motion";
import { motionTokens, palettes } from "@/styles/theme";

export type ShelfEdge = "before" | "open" | "after";
const OPEN = '[data-edge="open"]';
const CLOSED = '[data-edge]:not([data-edge="open"])';
const media = palettes.dark;
const ink = (alpha: number) => `color-mix(in srgb, ${media.background} ${alpha}%, transparent)`;
const OPEN_S = motionTokens.duration.hero;
const windowClip = (grow = "0px", bleed = "0px") => css`
  clip-path: inset(calc(${bleed} - ${grow}) calc(var(--cut-end) + ${bleed} - ${grow}) calc(${bleed} - ${grow}) calc(var(--cut-start) + ${bleed} - ${grow}) round calc(var(--shelf-radius) + ${grow}));
  transition: ${motionTransition("clip-path", OPEN_S)};
`;
const copyIn = keyframes`
  from { opacity: 0; transform: translateY(0.5rem); }
  to { opacity: 1; transform: none; }
`;

export const Item = styled.li`
  --cut-start: 0px;
  --cut-end: 0px;
  --spine-shift: 0px;
  position: relative;
  min-width: 0;
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--shelf-index) * (var(--shelf-spine) + var(--shelf-gap)));
    width: var(--shelf-panel);
    isolation: isolate;
    pointer-events: none;
    &[data-edge="before"] { --cut-end: var(--shelf-cut); }
    &[data-edge="after"] { --cut-start: var(--shelf-cut); --spine-shift: var(--shelf-cut); }
    &::before, &::after { content: ""; position: absolute; inset: -5px; opacity: 0; pointer-events: none; }
    &::before { background: ${({ theme }) => theme.colors.accent}; ${windowClip("5px", "5px")} }
    &::after { background: ${({ theme }) => theme.colors.background}; ${windowClip("3px", "5px")} }
    &:has(button:focus-visible, a:focus-visible)::before,
    &:has(button:focus-visible, a:focus-visible)::after { opacity: 1; }
  }
  @media (forced-colors: active) {
    &::before { forced-color-adjust: none; background: Highlight; }
    &::after { forced-color-adjust: none; background: Canvas; }
  }
  @media (prefers-reduced-motion: reduce) {
    &::before, &::after, & * { transition: none; }
  }
  html:not([data-theme-ready="1"]) & {
    position: relative; inset: auto; width: auto; pointer-events: auto;
    &::before, &::after { display: none; }
  }
  @media print { position: relative; inset: auto; width: auto; pointer-events: auto; }
`;
export const Card = styled.div`
  display: none;
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block; position: absolute; inset: 0; z-index: 1;
    background: ${({ theme }) => theme.colors.border};
    pointer-events: auto;
    ${windowClip()}
  }
  html:not([data-theme-ready="1"]) & { display: none; }
  @media print { display: none; }
`;
export const Window = styled.div`
  position: absolute; inset: 0;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  ${windowClip("-1px")}
`;
export const Media = styled.div`
  position: absolute; inset: 0; overflow: hidden; background: ${media.surfaceAlt};
  img { object-fit: cover; transition: ${motionTransition(["transform", "filter"], OPEN_S)}; }
  ${CLOSED} & img { transform: scale(1.025); filter: grayscale(0.6); }
  &::before, &::after { content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none; }
  &::before { background: ${ink(45)}; opacity: 0; transition: ${motionTransition("opacity", OPEN_S)}; }
  ${CLOSED} &::before { opacity: 1; -webkit-backdrop-filter: blur(5px); backdrop-filter: blur(5px); }
  &::after { background: linear-gradient(to top, ${ink(82)} 0%, ${ink(54)} 15%, ${ink(12)} 30%, transparent 44%); }
`;
export const PreviewButton = styled.button`
  position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%;
  border: 0; padding: 0; outline: none; color: inherit; background: transparent;
  cursor: pointer; -webkit-tap-highlight-color: transparent;
`;
export const IndexPill = styled.span`
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
  min-width: 2rem; min-height: 2rem; padding: 0.2rem 0.45rem;
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  font-variant-numeric: tabular-nums; color: ${media.text}; background: ${ink(32)};
`;
export const PanelCopy = styled.div`
  position: absolute; right: 0; bottom: 0; left: 0; z-index: 3;
  display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center;
  gap: ${({ theme }) => theme.space[3]}; padding: ${({ theme }) => theme.space[4]};
  opacity: 0; visibility: hidden; pointer-events: none;
  ${OPEN} & { opacity: 1; visibility: visible; }
  @media (prefers-reduced-motion: no-preference) {
    [data-edge="open"][data-animate] & { animation: ${copyIn} ${motionTokens.duration.reveal}s ${motionTokens.curve.out} 0.2s backwards; }
  }
`;
export const PanelTitle = styled.h3`
  min-width: 0; font-size: clamp(1.1rem, 0.75rem + 0.8vw, 1.6rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold}; line-height: 1.25; letter-spacing: -0.02em; color: ${media.text};
`;
export const DetailCta = styled(Link)`
  position: relative; grid-column: 2; justify-self: start;
  display: inline-flex; align-items: center; min-height: 44px; padding: 0.45rem 0.85rem;
  border: 1px solid rgb(255 255 255 / 35%); border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${media.text}; background: ${ink(35)}; pointer-events: auto;
  transition: ${motionTransition(["color", "background-color", "border-color"])};
  ${hoverArrowParent}
  &:hover, &:focus-visible { border-color: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.accentContrast}; background: ${({ theme }) => theme.colors.accent}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.accent}; outline-offset: 3px; }
`;
export const Spine = styled.div`
  position: absolute; top: 0; bottom: 0; left: 0; z-index: 3;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
  gap: ${({ theme }) => theme.space[4]}; width: var(--shelf-spine);
  padding: ${({ theme }) => `${theme.space[5]} ${theme.space[2]}`};
  transform: translateX(var(--spine-shift)); pointer-events: none;
  transition: ${motionTransition("transform", OPEN_S)};
  ${OPEN} & { visibility: hidden; }
`;
export const SpineTitle = styled.p`
  min-height: 0; max-height: 100%; overflow: hidden;
  writing-mode: vertical-rl; text-orientation: sideways; transform: rotate(180deg);
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold}; color: ${media.text};
`;
export const MobileCard = styled(Link)`
  display: block; overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radius.lg};
  color: ${({ theme }) => theme.colors.text}; background: ${({ theme }) => theme.colors.surface};
  ${hoverArrowParent}
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.accent}; outline-offset: 4px; }
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) { display: none; }
  html:not([data-theme-ready="1"]) & { display: block; }
  @media print { display: block; break-inside: avoid; }
`;
export const MobileMedia = styled.div`
  position: relative; aspect-ratio: 16 / 10; overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  img { object-fit: cover; }
`;
export const MobileCopy = styled.div`
  display: grid; gap: ${({ theme }) => theme.space[2]}; padding: ${({ theme }) => theme.space[4]};
`;
export const MobileCategory = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold}; color: ${({ theme }) => theme.colors.accent};
`;
export const MobileTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold}; line-height: 1.3;
`;
export const MobileRole = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize}; color: ${({ theme }) => theme.colors.textMuted};
`;
export const MobileSummary = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize}; line-height: 1.65; color: ${({ theme }) => theme.colors.textMuted};
`;
export const MobileCta = styled.span`
  display: inline-flex; align-items: center; justify-self: start; min-height: 44px;
  margin-top: ${({ theme }) => theme.space[2]}; font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
`;

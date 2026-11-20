import { css, type Theme } from "@emotion/react";

import { motionTransition } from "@/components/common/motion";

/** 주요 액션은 채운 면, 보조 액션은 중립 면으로 구분한다. */
const buttonBase = (theme: Theme) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 52px;
  padding: 0.85rem 1.35rem;
  border: 0;
  border-radius: ${theme.layout.radius.md};
  font-family: inherit;
  font-size: max(1rem, 16px);
  font-weight: ${theme.fonts.weights.semiBold};
  line-height: 1.4;
  text-decoration: none;
  cursor: pointer;
  transition: ${motionTransition(["background-color", "color"])};

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 4px;
  }
`;

export const primaryButton = (theme: Theme) => css`
  ${buttonBase(theme)}
  color: ${theme.colors.accentContrast};
  background: ${theme.colors.accent};

  &:hover,
  &:focus-visible {
    background: ${theme.colors.accentSecondary};
  }
`;

export const secondaryButton = (theme: Theme) => css`
  ${buttonBase(theme)}
  color: ${theme.colors.text};
  background: ${theme.colors.surfaceAlt};

  &:hover,
  &:focus-visible {
    background: color-mix(in srgb, ${theme.colors.text} 9%, ${theme.colors.surfaceAlt});
  }
`;

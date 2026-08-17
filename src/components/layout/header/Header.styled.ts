/**
 * 생성 이유: 헤더 스타일을 렌더링 로직과 분리한다.
 * 역할: Thomas Eduardo식 fixed 오버레이 헤더(좌 로고·중앙 캡슐 네비·우측 테마) 스타일이다.
 * 책임: 위치·캡슐·ref 기반 활성 pill·테마 토글 시각만 소유한다.
 */
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const revealIcon = keyframes`
  from { opacity: 0; transform: rotate(-20deg) scale(0.85); }
  to { opacity: 1; transform: rotate(0) scale(1); }
`;

export const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  pointer-events: none;
  height: ${({ theme }) => theme.layout.headerHeight};
`;

export const Bar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 ${({ theme }) => theme.layout.gutter};
`;

export const Logo = styled.span`
  position: relative;
  z-index: 1;
  pointer-events: auto;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Nav = styled.nav`
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  gap: 0.1rem;
  max-width: calc(100vw - clamp(8rem, 6rem + 8vw, 14rem));
  padding: 0.25rem;
  overflow: hidden;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.surfaceAlt} 82%,
    transparent
  );
  backdrop-filter: blur(14px);
  transform: translate(-50%, -50%);
  pointer-events: auto;
`;

export const ActivePill = styled.span`
  position: absolute;
  top: 0.25rem;
  bottom: 0.25rem;
  left: 0;
  z-index: 0;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.text};
  pointer-events: none;
  transition:
    left 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.28s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const NavItem = styled.span<{ $active: boolean }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: clamp(0.35rem, 0.3rem + 0.2vw, 0.5rem)
    clamp(0.55rem, 0.4rem + 0.55vw, 0.9rem);
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.nav.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.nav.letterSpacing};
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentContrast : theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme, $active }) =>
      $active ? theme.colors.accentContrast : theme.colors.text};
  }
`;

export const NavLabel = styled.span`
  position: relative;
`;

export const Actions = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  pointer-events: auto;
`;

export const ThemeToggle = styled.button`
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
  backdrop-filter: blur(12px);
  color: ${({ theme }) => theme.colors.text};
  transition:
    color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
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

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const ThemeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: ${revealIcon} 0.22s cubic-bezier(0.16, 1, 0.3, 1);
`;

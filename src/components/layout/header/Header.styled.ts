/**
 * 생성 이유: 헤더 스타일을 렌더링 로직과 분리한다.
 * 역할: Thomas Eduardo식 fixed 오버레이 헤더(좌 로고·중앙 캡슐 네비) 스타일이다.
 * 책임: 위치·캡슐·활성 pill 시각만 소유한다.
 */
import styled from "@emotion/styled";

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
  width: 100%;
  height: 100%;
  padding: 0 ${({ theme }) => theme.layout.gutter};
`;

export const Logo = styled.span`
  position: relative;
  z-index: 1;
  pointer-events: auto;
  font-size: 0.8125rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Nav = styled.nav`
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  gap: 0.1rem;
  max-width: calc(100vw - 7.5rem);
  padding: 0.25rem;
  overflow-x: auto;
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
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const NavItem = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0.4rem 0.65rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accentContrast : theme.colors.textMuted};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.text : "transparent"};
  transition: color 0.2s ease, background 0.2s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0.45rem 0.85rem;
    font-size: 0.6875rem;
    letter-spacing: 0.1em;
  }

  &:hover {
    color: ${({ theme, $active }) =>
      $active ? theme.colors.accentContrast : theme.colors.text};
  }
`;

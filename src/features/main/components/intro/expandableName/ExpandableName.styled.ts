/**
 * 생성 이유: 확장형 디스플레이 네임 스타일을 로직과 분리한다.
 * 역할: 균등 슬롯 안에서의 낙하 진입·렌즈형 연출만 정의한다.
 * 책임: 낙하 래퍼와 scale·리프트·약한 액센트 틴트 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Name = styled.span`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  width: 100%;
  line-height: ${({ theme }) => theme.typography.heroName.lineHeight};
  user-select: none;
  cursor: default;
  overflow: visible;
`;

export const Slot = styled.span`
  display: flex;
  flex: 1 1 0;
  align-items: flex-end;
  justify-content: center;
  min-width: 0;
  overflow: visible;
`;

export const Fall = styled.span`
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  transform-origin: center top;
  will-change: transform, opacity;
`;

export const Glyph = styled.span<{ $interactive?: boolean }>`
  --sx: 0.2;
  --sy: 0.94;
  --ty: 0px;
  --tint: 0;
  display: inline-block;
  font-size: ${({ theme }) => theme.typography.heroName.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.heroName.letterSpacing};
  line-height: ${({ theme }) => theme.typography.heroName.lineHeight};
  color: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.accent} calc(var(--tint, 0) * 35%),
    ${({ theme }) => theme.colors.text}
  );
  text-shadow: 0 calc(var(--tint, 0) * 8px) calc(var(--tint, 0) * 18px)
    rgba(0, 0, 0, 0.28);
  transform: translate3d(0, var(--ty, 0px), 0)
    scaleX(var(--sx, 1)) scaleY(var(--sy, 1));
  transform-origin: center bottom;
  transition: ${({ $interactive }) =>
    $interactive
      ? `transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
         color 0.18s ease,
         text-shadow 0.18s ease`
      : "none"};
  will-change: transform, color, text-shadow;

  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }
`;

export const Space = styled.span`
  flex: 0.35 1 0;
  min-width: 0.5rem;
`;

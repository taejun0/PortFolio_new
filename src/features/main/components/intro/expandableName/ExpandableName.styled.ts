/**
 * 생성 이유: 확장형 디스플레이 네임 스타일을 로직과 분리한다.
 * 역할: ExpandableName 고정 슬롯·glyph scaleX 시각을 정의한다.
 * 책임: 글자마다 동등한 자리를 두고, 확장 시 대비가 분명한 타이포만 소유한다.
 */
import styled from "@emotion/styled";

export const Name = styled.span`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  width: 100%;
  line-height: 0.9;
  user-select: none;
  cursor: default;
`;

export const Slot = styled.span`
  display: flex;
  flex: 1 1 0;
  align-items: flex-end;
  justify-content: center;
  min-width: 0;
`;

export const Glyph = styled.span`
  display: inline-block;
  font-size: clamp(2.75rem, 11vw, 7.5rem);
  font-weight: ${({ theme }) => theme.fonts.weights.extraBold};
  line-height: 0.9;
  color: ${({ theme }) => theme.colors.text};
  transform: scaleX(var(--sx, 0.18));
  transform-origin: center bottom;
  opacity: calc(0.6 + var(--sx, 0.18) * 0.4);
  transition:
    transform 0.16s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.16s ease-out;
  will-change: transform, opacity;
`;

export const Space = styled.span`
  flex: 0.35 1 0;
  min-width: 0.5rem;
`;

/**
 * 생성 이유: 프로필 초상 프레임 시각을 로직과 분리한다.
 * 역할: PortraitFrame 스타일이다.
 * 책임: 은은한 배경 lift·선택적 좌우 반전 이미지 레이어만 소유한다.
 */
import styled from "@emotion/styled";

export const Frame = styled.div<{ $aspectRatio: string }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
  overflow: hidden;
  border-radius: clamp(1rem, 0.75rem + 0.8vw, 1.35rem);
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  isolation: isolate;
`;

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(
      ellipse 88% 72% at 50% 78%,
      color-mix(in srgb, ${({ theme }) => theme.colors.text} 10%, transparent) 0%,
      transparent 62%
    ),
    radial-gradient(
      ellipse 100% 90% at 50% 18%,
      color-mix(in srgb, ${({ theme }) => theme.colors.surfaceAlt} 92%, transparent) 0%,
      transparent 55%
    ),
    linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.surfaceAlt} 0%,
      ${({ theme }) => theme.colors.surface} 100%
    );
`;

export const ImageWrap = styled.div<{ $mirror: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  transform: ${({ $mirror }) => ($mirror ? "scaleX(-1)" : "none")};

  img {
    filter: contrast(1.02);
  }
`;

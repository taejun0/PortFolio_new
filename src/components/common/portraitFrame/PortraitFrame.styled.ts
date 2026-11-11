/**
 * 생성 이유: 프로필 초상 프레임 시각을 로직과 분리한다.
 * 역할: PortraitFrame 스타일이다.
 * 책임: 은은한 배경 lift·선택적 좌우 반전 이미지 레이어와, settle일 때 리빌에 맞춘 사진 가라앉힘만 소유한다.
 */
import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

/** 리빌 커튼이 걷히는 동안 사진이 1.03배에서 제자리로 내려앉는다(이미지 확대 상한 1.03). */
const settleIn = keyframes`
  from {
    transform: scale(1.03);
  }
  to {
    transform: none;
  }
`;

/**
 * 조상 리빌의 상태·길이·지연(--reveal-*)을 그대로 따른다 — 커튼과 같은 순간 시작해 같은 곡선으로 끝난다.
 * - 대기(pending): 덮개 아래에서 미리 1.03배로 둔다.
 * - 커튼이 hydration 전에 CSS로 걷히는 단계(splash-done, 상태 없음)와 컨트롤러가 재생하는 "in"이
 *   같은 애니메이션 선언이라, 컨트롤러가 이어받아도 다시 시작하지 않는다.
 * 반전(mirror) transform을 덮지 않도록 래퍼가 아니라 img를 움직인다.
 */
const settleOnReveal = css`
  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion="live"] [data-reveal-state="pending"] & img {
      transform: scale(1.03);
    }

    html[data-motion][data-splash-done="1"]
      [data-reveal="curtain"]:not([data-reveal-state])
      & img,
    html[data-motion="live"] [data-reveal-state="in"] & img {
      animation: ${settleIn} var(--reveal-duration, var(--motion-reveal))
        var(--motion-ease) var(--reveal-delay, 0.1s) both;
    }
  }
`;

export const Frame = styled.div<{ $aspectRatio: string }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.layout.radius.lg};
  border: ${({ theme }) => theme.layout.borderWidth.card} solid ${({ theme }) => theme.colors.border};
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

export const ImageWrap = styled.div<{ $mirror: boolean; $settle: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  transform: ${({ $mirror }) => ($mirror ? "scaleX(-1)" : "none")};

  img {
    filter: contrast(1.02);
  }

  ${({ $settle }) => ($settle ? settleOnReveal : null)}
`;

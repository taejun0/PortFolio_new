/**
 * 생성 이유: Thomas Sobre식 첫 화면 구도를 About 프로필에 맞춘다.
 * 역할: ProfileSection 스타일이다.
 * 책임: 여유로운 디스플레이 네임·태그라인과 오른쪽 초상의 2열 배치, 마퀴 간격, 첫 화면 커튼 색만 소유한다.
 *       모바일은 이름 → 태그라인 → 작은 초상 순서의 1열이다.
 */
import styled from "@emotion/styled";

/**
 * 커튼 색(--reveal-curtain)을 섹션 배경과 같은 선언에서 준다 — 이름·초상 커튼이 상속한다.
 * 섹션 클래스는 테마와 함께 바뀌므로 덮개가 늘 배경과 같은 색이다(전역 --motion-canvas와 같은 값).
 */
export const Chapter = styled.section`
  --reveal-curtain: ${({ theme }) => theme.colors.background};

  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: clamp(5rem, 3rem + 8vw, 9rem)
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

/** 이름 블록 | 초상 — 초상 바닥을 태그라인 기준선 쪽에 맞춘다. */
export const Layout = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr) clamp(13rem, 24vw, 21rem);
    column-gap: ${({ theme }) => theme.space[7]};
    align-items: end;
  }
`;

export const Intro = styled.div`
  min-width: 0;
`;

/** 프로필 소개 라벨 */
export const Eyebrow = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const DisplayName = styled.h1`
  display: grid;
  gap: 0.08em;
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const NameLine = styled.span`
  display: block;
  font-size: clamp(3rem, 1.4rem + 8vw, 6.5rem);
  font-weight: ${({ theme }) => theme.fonts.weights.extraBold};
  line-height: 0.92;
  letter-spacing: -0.045em;
  color: ${({ theme }) => theme.colors.text};
`;

export const Tagline = styled.p`
  margin-bottom: 0;
  max-width: min(36rem, 100%);
  font-size: clamp(1.05rem, 0.95rem + 0.55vw, 1.3rem);
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Emphasis = styled.strong`
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Portrait = styled.div`
  width: min(13rem, 52vw);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

export const MarqueeSlot = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.space[8]};
`;

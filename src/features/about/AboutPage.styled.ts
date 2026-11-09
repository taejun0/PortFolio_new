/**
 * 생성 이유: About 페이지 셸 스타일을 분리한다.
 * 역할: AboutPage 최상위 래퍼·챕터 공통 스타일이다.
 * 책임: 여유 있는 섹션 패딩과 라벨·타이틀 리듬만 소유한다.
 *       고정 헤더만큼의 앵커 여백은 전역 html scroll-padding-top이 맡는다(챕터마다 scroll-margin을 두지 않는다).
 *
 * 챕터에 content-visibility를 두지 않는다(실측, 같은 트리에서 이 블록만 다른 빌드와 비교):
 * - 두면 클라이언트 뒤로 가기로 다시 마운트된 /about이 화면 밖 챕터를 자리 높이(48rem)로 시작해,
 *   되돌린 scrollY가 떠날 때와 다른 내용에 멈췄다(1280px에서 1600 → 1361, 239px 모자람). 빼면 복원이 정확하다.
 * - 빼도 비용이 없다 — 4x CPU 모바일 LCP 중앙값 556 → 528ms, 하이드레이션 긴 작업 148 → 114ms,
 *   로드 Layout 합계 약 +4ms(45~51 → 46~57ms). 첫 레이아웃이 한 작업에 몰리지만(약 100ms, 4x) FCP·LCP보다 앞이다.
 *   Trajectory 레일도 실제 레이아웃을 그대로 따라간다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
`;

export const Chapter = styled.section<{
  $alt?: boolean;
  $compact?: boolean;
  $cozy?: boolean;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: ${({ $compact, $cozy }) =>
      $compact
        ? "clamp(2rem, 1.2rem + 2.5vw, 3.25rem)"
        : $cozy
          ? "clamp(3rem, 2rem + 4vw, 5rem)"
          : "clamp(5.5rem, 3.5rem + 9vw, 11rem)"}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme, $alt }) =>
    $alt ? theme.colors.surface : theme.colors.background};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

/** 챕터 라벨 */
export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[8]};
  max-width: 18ch;
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: ${({ theme }) => theme.typography.title.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

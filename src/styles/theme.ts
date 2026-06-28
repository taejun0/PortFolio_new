/**
 * 생성 이유: 프로젝트 전반에서 반복되는 디자인 값을 한곳에서 관리한다.
 * 역할: 현재 확정된 글꼴, 레이아웃, 반응형 기준 토큰과 타입을 제공한다.
 * 책임: 확정되지 않은 색상은 포함하지 않고 공통 토큰의 단일 출처를 유지한다.
 */
export const theme = {
  fonts: {
    body: "var(--font-pretendard), 'Pretendard', -apple-system, sans-serif",
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
  },
  layout: {
    maxWidth: "1200px",
    headerHeight: "4rem",
    sectionPaddingY: "6rem",
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1200px",
  },
} as const;

export type AppTheme = typeof theme;

/**
 * 생성 이유: 프로젝트 전반에서 반복되는 디자인 값을 한곳에서 관리한다.
 * 역할: 색·타이포·간격·모션·레이아웃 토큰과 Emotion Theme 타입을 제공한다.
 * 책임: 의미 단위 토큰의 단일 출처를 유지한다.
 *
 * 레퍼런스: Thomas Eduardo (thomaseduardo.com.br) — 딥 블랙 캔버스,
 * 라임 액센트(#a0ec06), 번호 섹션, 큰 타이포·기간호 제목. Pretendard만 사용.
 * 카피 톤은 PortfolioPage 원문을 유지한다.
 */
export const theme = {
  colors: {
    background: "#000000",
    surface: "#121212",
    surfaceAlt: "#1c1c1c",
    text: "#ffffff",
    textMuted: "#a3a3a3",
    border: "rgba(255, 255, 255, 0.1)",
    borderStrong: "rgba(160, 236, 6, 0.45)",
    accent: "#a0ec06",
    accentSecondary: "#c8f54a",
    accentGradient: "linear-gradient(135deg, #a0ec06 0%, #c8f54a 100%)",
    accentContrast: "#000000",
    wash: "#121212",
  },
  fonts: {
    display: "var(--font-pretendard), 'Pretendard', -apple-system, sans-serif",
    body: "var(--font-pretendard), 'Pretendard', -apple-system, sans-serif",
    mono: "var(--font-pretendard), 'Pretendard', -apple-system, sans-serif",
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
  },
  typography: {
    display: {
      fontSize: "clamp(2.75rem, 7vw, 4.5rem)",
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
    },
    title: {
      fontSize: "clamp(1.85rem, 4vw, 2.75rem)",
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
    heading: {
      fontSize: "1.25rem",
      lineHeight: 1.35,
      letterSpacing: "-0.01em",
    },
    body: {
      fontSize: "1rem",
      lineHeight: 1.75,
      letterSpacing: "0",
    },
    label: {
      fontSize: "0.8125rem",
      lineHeight: 1.4,
      letterSpacing: "0.08em",
    },
  },
  space: {
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.5rem",
    6: "2rem",
    7: "3rem",
    8: "4rem",
    9: "6rem",
    10: "8rem",
  },
  layout: {
    maxWidth: "1120px",
    measure: "40rem",
    headerHeight: "4rem",
    sectionPaddingY: "clamp(5rem, 12vw, 8rem)",
    gutter: "clamp(1.25rem, 4vw, 2.5rem)",
  },
  motion: {
    duration: {
      micro: 0.16,
      ui: 0.22,
      section: 0.45,
      hero: 0.55,
    },
    ease: {
      settle: [0.25, 0.1, 0.25, 1] as const,
      out: [0.16, 1, 0.3, 1] as const,
    },
    offset: {
      enterY: 16,
      enterX: 0,
    },
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
  },
} as const;

export type AppTheme = typeof theme;

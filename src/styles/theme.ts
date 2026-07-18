/**
 * 생성 이유: 프로젝트 전반에서 반복되는 디자인 값을 한곳에서 관리한다.
 * 역할: 색·타이포·간격·모션·레이아웃 토큰과 Emotion Theme 타입을 제공한다.
 * 책임: 다크/라이트 팔레트와 뷰포트 스케일 토큰의 단일 출처를 유지한다.
 *
 * 레퍼런스: Thomas Eduardo (thomaseduardo.com.br) — 딥 블랙 캔버스,
 * 라임 액센트(#a0ec06), 번호 섹션, 큰 타이포·기간호 제목. Pretendard만 사용.
 * 카피 톤은 PortfolioPage 원문을 유지한다.
 */
export type ThemeMode = "dark" | "light";

const fonts = {
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
} as const;

const typography = {
  heroName: {
    fontSize: "clamp(2.35rem, 1rem + 7.5vw, 6.25rem)",
    lineHeight: 0.9,
    letterSpacing: "-0.03em",
  },
  display: {
    fontSize: "clamp(2.15rem, 1.1rem + 4vw, 4rem)",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
  },
  title: {
    fontSize: "clamp(1.55rem, 1rem + 2.1vw, 2.65rem)",
    lineHeight: 1.15,
    letterSpacing: "-0.02em",
  },
  heading: {
    fontSize: "clamp(1.05rem, 0.95rem + 0.45vw, 1.35rem)",
    lineHeight: 1.35,
    letterSpacing: "-0.01em",
  },
  quote: {
    fontSize: "clamp(1.15rem, 0.95rem + 0.95vw, 1.55rem)",
    lineHeight: 1.5,
    letterSpacing: "-0.02em",
  },
  bodyLg: {
    fontSize: "clamp(1rem, 0.92rem + 0.35vw, 1.125rem)",
    lineHeight: 1.7,
    letterSpacing: "0",
  },
  body: {
    fontSize: "clamp(0.9375rem, 0.88rem + 0.28vw, 1.0625rem)",
    lineHeight: 1.75,
    letterSpacing: "0",
  },
  bodySm: {
    fontSize: "clamp(0.8125rem, 0.78rem + 0.18vw, 0.9375rem)",
    lineHeight: 1.55,
    letterSpacing: "0",
  },
  label: {
    fontSize: "clamp(0.6875rem, 0.64rem + 0.18vw, 0.8125rem)",
    lineHeight: 1.4,
    letterSpacing: "0.08em",
  },
  small: {
    fontSize: "clamp(0.625rem, 0.58rem + 0.15vw, 0.75rem)",
    lineHeight: 1.4,
    letterSpacing: "0.06em",
  },
  nav: {
    fontSize: "clamp(0.5625rem, 0.52rem + 0.14vw, 0.6875rem)",
    lineHeight: 1.2,
    letterSpacing: "0.1em",
  },
} as const;

const space = {
  1: "0.25rem",
  2: "0.5rem",
  3: "clamp(0.65rem, 0.55rem + 0.35vw, 0.85rem)",
  4: "clamp(0.85rem, 0.7rem + 0.5vw, 1.15rem)",
  5: "clamp(1.15rem, 0.9rem + 0.9vw, 1.65rem)",
  6: "clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem)",
  7: "clamp(1.85rem, 1.2rem + 2.4vw, 3.25rem)",
  8: "clamp(2.25rem, 1.4rem + 3.2vw, 4.25rem)",
  9: "clamp(3rem, 1.6rem + 5vw, 6.5rem)",
  10: "clamp(4rem, 2rem + 6.5vw, 8.5rem)",
} as const;

const layout = {
  maxWidth: "72rem",
  measure: "min(40rem, 100%)",
  headerHeight: "clamp(3.5rem, 3.25rem + 0.6vw, 4.25rem)",
  sectionPaddingY: "clamp(3.25rem, 1.75rem + 6vw, 7.5rem)",
  gutter: "clamp(1rem, 0.4rem + 3.2vw, 3rem)",
  portraitCol: "clamp(12.5rem, 22vw, 18.5rem)",
  cardWidth: "min(78vw, clamp(18rem, 42vw, 28rem))",
  cardHeight: "clamp(24rem, 55vh, 32rem)",
  panelMinHeight: "clamp(14rem, 28vh, 20rem)",
  radius: {
    sm: "clamp(0.4rem, 0.3rem + 0.25vw, 0.55rem)",
    md: "clamp(0.75rem, 0.55rem + 0.6vw, 1.15rem)",
    lg: "clamp(1rem, 0.75rem + 0.8vw, 1.35rem)",
  },
} as const;

const motion = {
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
} as const;

const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1280px",
} as const;

const darkColors = {
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
  gridLine: "rgba(255, 255, 255, 0.035)",
  splashWash: "rgba(160, 236, 6, 0.1)",
} as const;

const lightColors = {
  background: "#f3f3f4",
  surface: "#ffffff",
  surfaceAlt: "#ebebec",
  text: "#0c0c0c",
  textMuted: "#5a5a5a",
  border: "rgba(0, 0, 0, 0.1)",
  borderStrong: "rgba(120, 180, 0, 0.5)",
  accent: "#6fad00",
  accentSecondary: "#8acc14",
  accentGradient: "linear-gradient(135deg, #6fad00 0%, #8acc14 100%)",
  accentContrast: "#ffffff",
  wash: "#ebebec",
  gridLine: "rgba(0, 0, 0, 0.05)",
  splashWash: "rgba(111, 173, 0, 0.12)",
} as const;

export const darkTheme = {
  mode: "dark" as const satisfies ThemeMode,
  colors: darkColors,
  fonts,
  typography,
  space,
  layout,
  motion,
  breakpoints,
};

export const lightTheme = {
  mode: "light" as const satisfies ThemeMode,
  colors: lightColors,
  fonts,
  typography,
  space,
  layout,
  motion,
  breakpoints,
};

export const themes = {
  dark: darkTheme,
  light: lightTheme,
} as const;

/** 기본 다크 — ThemeModeProvider가 모드별 테마를 주입한다. */
export const theme = darkTheme;

export type AppTheme = {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textMuted: string;
    border: string;
    borderStrong: string;
    accent: string;
    accentSecondary: string;
    accentGradient: string;
    accentContrast: string;
    wash: string;
    gridLine: string;
    splashWash: string;
  };
  fonts: typeof fonts;
  typography: typeof typography;
  space: typeof space;
  layout: typeof layout;
  motion: typeof motion;
  breakpoints: typeof breakpoints;
};

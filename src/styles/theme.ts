/**
 * 생성 이유: 프로젝트 전반에서 반복되는 디자인 값을 한곳에서 관리한다.
 * 역할: 색·타이포·간격·모션·레이아웃 토큰과 Emotion Theme 타입을 제공한다.
 * 책임: 다크/라이트 팔레트와 뷰포트 스케일 토큰의 단일 출처를 유지한다.
 *       Emotion 테마의 색은 모드와 무관한 CSS 변수 참조(var(--color-*))다 — 실제 색은 html[data-theme]별로
 *       루트 레이아웃 부트 CSS(themeBoot의 THEME_BOOT_CSS)가 첫 페인트 전에 정의한다. 그래서 서버 HTML은
 *       다크·라이트에서 같고, 라이트 재방문도 첫 페인트부터 라이트이며, 토글은 html 속성만 바꾼다
 *       (Emotion 스타일을 다시 만들지 않는다).
 *       모드별 리터럴 색 테마 객체는 두지 않는다 — 고정 색이 꼭 필요한 곳(사진 위 다크 팔레트 등)만 palettes를 쓴다.
 *
 * 레퍼런스: Thomas Eduardo (thomaseduardo.com.br) — 딥 블랙 캔버스,
 * 라임 액센트(#a0ec06), 번호 섹션, 큰 타이포·기간호 제목. Pretendard만 사용.
 * 카피 톤은 PortfolioPage 원문을 유지한다.
 */
export type ThemeMode = "dark" | "light";

/** html에 붙는 테마 속성 — 부트 스크립트·토글이 맞추고, 팔레트 변수와 모드별 규칙이 이 속성을 따른다. */
export const THEME_ATTR = "data-theme";

/**
 * 라이트 모드 조상 선택자. 색 토큰 하나로 표현되지 않는 모드별 차이(면 종류·그림자·필터·섞는 비율)는
 * 기본(다크) 값 뒤에 `${LIGHT_MODE} & { … }`로 덮는다. 상태 규칙(:hover 등)과 같은 속성을 다투면
 * 이 선택자의 구체성이 더 높으므로, 그럴 때는 지역 CSS 변수만 바꾸고 선언은 그 변수를 쓴다.
 */
export const LIGHT_MODE = `html[${THEME_ATTR}="light"]`;

const fonts = {
  display: "var(--font-pretendard), 'Pretendard', -apple-system, sans-serif",
  body: "var(--font-pretendard), 'Pretendard', -apple-system, sans-serif",
  mono: "var(--font-pretendard), 'Pretendard', -apple-system, sans-serif",
  script: "var(--font-pretendard), 'Pretendard', -apple-system, sans-serif",
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
  },
} as const;

/*
 * 폰 가독성 하한(px): rem 기준이 폰에서 14px까지 내려가 작은 토큰이 8~11px로 떨어졌다(Lighthouse 글자 크기 감사 실패).
 * clamp 최솟값만 px로 올리고 가운데 식·최댓값은 그대로 둬서 1100px 이상 크기는 그대로다
 * (nav만 1440px에서 10.9px → 11px). 하한이 걸리는 구간: bodySm < 447px, label < 1007px, small < 1089px, nav < 1466px.
 * 본문·메타(bodySm)와 액센트 라벨(label)은 12px, 아주 작은 대문자(small·nav)는 11px 아래로 내려가지 않는다.
 */
const typography = {
  heroName: {
    fontSize: "clamp(2.6rem, 0.55rem + 9.2vw, 7.25rem)",
    lineHeight: 0.84,
    letterSpacing: "-0.05em",
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
    fontSize: "clamp(12px, 0.78rem + 0.18vw, 0.9375rem)",
    lineHeight: 1.55,
    letterSpacing: "0",
  },
  label: {
    fontSize: "clamp(12px, 0.64rem + 0.18vw, 0.8125rem)",
    lineHeight: 1.4,
    letterSpacing: "0.08em",
  },
  small: {
    fontSize: "clamp(11px, 0.58rem + 0.15vw, 0.75rem)",
    lineHeight: 1.4,
    letterSpacing: "0.06em",
  },
  nav: {
    fontSize: "clamp(11px, 0.52rem + 0.14vw, 0.6875rem)",
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
  cardWidth: "min(82vw, clamp(19rem, 44vw, 30rem))",
  cardHeight: "clamp(26rem, 62vh, 36rem)",
  panelMinHeight: "clamp(14rem, 28vh, 20rem)",
  borderWidth: {
    divider: "1px",
    control: "2px",
    card: "2px",
  },
  radius: {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1.125rem",
  },
} as const;

/**
 * 모션 토큰 — 시그니처는 좌→우 가로 스윕, 곡선은 ease.out 한 계열이다.
 * 길이는 초(s) 단위 숫자라 `${duration}s`로 쓴다. 다크·라이트 공용이라 motionTokens로도 내보낸다.
 * 기존 키(micro·ui·section·hero, ease.*, offset.*)는 쓰는 곳이 있어 의미를 바꾸지 않는다.
 * 스크롤 리빌(reveal·text)은 0.7s로 짧게 둔다 — 동시에 도는 애니메이션 수(매 프레임 스타일 재계산)를 줄이고,
 * ease.out 꼬리라 줄어드는 건 거의 다 보이지 않는 안착 구간이다. 첫 화면 커튼(curtain·curtainText)은
 * 스플래시 퇴장과 맞춘 원래 길이를 따로 지킨다.
 */
const motion = {
  duration: {
    micro: 0.16,
    ui: 0.22,
    section: 0.45,
    hero: 0.55,
    /** 호버·포커스 롤, 밑줄 스윕, 화살표 */
    hover: 0.3,
    /** 블록 리빌(sweep·fade·stagger 자식)과 그 안의 장식 선 */
    reveal: 0.7,
    /** SweepText 어절 하나가 열리는 길이(sweep) */
    text: 0.7,
    /** 블록 커튼 — 첫 화면 이미지·블록 덮개가 걷히는 길이 */
    curtain: 0.8,
    /** 어절 커튼(SweepText curtain) — 첫 화면 제목·소개 문장 */
    curtainText: 0.9,
    /** 페이지 첫 제목처럼 큰 글자 — 1.4s를 넘기지 않는다 */
    title: 1.15,
  },
  /** 순차 등장 간격(s) — 한 그룹 누적은 max를 넘지 않게 간격을 줄인다 */
  stagger: {
    /** 함께 화면에 들어온 블록 사이 */
    item: 0.06,
    /** SweepText — 글자 폭 1em당 지연. 스윕 선이 일정한 속도로 줄을 훑는다 */
    perEm: 0.024,
    max: 0.45,
  },
  /** 리빌 시작 위치 — 왼쪽에서 이만큼 떨어져 제자리로 미끄러진다 */
  distance: {
    sweep: "1.25rem",
    word: "0.32em",
  },
  ease: {
    settle: [0.25, 0.1, 0.25, 1] as const,
    out: [0.16, 1, 0.3, 1] as const,
  },
  /** CSS에 바로 넣는 곡선 문자열 — ease.out과 같은 값 */
  curve: {
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  offset: {
    enterY: 16,
    enterX: 0,
  },
} as const;

export const motionTokens = motion;

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
  border: "rgba(255, 255, 255, 0.16)",
  borderStrong: "rgba(255, 255, 255, 0.28)",
  accent: "#a0ec06",
  accentSecondary: "#c8f54a",
  accentGradient: "linear-gradient(135deg, #a0ec06 0%, #c8f54a 100%)",
  accentContrast: "#000000",
  wash: "#0a0a0a",
  gridLine: "rgba(255, 255, 255, 0.035)",
  splashWash: "rgba(160, 236, 6, 0.06)",
} as const;

const lightColors = {
  background: "#f3f3f4",
  surface: "#ffffff",
  surfaceAlt: "#ebebec",
  text: "#0c0c0c",
  textMuted: "#5a5a5a",
  border: "rgba(0, 0, 0, 0.16)",
  borderStrong: "rgba(0, 0, 0, 0.26)",
  accent: "#4a7600",
  accentSecondary: "#3f6800",
  accentGradient: "linear-gradient(135deg, #4a7600 0%, #3f6800 100%)",
  accentContrast: "#ffffff",
  wash: "#ececed",
  gridLine: "rgba(0, 0, 0, 0.05)",
  splashWash: "rgba(111, 173, 0, 0.08)",
} as const;

/** 색 토큰 이름 — 다크·라이트 팔레트가 같은 키를 갖는다. */
export type ThemeColorKey = keyof typeof darkColors;

export type ThemeColors = Record<ThemeColorKey, string>;

/**
 * 모드별 원본 팔레트(리터럴 색). CSS 변수 값의 단일 출처다.
 * 컴포넌트는 theme.colors(변수)를 쓰고, 모드와 상관없이 고정 색이 필요한 곳(사진 위 다크 팔레트 등)만 직접 쓴다.
 */
export const palettes = {
  dark: darkColors,
  light: lightColors,
} as const satisfies Record<ThemeMode, ThemeColors>;

const colorKeys = Object.keys(darkColors) as ThemeColorKey[];

/** 색 토큰의 CSS 변수 이름 — background → --color-background, textMuted → --color-text-muted */
export const colorVarName = (key: ThemeColorKey) =>
  `--color-${key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;

/** 팔레트 하나를 CSS 변수 선언 문자열로 만든다 — `--color-background:#000000;…` (부트 CSS가 쓴다) */
export const paletteCssVars = (mode: ThemeMode) =>
  colorKeys
    .map((key) => `${colorVarName(key)}:${palettes[mode][key]};`)
    .join("");

/** Emotion 테마의 색 — 전부 var(--color-*) 참조라 SSR 결과가 모드와 무관하다. */
const colorVars = Object.fromEntries(
  colorKeys.map((key) => [key, `var(${colorVarName(key)})`])
) as ThemeColors;

const tokens = {
  fonts,
  typography,
  space,
  layout,
  motion,
  breakpoints,
};

export type AppTheme = {
  colors: ThemeColors;
  fonts: typeof fonts;
  typography: typeof typography;
  space: typeof space;
  layout: typeof layout;
  motion: typeof motion;
  breakpoints: typeof breakpoints;
};

/**
 * ThemeProvider가 주입하는 단 하나의 테마. 모드와 무관한 상수라 서버·클라이언트가 같은 클래스를 만들고,
 * 테마 전환 때도 바뀌지 않는다(모드별 값은 CSS 변수와 LIGHT_MODE 선택자가 맡는다).
 */
export const theme: AppTheme = {
  colors: colorVars,
  ...tokens,
};

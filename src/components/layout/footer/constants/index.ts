/**
 * 생성 이유: 푸터 문구·내비 항목·소셜 링크 라벨을 JSX에서 분리한다.
 * 역할: 푸터 브랜드·내비 랜드마크 이름·내비 항목과 소셜(GitHub·Velog) 링크 라벨 상수를 제공한다.
 * 책임: 푸터가 쓰는 문구의 단일 출처다(모든 라우트의 레이아웃 셸이 쓰므로 홈 화면 상수에 기대지 않는다 —
 *       기대면 홈 문구 모듈 전체가 모든 라우트의 레이아웃 번들에 실린다). URL은 SITE_CONFIG, 경로는 ROUTES가 단일 출처다.
 */
import { ROUTES } from "@/constants/routes";

export const FOOTER_UI = {
  /** 헤더 로고·GitHub/Velog 핸들과 같은 표기 */
  brand: "taejun0",
  navLabel: "푸터 메뉴",
} as const;

/** 푸터 보조 내비 — 헤더와 같은 순서의 세부 페이지 항목 */
export const FOOTER_NAV_ITEMS = [
  { href: ROUTES.MAIN, label: "Home" },
  { href: ROUTES.ABOUT, label: "About" },
  { href: ROUTES.PROJECTS, label: "Projects" },
  { href: ROUTES.BLOG, label: "Blog" },
] as const;

/** key는 SITE_CONFIG의 URL 키와 같다. 아이콘만 보이므로 ariaLabel이 링크 이름이 된다. */
export const FOOTER_SOCIALS = [
  {
    key: "github" as const,
    label: "GitHub",
    ariaLabel: "GitHub 프로필 (새 창)",
  },
  {
    key: "velog" as const,
    label: "Velog",
    ariaLabel: "Velog 블로그 (새 창)",
  },
] as const;

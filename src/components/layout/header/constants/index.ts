/**
 * 생성 이유: 헤더 문구와 네비게이션 항목을 JSX에서 분리한다.
 * 역할: 사이트 헤더가 사용하는 로고·링크 상수를 제공한다.
 * 책임: 세부 페이지가 있는 라우트만 헤더에 노출한다.
 */
import { ROUTES } from "@/constants/routes";

export const HEADER_UI = {
  logo: "Taejun0-portfolio",
  themeToggle: {
    toLight: "라이트 모드로 전환",
    toDark: "다크 모드로 전환",
  },
} as const;

/** 헤더 = 세부 페이지가 있는 항목만 */
export const HEADER_NAV_ITEMS = [
  {
    href: ROUTES.MAIN,
    label: "Home",
    match: "exact" as const,
  },
  {
    href: ROUTES.ABOUT,
    label: "About",
    match: "prefix" as const,
  },
  {
    href: ROUTES.PROJECTS,
    label: "Projects",
    match: "prefix" as const,
  },
  {
    href: ROUTES.BLOG,
    label: "Blog",
    match: "prefix" as const,
  },
] as const;

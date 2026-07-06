/**
 * 생성 이유: 헤더 문구와 네비게이션 항목을 JSX에서 분리한다.
 * 역할: 사이트 헤더가 사용하는 로고·링크 상수를 제공한다.
 * 책임: Thomas Eduardo식 중앙 캡슐 네비 항목과 섹션 id 매핑을 관리한다.
 */
import { ROUTES } from "@/constants/routes";

export const HEADER_UI = {
  logo: "ohtaejjun",
} as const;

export const HEADER_NAV_ITEMS = [
  {
    href: `${ROUTES.MAIN}#intro`,
    label: "Home",
    sectionId: "intro",
  },
  {
    href: `${ROUTES.MAIN}#about`,
    label: "About",
    sectionId: "about",
  },
  {
    href: `${ROUTES.MAIN}#projects`,
    label: "Projects",
    sectionId: "projects",
  },
  {
    href: ROUTES.BLOG,
    label: "Blog",
    sectionId: undefined,
  },
  {
    href: `${ROUTES.MAIN}#close`,
    label: "Contact",
    sectionId: "close",
  },
] as const;

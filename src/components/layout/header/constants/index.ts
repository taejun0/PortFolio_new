/**
 * 생성 이유: 헤더 문구와 네비게이션 항목을 JSX에서 분리한다.
 * 역할: 사이트 헤더가 사용하는 로고·링크·본문 바로가기 상수를 제공한다.
 * 책임: 세부 페이지가 있는 라우트만 헤더에 노출한다.
 *       로고는 푸터 브랜드·GitHub/Velog 핸들과 같은 표기(taejun0)를 쓴다.
 *       본문 바로가기 대상 id(MAIN_CONTENT_ID)는 사이트 셸의 main과 이 헤더가 함께 쓰는 단일 출처다.
 */
import { ROUTES } from "@/constants/routes";

/** 사이트 셸 main의 id — 헤더의 본문 바로가기(#main)가 이 요소로 포커스를 옮긴다. */
export const MAIN_CONTENT_ID = "main";

export const HEADER_UI = {
  /** 첫 Tab 정거장 — 헤더 링크 6개를 건너뛰고 본문으로 간다. */
  skipToContent: "본문으로 건너뛰기",
  logo: "taejun0",
  /**
   * 로고 뒤에 시각적으로만 숨겨 붙이는 설명 — 링크 이름이 "taejun0 홈으로 이동"이 된다(텍스트만으로는 홈 이동임이 드러나지 않음).
   * aria-label 대신 내용으로 이름을 만들어, 보이는 글자가 이름 앞에 그대로 들어간다(음성 명령·label-content-name-mismatch).
   */
  logoHint: "홈으로 이동",
  navLabel: "주요 메뉴",
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

/**
 * 생성 이유: 라우트 경로를 문자열 하드코딩 없이 한곳에서 참조한다.
 * 역할: 사이트 전역 경로 상수와 동적 경로 헬퍼를 제공한다.
 * 책임: 페이지·네비게이션·링크에서 사용하는 URL 패턴의 단일 출처를 유지한다.
 */
export const ROUTES = {
  MAIN: "/",
  PROJECTS: "/projects",
  BLOG: "/blog",
} as const;

export const projectDetailPath = (slug: string) =>
  `${ROUTES.PROJECTS}/${slug}` as const;

export const blogDetailPath = (slug: string) =>
  `${ROUTES.BLOG}/${slug}` as const;

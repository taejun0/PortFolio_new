/**
 * 생성 이유: 사이트 메타·연락처·블로그 소스 설정의 하드코딩을 막는다.
 * 역할: 메타데이터와 블로그(마크다운+Discussions)·Giscus 설정의 단일 출처다.
 * 책임: PortfolioPage 원본 연락 정보와 Discussions 기반 신규 글 카테고리를 관리한다.
 */
export const SITE_CONFIG = {
  origin: "https://www.taejun0-portfolio.site",
  name: "오태준 포트폴리오",
  title: "Taejun's PortFolio",
  description:
    "프론트엔드 개발자 오태준의 프로젝트, 스킬, 기술 블로그를 소개하는 포트폴리오 사이트입니다.",
  author: "오태준",
  email: "xownswns@naver.com",
  github: "https://github.com/taejun0",
  githubPath: "github.com/taejun0",
  velog: "https://velog.io/@taejun0/posts",
} as const;

/**
 * 기존 글: content/blog 마크다운.
 * 신규 글: GitHub Discussions의 Blog 카테고리 이슈를 목록·상세에 병합한다.
 * 댓글: Giscus(Discussions Announcements 등) — 본문 소스와 분리.
 */
export const BLOG_DISCUSSIONS_CONFIG = {
  repo: "taejun0/PortFolio_new" as `${string}/${string}`,
  /** Discussions에서 블로그 본문으로 쓸 카테고리 이름 */
  category: "Blog",
  slugPrefix: "d-",
} as const;

/**
 * Giscus(GitHub Discussions 댓글) 연동 값.
 * 레포 Discussions 활성화 및 giscus 앱 설치 후 repo/category id를 채운다.
 */
export const GISCUS_CONFIG = {
  repo: "taejun0/PortFolio_new" as `${string}/${string}`,
  repoId: "",
  category: "Announcements",
  categoryId: "",
  mapping: "pathname" as const,
  theme: "dark",
  lang: "ko",
};

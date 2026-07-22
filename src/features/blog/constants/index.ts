/**
 * 생성 이유: 블로그 페이지 문구를 JSX에서 분리한다.
 * 역할: 목록·상세·Velog·Discussions 안내 UI 카피 상수다.
 * 책임: PortfolioPage 기준 정적 문구와 신규 Discussions 작성 안내를 관리한다.
 */
export const BLOG_DATE_FORMAT = "yyyy년 M월 d일" as const;

/** Velog에 먼저 작성된 글 수. 포트폴리오·Discussions 글 번호는 이어서 매깁니다. */
export const BLOG_LEGACY_VELOG_POST_COUNT = 51;

export const formatBlogPostNumber = (index: number, total: number) =>
  String(BLOG_LEGACY_VELOG_POST_COUNT + (total - index)).padStart(2, "0");

export const BLOG_PAGE_UI = {
  label: "Blog",
  title: "My Blog",
  subtitle: "제가 작성한 기술 블로그 글을 모아볼 수 있습니다",
  empty: "작성된 글이 없습니다.",
  backToList: "목록으로",
  commentsHeading: "Comments",
  discussionLink: "GitHub Discussion에서 보기 →",
  discussionCommentsHint: "댓글은 GitHub Discussion에서 이어갈 수 있습니다 →",
  discussionsHint:
    "새 글은 GitHub Discussions의 Blog 카테고리에 올리면 이 목록에 자동으로 반영됩니다.",
  giscusNotConfigured:
    "Giscus repo/category id를 siteConfig에 설정하면 댓글이 활성화됩니다.",
} as const;

export const BLOG_VELOG_NOTICE_UI = {
  cutoffDate: "2026-01-02",
  withCutoff: " 까지의 기술 블로그는 Velog에서 작성되었습니다. ",
  legacy: "이전의 기술 블로그는 Velog에서 작성되었습니다. ",
  link: "Velog에서 보기 →",
} as const;

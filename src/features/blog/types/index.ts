/**
 * 생성 이유: 블로그 글 메타·본문 타입을 feature 전역에서 공유한다.
 * 역할: 블로그 도메인 타입 정의다.
 * 책임: 마크다운·Discussions 출처를 포함한 동일 글 형태를 정의한다.
 */
export type BlogPostSource = "markdown" | "discussion";

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  series?: string;
  thumbnail?: string;
  source: BlogPostSource;
  discussionNumber?: number;
  discussionUrl?: string;
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};

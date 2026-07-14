/**
 * 생성 이유: 마크다운·Discussions 글을 하나의 블로그 목록·상세 API로 제공한다.
 * 역할: content/blog + GitHub Discussions(Blog) 통합 블로그 데이터 서비스다.
 * 책임: 파일 스캔, frontmatter 파싱, Discussions 병합, 마크다운→HTML, slug 조회.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import type { BlogPost, BlogPostMeta } from "../types";
import {
  getDiscussionPostBySlug,
  getDiscussionPostsMeta,
  getDiscussionSlugs,
  isDiscussionSlug,
} from "./discussions";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

const ensureBlogDir = () => {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
};

const readPostFile = (slug: string) => {
  const indexPath = path.join(BLOG_DIR, slug, "index.md");
  const flatPath = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(indexPath)) return fs.readFileSync(indexPath, "utf8");
  if (fs.existsSync(flatPath)) return fs.readFileSync(flatPath, "utf8");
  return null;
};

const listMarkdownSlugs = (): string[] => {
  ensureBlogDir();
  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isDirectory()) {
        const indexPath = path.join(BLOG_DIR, entry.name, "index.md");
        return fs.existsSync(indexPath) ? [entry.name] : [];
      }
      if (
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        entry.name !== "README.md" &&
        entry.name !== "TEMPLATE.md"
      ) {
        return [entry.name.replace(/\.md$/, "")];
      }
      return [];
    });
};

const toMeta = (slug: string, data: Record<string, unknown>): BlogPostMeta => ({
  slug,
  title: String(data.title ?? slug),
  date: String(data.date ?? ""),
  description: String(data.description ?? ""),
  tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  series: data.series ? String(data.series) : undefined,
  thumbnail: data.thumbnail ? String(data.thumbnail) : undefined,
  source: "markdown",
});

const markdownToHtml = async (markdown: string) => {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return String(result);
};

const sortByDateDesc = <T extends { date: string }>(posts: T[]) =>
  [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getAllBlogPosts = async (): Promise<BlogPostMeta[]> => {
  const markdownPosts = await Promise.all(
    listMarkdownSlugs().map(async (slug) => {
      const raw = readPostFile(slug);
      if (!raw) return null;
      const { data } = matter(raw);
      return toMeta(slug, data as Record<string, unknown>);
    })
  );

  const discussionPosts = await getDiscussionPostsMeta();

  return sortByDateDesc([
    ...markdownPosts.filter((post): post is BlogPostMeta => post !== null),
    ...discussionPosts,
  ]);
};

export const getRecentBlogPosts = async (limit = 3) => {
  const posts = await getAllBlogPosts();
  return posts.slice(0, limit);
};

export const getBlogPostBySlug = async (
  slug: string
): Promise<BlogPost | null> => {
  if (isDiscussionSlug(slug)) {
    return getDiscussionPostBySlug(slug);
  }

  const raw = readPostFile(slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  const contentHtml = await markdownToHtml(content);
  return {
    ...toMeta(slug, data as Record<string, unknown>),
    contentHtml,
  };
};

export const getAllBlogSlugs = async () => {
  const discussionSlugs = await getDiscussionSlugs();
  return [...listMarkdownSlugs(), ...discussionSlugs];
};

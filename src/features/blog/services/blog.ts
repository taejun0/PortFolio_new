/**
 * 생성 이유: 마크다운·Discussions 글을 하나의 블로그 목록·상세 API로 제공한다.
 * 역할: content/blog + GitHub Discussions(Blog) 통합 블로그 데이터 서비스다.
 * 책임: 비동기 파일 스캔, frontmatter 검증, Discussions 병합, 마크다운→HTML, slug 조회.
 */
import { readFile, readdir } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

import type { BlogPost, BlogPostMeta } from "../types";
import { markdownToHtml } from "../utils/markdown";
import {
  getDiscussionPostBySlug,
  getDiscussionPostsMeta,
  getDiscussionSlugs,
  isDiscussionSlug,
} from "./discussions";

const BLOG_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "content",
  "blog"
);

const isFileSystemError = (error: unknown, code: string) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === code;

const readPostFile = async (slug: string) => {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(slug)) return null;

  const candidates = [
    path.join(/*turbopackIgnore: true*/ BLOG_DIR, slug, "index.md"),
    path.join(/*turbopackIgnore: true*/ BLOG_DIR, `${slug}.md`),
  ];

  for (const filePath of candidates) {
    try {
      return await readFile(/* turbopackIgnore: true */ filePath, "utf8");
    } catch (error) {
      if (!isFileSystemError(error, "ENOENT")) throw error;
    }
  }

  return null;
};

const listMarkdownSlugs = async (): Promise<string[]> => {
  try {
    const entries = await readdir(/* turbopackIgnore: true */ BLOG_DIR, {
      withFileTypes: true,
    });
    const slugs = await Promise.all(
      entries.map(async (entry) => {
        if (entry.isDirectory()) {
          const indexPath = path.join(
            /*turbopackIgnore: true*/ BLOG_DIR,
            entry.name,
            "index.md"
          );
          try {
            await readFile(/* turbopackIgnore: true */ indexPath, "utf8");
            return entry.name;
          } catch (error) {
            if (isFileSystemError(error, "ENOENT")) return null;
            throw error;
          }
        }
        if (
          entry.isFile() &&
          entry.name.endsWith(".md") &&
          entry.name !== "README.md" &&
          entry.name !== "TEMPLATE.md"
        ) {
          return entry.name.replace(/\.md$/, "");
        }
        return null;
      })
    );
    return slugs.filter((slug): slug is string => slug !== null);
  } catch (error) {
    if (isFileSystemError(error, "ENOENT")) return [];
    throw error;
  }
};

const requireText = (
  slug: string,
  data: Record<string, unknown>,
  key: "title" | "date" | "description"
) => {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid blog frontmatter: ${slug}.${key}`);
  }
  return value.trim();
};

const optionalText = (value: unknown) =>
  typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : undefined;

const toMeta = (slug: string, data: Record<string, unknown>): BlogPostMeta => {
  const date = requireText(slug, data, "date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid blog frontmatter date: ${slug}.${date}`);
  }
  if (
    data.tags !== undefined &&
    (!Array.isArray(data.tags) ||
      data.tags.some((tag) => typeof tag !== "string" || tag.trim() === ""))
  ) {
    throw new Error(`Invalid blog frontmatter tags: ${slug}`);
  }

  return {
    slug,
    title: requireText(slug, data, "title"),
    date,
    description: requireText(slug, data, "description"),
    tags: Array.isArray(data.tags) ? data.tags.map((tag) => tag.trim()) : [],
    series: optionalText(data.series),
    thumbnail: optionalText(data.thumbnail),
    source: "markdown",
  };
};

const sortByDateDesc = <T extends { date: string }>(posts: T[]) =>
  [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getAllBlogPosts = async (): Promise<BlogPostMeta[]> => {
  const slugs = await listMarkdownSlugs();
  const markdownPosts = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readPostFile(slug);
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

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  if (isDiscussionSlug(slug)) {
    return getDiscussionPostBySlug(slug);
  }

  const raw = await readPostFile(slug);
  if (!raw) return null;
  const { data, content } = matter(raw);
  const contentHtml = await markdownToHtml(content);
  return {
    ...toMeta(slug, data as Record<string, unknown>),
    contentHtml,
  };
});

export const getAllBlogSlugs = async () => {
  const [markdownSlugs, discussionSlugs] = await Promise.all([
    listMarkdownSlugs(),
    getDiscussionSlugs(),
  ]);
  return [...markdownSlugs, ...discussionSlugs];
};

/**
 * 생성 이유: /blog 경로를 Blog feature에 연결한다.
 * 역할: 블로그 목록 라우트 진입점이다.
 * 책임: 글 목록을 읽어 BlogPage에 전달한다.
 */
import type { Metadata } from "next";

import BlogPage from "@/features/blog/BlogPage";
import { getAllBlogPosts } from "@/features/blog/services/blog";

export const metadata: Metadata = {
  title: "Blog",
};

export const revalidate = 60;

export default async function Page() {
  const posts = await getAllBlogPosts();
  return <BlogPage posts={posts} />;
}

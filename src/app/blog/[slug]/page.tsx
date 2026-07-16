/**
 * 생성 이유: /blog/[slug] 동적 경로를 상세 feature에 연결한다.
 * 역할: 블로그 상세 라우트 진입점이다.
 * 책임: 마크다운·Discussions slug로 글을 읽고 없으면 404를 낸다.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BlogDetailPage from "@/features/blog/components/detail/BlogDetailPage";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
} from "@/features/blog/services/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export const generateStaticParams = async () => {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  return {
    title: post?.title ?? "Blog",
    description: post?.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();
  return <BlogDetailPage post={post} />;
}

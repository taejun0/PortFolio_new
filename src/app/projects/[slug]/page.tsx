/**
 * 생성 이유: /projects/[slug] 동적 경로를 상세 feature에 연결한다.
 * 역할: 프로젝트 상세 라우트 진입점이다.
 * 책임: slug 검증, 정적 경로 생성, ProjectDetailPage 연결을 담당한다.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetailPage from "@/features/projects/components/detail/ProjectDetailPage";
import {
  PROJECTS,
  getProjectBySlug,
} from "@/features/projects/constants/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () =>
  PROJECTS.map((project) => ({ slug: project.slug }));

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return {
    title: project?.title ?? "Project",
    description: project?.summary,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectDetailPage project={project} />;
}

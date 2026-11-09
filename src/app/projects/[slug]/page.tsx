/**
 * 생성 이유: /projects/[slug] 동적 경로를 상세 feature에 연결한다.
 * 역할: 프로젝트 상세 라우트 진입점(서버 컴포넌트)이다.
 * 책임: slug 검증, 정적 경로 생성, 목록 내 순번·총수·다음 프로젝트 요약 계산, ProjectDetailPage 연결을 담당한다.
 *       순번·다음 카드를 서버에서 정해 넘기므로 상세 클라이언트 번들에는 이 프로젝트 원문과 다음 카드 요약만 실린다
 *       (다른 프로젝트 전체 원문이 실리지 않는다).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectDetailPage, {
  type NextProject,
} from "@/features/projects/components/detail/ProjectDetailPage";
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

  const position = Math.max(
    PROJECTS.findIndex((item) => item.slug === project.slug),
    0
  );
  const total = PROJECTS.length;
  const following = PROJECTS[(position + 1) % total];
  // 프로젝트가 하나뿐이면 다음 카드는 자기 자신이라 두지 않는다.
  const next: NextProject | null =
    following && following.slug !== project.slug
      ? {
          slug: following.slug,
          title: following.title,
          summary: following.summary,
          image: following.image,
        }
      : null;

  return (
    <ProjectDetailPage
      project={project}
      position={position}
      total={total}
      next={next}
    />
  );
}

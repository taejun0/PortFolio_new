/**
 * 생성 이유: /projects 경로를 Projects feature에 연결한다.
 * 역할: 프로젝트 목록 라우트 진입점(서버 컴포넌트)이다.
 * 책임: 메타데이터 정의, PROJECTS → 목록 카드(ProjectCard) 변환, ProjectsPage 렌더링을 담당한다.
 *       변환을 서버에서 해 카드에 보이는 필드만 클라이언트로 넘긴다 — 프로젝트 전체 원문은 번들에 실리지 않는다.
 */
import type { Metadata } from "next";

import ProjectsPage, { type ProjectCard } from "@/features/projects/ProjectsPage";
import {
  PROJECTS_PAGE_UI,
  extractProjectYear,
} from "@/features/projects/constants";
import {
  PROJECTS,
  type Project,
} from "@/features/projects/constants/projects";

export const metadata: Metadata = {
  title: "Projects",
};

/** 카드 메타: 짧은 기간(없으면 연도)·진행 형태 문구·첫 Challenge의 배운 점(없으면 해결). */
const toProjectCard = (project: Project): ProjectCard => ({
  slug: project.slug,
  title: project.title,
  summary: project.summary,
  image: project.image,
  imageMatte: project.imageMatte,
  role: project.role,
  period: project.periodShort ?? extractProjectYear(project.period),
  kind: project.kind ? PROJECTS_PAGE_UI.kindLabel[project.kind] : null,
  takeaway:
    project.challenges[0]?.learnings ?? project.challenges[0]?.solution ?? "",
});

export default function Page() {
  return <ProjectsPage projects={PROJECTS.map(toProjectCard)} />;
}

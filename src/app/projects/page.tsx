/**
 * 생성 이유: /projects 경로를 Projects feature에 연결한다.
 * 역할: 프로젝트 목록 라우트 진입점이다.
 * 책임: 메타데이터 정의와 ProjectsPage 렌더링만 담당한다.
 */
import type { Metadata } from "next";

import ProjectsPage from "@/features/projects/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects",
};

export default function Page() {
  return <ProjectsPage />;
}

/**
 * 생성 이유: 루트 URL과 메인 페이지 기능을 연결한다.
 * 역할: App Router의 `/` 라우트 진입점(서버 컴포넌트)이다.
 * 책임: MainPage를 연결하는 얇은 계층을 유지하고, Featured 책장이 그리는 필드(slug·제목·요약·표지)만
 *       서버에서 골라 넘긴다 — 프로젝트 전체 데이터(개요·의사결정·역할·도전 과제)가 홈 클라이언트 번들과
 *       RSC 페이로드에 실리지 않는다.
 */
import MainPage from "@/features/main/MainPage";
import type { ShelfProject } from "@/features/main/components/projects/projectShelfItem/ProjectShelfItem";
import { getFeaturedProjects } from "@/features/projects/constants/projects";

export default function Page() {
  const projects: ShelfProject[] = getFeaturedProjects().map(
    ({ slug, title, summary, image, role, featuredStory }) => ({ slug, title, summary, image, role, featuredStory })
  );

  return <MainPage projects={projects} />;
}

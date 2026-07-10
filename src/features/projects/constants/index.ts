/**
 * 생성 이유: 프로젝트 페이지 카피를 JSX에서 분리한다.
 * 역할: 목록·상세 UI 문구 상수를 제공한다.
 * 책임: projects feature의 정적 문구만 관리한다.
 */
export const PROJECTS_PAGE_UI = {
  label: "Projects",
  title: "Projects",
  empty: "등록된 프로젝트가 없습니다.",
  backToList: "목록으로",
  decisionsHeading: "기술적 의사결정",
  rolesHeading: "담당 역할",
  challengesHeading: "Challenge & Solution",
  problemLabel: "문제",
  solutionLabel: "해결",
  learningsLabel: "배운 점",
} as const;

/**
 * 생성 이유: 프로젝트 페이지 카피를 JSX에서 분리한다.
 * 역할: 목록·상세 UI 문구 상수를 제공한다.
 * 책임: projects feature의 정적 문구만 관리한다.
 */
export const PROJECTS_PAGE_UI = {
  label: "Portfolio · Case studies",
  title: "Featured projects",
  subtitle:
    "팀·솔로·해커톤에서 실제로 마주친 문제를 풀며 만든 프로젝트들입니다.",
  empty: "등록된 프로젝트가 없습니다.",
  resultLabel: "Result",
  galleryLabel: "Stack",
  viewProject: "View project",
  featuredBadge: "Featured",
  backToList: "← Projects",
  viewGithub: "GitHub",
  viewDemo: "Live demo",
  decisionsHeading: "기술적 의사결정",
  rolesHeading: "담당 역할",
  challengesHeading: "Challenge & Solution",
  problemLabel: "문제",
  solutionLabel: "해결",
  learningsLabel: "배운 점",
} as const;

export const extractProjectYear = (period: string) => {
  const match = period.match(/20\d{2}/);
  return match?.[0] ?? "";
};

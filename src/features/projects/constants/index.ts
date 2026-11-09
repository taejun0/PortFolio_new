/**
 * 생성 이유: 프로젝트 페이지 카피를 JSX에서 분리한다.
 * 역할: 목록·상세 UI 문구(보조기기 전용 안내 포함) 상수와 기간 표기 헬퍼를 제공한다.
 * 책임: projects feature의 정적 문구만 관리한다. 서버 라우트(목록 카드 변환)와 클라이언트 화면이 함께 쓴다.
 */
export const PROJECTS_PAGE_UI = {
  label: "Portfolio · Case studies",
  title: "Featured projects",
  subtitle:
    "팀·솔로·해커톤에서 실제로 마주친 문제를 풀며 만든 프로젝트들입니다.",
  empty: "등록된 프로젝트가 없습니다.",
  resultLabel: "Result",
  /** 목록 카드 하단 라벨 — 카드는 첫 Challenge의 배운 점(learnings)을 보여 준다. */
  takeawayLabel: "Takeaway",
  /** 카드 메타의 진행 형태 표기(Project.kind). */
  kindLabel: {
    team: "Team",
    solo: "Solo",
    hackathon: "Hackathon",
  },
  galleryLabel: "Stack",
  viewProject: "View project",
  featuredBadge: "Featured",
  backToList: "← Projects",
  viewGithub: "GitHub",
  viewDemo: "Live demo",
  /** 새 탭으로 여는 외부 링크 이름 끝에 붙는 보이지 않는 안내(푸터·Velog 링크와 같은 문구). */
  newTab: "(새 창)",
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

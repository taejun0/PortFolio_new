/**
 * 생성 이유: 케이스 스터디(프로젝트 상세)에서 새로 쓰는 문구를 JSX에서 분리한다.
 * 역할: 메타 스트립·목차·섹션 라벨·Challenge 카드·다음 프로젝트 내비 문구 상수를 제공한다.
 * 책임: 상세 전용 정적 문구만 관리한다. 목록과 공유하는 기존 라벨은 PROJECTS_PAGE_UI가 소유한다.
 */
export const PROJECT_DETAIL_UI = {
  eyebrow: "Case study",
  meta: {
    period: "Period",
    role: "Role",
    team: "Team",
    stack: "Stack",
  },
  /** 팀 구성 태그 — Team 칸이 이미 보여 주므로 Stack 칸에서는 뺀다. */
  teamTags: ["Team", "Solo"],
  toc: {
    label: "On this page",
  },
  /** 섹션 앵커 id·영문 라벨. 제목은 개요만 여기서, 나머지는 PROJECTS_PAGE_UI를 쓴다. */
  sections: {
    overview: { id: "overview", label: "Overview", title: "프로젝트 개요" },
    decisions: { id: "decisions", label: "Decisions" },
    roles: { id: "roles", label: "Responsibilities" },
    challenges: { id: "challenges", label: "Troubleshooting" },
  },
  challengeKicker: "Challenge",
  next: {
    ariaLabel: "프로젝트 이동",
    label: "Next project",
    allProjects: "All projects",
  },
} as const;

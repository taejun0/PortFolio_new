/**
 * 생성 이유: About 상세 페이지 카피를 JSX에서 분리한다.
 * 역할: /about Thomas식 자기소개 페이지 상수다.
 * 책임: PortfolioPage About 원문(Journey·Philosophy) 기준으로 프로필·궤적·접근을 관리한다.
 */
export const ABOUT_PAGE_UI = {
  profile: {
    eyebrow: "About",
    nameLines: ["Oh", "Taejun"],
    taglineBefore: "Frontend Developer · 웹으로 표현하고 소통하는 ",
    taglineEmphasis: "개발자.",
    profileLabel: "Profile",
    profileTitle: "집단의 IQ는, 공유되는 정보에서 만든다.",
    paragraphs: [
      "아무리 뛰어난 개인이 있더라도, 구성원들 간 대화가 없다면 팀 전체의 성장이 어려워지게 됩니다. 저는 아는 것을 나누고, 의견을 경청하며 함께 나아가는 흐름을 만듭니다.",
      "프론트엔드로 사용자와 팀을 잇는 일을 합니다. 보이는 것 이상의 소통과 협업을 기준으로 프로덕트를 설계합니다.",
    ],
    primaryCta: "Contact →",
    primaryHref: "/#close",
    secondaryCta: "How I work →",
    secondaryHref: "#approach",
    photo: "/images/myimage/1.png",
    photoAlt: "오태준 프로필 사진",
    photoRole: "Frontend oriented Developer",
    photoMeta: "UIJEONGBU, KR · AVAILABLE",
  },
  marquee: {
    label: "Tools & Partners in craft",
    items: [
      "JavaScript",
      "React",
      "Next.js",
      "Spring Boot",
      "Docker",
      "Emotion",
      "Figma",
      "GitHub",
      "Notion",
      "Jest",
      "Playwright",
      "Storybook",
    ],
  },
  approach: {
    label: "Approach",
    title: "Development Philosophy",
    id: "approach",
    cards: [
      {
        index: "01",
        title: "소통",
        paragraphs: [
          "프론트엔드는 사용자와 가장 먼저 마주하는 영역이며, '보이는 것' 그 이상의 의미를 가진다고 생각합니다.",
          "저는 D-Order라는 축제 주문 시스템 프로젝트에서 사용자 흐름을 기반으로 UI/UX를 설계했습니다. 테이블 이용료처럼 예외 조건이 많은 로직도 자연스럽게 안내할 수 있도록 구성했고, 장바구니나 모달 인터랙션 또한 흐름을 끊지 않도록 고민했습니다.",
          "하지만 진짜 소통은 사용자뿐 아니라 팀원 간의 커뮤니케이션에서도 빛난다고 믿습니다. 짧은 개발 기간 동안 API 명세를 실시간으로 문서화하고 공유한 경험은 작업 오류를 최소화하는 동시에, 개발 속도를 높여주었습니다.",
          "\"모른다\"고 말하는 것을 주저하지 않고, 이해를 바탕으로 함께 설계하는 태도는 제가 가장 자랑스러워하는 역량 중 하나입니다.",
        ],
      },
      {
        index: "02",
        title: "협업",
        paragraphs: [
          "저는 멋쟁이사자처럼 13기에서 프론트엔드 트랙장과 홍보팀장을 맡으며 팀원들의 성장을 이끄는 역할도 수행했습니다.",
          "개발을 늦게 시작했기에 누구보다 배우는 입장에서 출발했고, 그래서 더 깊이 공감할 수 있는 팀원이었습니다.",
          "질문을 주고받고, 아이디어를 조율하며, 모두가 납득할 수 있는 결과를 만들어가는 과정을 소중히 여기며 팀워크를 다져왔습니다.",
          "그 결과, 실력뿐 아니라 소통과 협업을 통해 프로젝트를 끝까지 완수하는 경험을 여러 차례 쌓을 수 있었고, 이는 다양한 개발 환경에서의 유연한 태도와 리더십으로 이어졌습니다.",
        ],
      },
      {
        index: "03",
        title: "경험",
        paragraphs: [
          "기능이 동작하는 UI보다, 사용자가 머무르고 싶어지는 경험을 설계하는 것이 제가 추구하는 프론트엔드입니다.",
          "AI 기반 훈련 시스템에서는 단순한 카운트 측정에 그치지 않고, 실시간 피드백·훈련 종료 요약·이력 조회까지 하나의 사용자 흐름으로 구성했습니다.",
          "이러한 경험 중심의 개발은 단순히 기술을 사용하는 것이 아닌, 사용자의 입장에서 시뮬레이션하고 고민하는 사고방식에서 비롯된다고 생각합니다.",
          "저는 한 줄의 문구, 한 픽셀의 여백도 이유 없이 두지 않으려 노력합니다. 그리고 그 태도는 앞으로도 변하지 않을 것입니다.",
        ],
      },
    ],
  },
  trajectory: {
    label: "Trajectory",
    title: "경험과 배움",
    subtitle: "저를 만들어 온 경험을 간단히 정리했습니다.",
    items: [
      {
        period: "2020",
        title: "동국대학교 입학",
        points: [
          "다빈치, 공학교육혁신센터 선발",
          "코로나19로 인한 비대면 학기 경험",
        ],
      },
      {
        period: "2021",
        title: "CAPS 34기 · 다빈치 프로그램",
        points: [
          "학술 창업 동아리 CAPS 기획부원 — HTML/CSS 스터디",
          "IoT 스마트 메이커스 프로그램 수료",
          "동국대 코테 대비 캠프 수료",
        ],
        keywords: ["HTML", "CSS", "IoT"],
      },
      {
        period: "2022 — 2023",
        title: "군 복무",
        points: ["병장 만기 전역", "서비스 정신과 책임감을 되새긴 시간"],
      },
      {
        period: "2024",
        title: "멋쟁이사자처럼 12기 · DB 드림리더",
        points: [
          "프론트엔드 트랙원 및 홍보팀장",
          "교내 해커톤 ‘심바톤’ 2등상",
          "멋사 중앙해커톤 참가 · 4호선톤 입선(5위)",
          "DB 드림리더 — ESG 환경 문제 도출·솔루션",
        ],
        keywords: ["React", "JavaScript", "Node.js"],
      },
      {
        period: "2025",
        title: "멋쟁이사자처럼 13기",
        points: [
          "프론트엔드 트랙장",
          "D-Order 프론트 팀장 — 축제 부스 운영 플랫폼",
          "(주) 서큘러스 프리랜서 — WCRC 로봇대회 멘토링·교육 콘텐츠",
          "한국통신학회 하계학술발표회 아이디어경진대회 후원업체상",
        ],
        keywords: ["Leadership", "TypeScript", "Next.js"],
      },
      {
        period: "2025.10 — 2025.12",
        title: "항해99 · 스파르타코딩클럽",
        points: [
          "동료들과 함께하는 집중 학습 — 알고리즘·CS 기초와 문제 풀이 루틴",
          "팀 프로젝트와 코드 리뷰로 협업·피드백 경험",
          "SSAFY 입학 전 개발 역량과 학습 습관 정립",
        ],
        keywords: ["Algorithm", "CS", "Collaboration"],
      },
      {
        period: "2026",
        title: "Samsung SW Academy For Youth (SSAFY)",
        points: [
          "알고리즘 학습을 루틴으로 만들고 문제 해결 역량 강화",
          "백엔드 전반(설계·API·DB)으로 서비스 관점 확장",
          "AI 분야까지 학습 범위를 넓혀 실전 적용 준비",
        ],
        keywords: ["Algorithm", "Backend", "AI"],
        badge: "진행 중",
      },
      {
        period: "2026.07 — 2026.10",
        title: "OSSCA 2026",
        points: [
          "실제 전문가와 함께하는 오픈소스 컨트리뷰션 경험",
        ],
        keywords: ["Open Source", "Contribution", "Collaboration"],
        badge: "진행 중",
      },
    ],
  },
  tools: {
    label: "Stack",
    title: "주요 기술 스택",
    asideHref: "/#stack",
    aside: "실제 프로젝트에서 사용해온 기술들입니다.",
  }
} as const;

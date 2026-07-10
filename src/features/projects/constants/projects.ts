/**
 * 생성 이유: 프로젝트 목록·상세·메인 Featured가 같은 데이터를 공유해야 한다.
 * 역할: 포트폴리오 프로젝트 엔트리의 타입과 정적 데이터 소스다.
 * 책임: PortfolioPage projectData/FeaturedProjects 기준으로 slug 조회와 featured 필터 데이터를 관리한다.
 */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  period: string;
  role: string;
  tags: string[];
  featured: boolean;
  image: string;
  overview: string;
  decisions: string[];
  roles: string[];
  challenges: { problem: string; solution: string; learnings: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "d-order",
    title: "D-Order",
    summary:
      "축제/행사 현장 주문·운영 플랫폼. QR 테이블 입장 + 장바구니·송금 확인 흐름, WebSocket 실시간 반영.",
    period: "2025.05 ~ (개선/운영 지속)",
    role: "Frontend Lead",
    tags: ["Team", "React", "TypeScript", "Zustand", "MVP 설계"],
    featured: true,
    image: "/images/projectsImage/D-order.webp",
    overview:
      "D-order는 축제 부스 현장에서 발생하는 주문·결제·서빙·정산의 불편함을 디지털로 해결하는 운영지원 서비스입니다. Customer/Admin/Server 웹을 분리하고 WebSocket으로 주문·테이블·직원 호출을 실시간 동기화했습니다.",
    decisions: [
      "React + TypeScript로 역할별 UI를 타입 안정적으로 분리",
      "WebSocket + Redis Pub/Sub로 실시간 이벤트 전파",
      "서버를 장바구니·주문 상태의 단일 출처로 둠",
      "Heartbeat/Reconnect로 현장 네트워크 변동에 대응",
    ],
    roles: [
      "Frontend Lead로 Customer/Admin/Server 전반의 흐름 설계",
      "장바구니·주문·결제 흐름과 화면 간 상태 관리 아키텍처 설계",
      "권한 범위 분리를 위한 WebSocket 채널 설계",
      "2주 내 MVP 협업을 위한 개발 기준·문서화 주도",
    ],
    challenges: [
      {
        problem:
          "모바일 CPU slowdown 조건에서 radial-gradient + blur 배경이 GPU 과부하를 유발하며 프레임 저하가 발생했습니다.",
        solution:
          "DevTools로 재현한 뒤 배경을 이미지화하고 transform 중심 구성으로 전환해 composite 단계에서 처리되게 했습니다.",
        learnings:
          "모바일 성능 이슈는 ‘어떤 조건에서 깨지는가’를 재현하는 것부터가 문제 해결의 시작입니다.",
      },
    ],
  },
  {
    slug: "portfolio",
    title: "포트폴리오 페이지",
    summary:
      "Emotion 기반 스타일 시스템, Next.js SSR, 애니메이션과 섹션 스크롤로 시각적 몰입을 강화한 개인 포트폴리오.",
    period: "2025.07",
    role: "기획, 디자인, 개발",
    tags: ["Solo", "React", "TypeScript", "emotion", "NextJs"],
    featured: true,
    image: "/images/projectsImage/PortFolio.webp",
    overview:
      "React, TypeScript, Next.js를 기반으로 한 포트폴리오 웹사이트입니다. Emotion과 스크롤 모션으로 프론트엔드 개발자로서의 저를 소개합니다.",
    decisions: [
      "App Router로 중첩 레이아웃·서버/클라이언트 경계를 정리",
      "블로그 본문은 마크다운, 댓글은 GitHub Discussions(Giscus)",
      "페이지 맵을 메인 서사 + 상세 라우트로 분리",
    ],
    roles: ["UX 기획, UI 디자인, Next.js 기반 구현 및 배포"],
    challenges: [
      {
        problem:
          "Lighthouse Performance·SEO가 낮게 측정되어 사용자 경험과 검색 노출을 개선할 필요가 있었습니다.",
        solution:
          "메타·OG 구성, 리디렉션 정책 정리, WebP·next/image·LCP 우선순위로 점진 최적화했습니다.",
        learnings:
          "성능·SEO는 지표가 아니라 UX에 직결되며, 코드뿐 아니라 도메인·배포 흐름까지 점검해야 합니다.",
      },
    ],
  },
  {
    slug: "dongbak",
    title: "동아리랑",
    summary: "교내 동아리 정보와 공연일정을 한눈에 보는 동아리 박람회 안내 웹",
    period: "2025.02 - 2025.03 (2개월)",
    role: "Frontend Developer",
    tags: ["Team", "React", "JavaScript"],
    featured: false,
    image: "/images/projectsImage/DongBak.webp",
    overview:
      "동국대학교 2025 동아리 박람회의 부스·공연 정보를 모은 통합 안내 웹서비스입니다. 지도 기반 UI로 부스 위치와 공연 일정을 확인할 수 있습니다.",
    decisions: [
      "지도 일러스트 중심의 탐색 UX",
      "검색 디바운스로 불필요한 요청 억제",
    ],
    roles: [
      "메인 네비게이션·페이지 전환 시스템 구성",
      "부스/푸드트럭 통합 검색 기능 구현",
      "예외 페이지 및 에러 UX 처리",
    ],
    challenges: [
      {
        problem: "검색 입력마다 API가 호출되어 트래픽·지연이 발생했습니다.",
        solution: "디바운스와 빈 입력 차단을 적용했습니다.",
        learnings: "실시간 입력 UX에는 요청 제어가 필수입니다.",
      },
    ],
  },
];

export const getProjectBySlug = (slug: string) =>
  PROJECTS.find((project) => project.slug === slug);

export const getFeaturedProjects = () =>
  PROJECTS.filter((project) => project.featured);

/**
 * 생성 이유: 프로젝트 목록·상세·메인 Featured가 같은 데이터를 공유해야 한다.
 * 역할: 포트폴리오 프로젝트 엔트리의 타입과 정적 데이터 소스다.
 * 책임: PortfolioPage `projectData` 원문을 기준으로 slug 조회·featured·상세/카드 메타를 관리한다.
 *       값(PROJECTS·조회 함수)은 서버 컴포넌트(라우트)에서 읽고 화면에 필요한 필드만 props로 넘긴다 —
 *       클라이언트 컴포넌트는 타입만 가져와야 전체 원문이 브라우저 번들에 실리지 않는다.
 */

/** 프로젝트 진행 형태. 표시 문구는 PROJECTS_PAGE_UI.kindLabel이 소유한다. */
export type ProjectKind = "team" | "solo" | "hackathon";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  period: string;
  /** 카드용 짧은 기간 표기(예: "2025.03 — Now"). 없으면 period에서 연도만 뽑는다. */
  periodShort?: string;
  role: string;
  team: string;
  /** 팀·솔로·해커톤 구분. team 원문과 별개로 카드 메타에 쓴다. */
  kind?: ProjectKind;
  tags: string[];
  featured: boolean;
  image: string;
  /** 이미지 원본 픽셀 크기 — 상세 커버가 로드 전부터 같은 비율로 자리를 잡는다(커버가 늦게 와도 본문이 밀리지 않는다). */
  imageSize: { width: number; height: number };
  /**
   * 16:9보다 넓은 썸네일을 자르지 않고 contain으로 둘 때 위아래 여백을 채울 색.
   * 썸네일 가장자리 색과 같아야 이음새가 보이지 않는다. 없으면 16:9 박스에 cover한다.
   */
  imageMatte?: string;
  /** 홈 미리보기에만 전달하는 짧은 문제 해결 서사. */
  featuredStory?: {
    category: string;
    outcome: string;
    steps: { title: string; description: string }[];
  };
  overview: string;
  decisions: string[];
  roles: string[];
  challenges: { problem: string; solution: string; learnings: string }[];
  github?: string;
  demo?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "behavior-rpa",
    title: "사용자 행동 분석 기반 RPA",
    summary:
      "반복되는 화면 조작을 기록·분석하고 자동화 초안을 제안하는 데스크톱 시스템. 신한펀드파트너스 IT 인턴십 프로젝트.",
    period: "2026 · 신한펀드파트너스 IT 인턴십",
    periodShort: "2026",
    role: "IT Intern · 기획·설계·개발",
    team: "신한펀드파트너스 IT 인턴십",
    tags: ["Electron", "React", "TypeScript", "Node.js", "AI Agent"],
    featured: true,
    image: "/images/projectsImage/behavior-rpa.svg",
    imageSize: { width: 1440, height: 900 },
    featuredStory: {
      category: "업무 자동화",
      outcome: "반복 행동의 기록을 자동화 후보와 실행 초안으로 연결했습니다.",
      steps: [
        { title: "반복되는 일을 먼저 이해하기", description: "금융 업무의 화면 조작을 기록하고, 어떤 행동이 반복되는지 찾는 것에서 시작했습니다." },
        { title: "계산과 AI의 역할 나누기", description: "반복 패턴은 코드로 계산하고 AI는 해석을 맡도록 나눴습니다. 좌표 대신 화면 객체를 기억해 다시 찾도록 설계했습니다." },
        { title: "검토할 수 있는 자동화로 연결하기", description: "후보 추천에서 초안 편집과 실행까지 연결하고, 실행 전 대상 확인과 실행 후 결과 검증을 넣었습니다." },
      ],
    },
    overview:
      "금융 업무에서 되풀이되는 화면 조작을 기록하고, 반복 패턴을 분석해 자동화 초안을 제안하는 데스크톱 RPA 시스템입니다. 웹과 운영체제의 UI 요소를 공통 객체로 다루며, 녹화 → 반복 작업 발견 → 자동화 후보 추천 → 초안 편집 → 실행으로 이어지는 흐름을 구현했습니다. 신한펀드파트너스 IT 인턴십에서 진행한 업무 자동화 과제입니다.",
    decisions: [
      "좌표만 저장하는 대신 DOM·Accessibility·UI Automation 기반 객체를 공통 모델로 다뤄 화면 변화에 대응",
      "반복 패턴 계산은 코드가 수행하고, 해석과 설명이 필요한 부분에 AI를 사용하는 역할 분리",
      "Electron 셸·React 작업실·Local Agent·네이티브 도우미를 분리해 UI와 실행 엔진의 책임 구분",
      "자동화 초안과 활성 버전을 분리해 편집 중인 작업이 바로 실행되지 않도록 설계",
      "실행 직전 대상을 다시 찾고 실행 후 결과를 검증하며, 모호한 대상은 실행하지 않는 흐름 구성",
    ],
    roles: [
      "사용자 행동 기록부터 반복 작업 분석·자동화 추천·초안 생성·실행까지 제품 흐름 기획 및 개발",
      "React 기반 자동화 작업실과 객체 선택·작업 편집·실행 이력 UI 구현",
      "브라우저 확장과 운영체제 어댑터를 연결하는 객체 인식·재탐색 구조 설계",
      "결정적 분석 로직과 AI 해석을 분리하고 모델 호출량을 제어하는 분석 흐름 구성",
      "계약 스키마·Vitest 테스트와 macOS·웹 실행 확인을 통해 동작 검증",
    ],
    challenges: [
      {
        problem:
          "화면 좌표만으로 대상을 기억하면 창 위치나 화면 구성이 바뀔 때 다른 요소를 조작할 수 있었습니다.",
        solution:
          "객체의 구조·의미 정보를 저장하고 실행 전에 다시 탐색하도록 설계했습니다. 후보의 점수와 모호함을 판단하고, 실행 후 실제 상태 변화를 확인하도록 구성했습니다.",
        learnings:
          "업무 자동화에서는 명령을 보냈다는 사실보다 올바른 대상을 찾고 결과를 검증하는 과정이 중요합니다.",
      },
      {
        problem:
          "전체 행동 기록을 AI에 전달하는 방식은 호출 비용이 커지고 분석 결과를 검증하기도 어려웠습니다.",
        solution:
          "반복 패턴과 통계는 코드로 계산하고, 요약된 분석 결과만 AI에 전달하도록 역할을 나눴습니다. 판단 난도에 따라 모델을 선택하고 호출량에 상한을 두었습니다.",
        learnings:
          "AI를 모든 계산의 주체로 두기보다, 코드로 검증할 수 있는 처리와 판단이 필요한 영역을 구분해야 비용과 신뢰성을 함께 관리할 수 있습니다.",
      },
    ],
  },
  {
    slug: "d-order",
    title: "D-Order",
    summary:
      "축제 부스 현장의 주문·결제·서빙·정산을 디지털로 해결하는 운영지원 서비스 (Customer/Admin/Server).",
    period:
      "1차 2025.03~05 · 2차 05~07 · 3차 07~09 · 4차 2026.02~ (고도화)",
    periodShort: "2025.03 — Now",
    role: "Frontend Lead",
    team: "FE 3 / BE 4 / PM 1 / Designer 1",
    kind: "team",
    tags: ["Team", "React", "TypeScript", "WebSocket", "Redis"],
    featured: true,
    image: "/images/projectsImage/D-order.webp",
    imageSize: { width: 1440, height: 756 },
    featuredStory: {
      category: "현장에서 운영한 서비스",
      outcome: "고객·운영진·서빙 담당자의 주문 흐름을 실시간으로 연결했습니다.",
      steps: [
        { title: "축제 현장의 흐름을 나누기", description: "고객의 주문, 운영진의 관리, 직원의 서빙을 역할별 화면으로 나눠 각자 필요한 일에 집중하도록 했습니다." },
        { title: "같은 상태를 함께 바라보기", description: "서버를 상태의 기준으로 두고 WebSocket으로 주문·테이블·직원 호출의 변화를 전달했습니다." },
        { title: "현장 조건까지 설계하기", description: "연결 복구와 인증 흐름을 정리하고, 실제 운영에서 역할별 화면이 같은 주문 상태로 수렴하도록 구현했습니다." },
      ],
    },
    github: "https://github.com/D-Order/2026-d-order-fe-admin-v3",
    demo: "http://customer.dorder-api.shop",
    overview:
      "D-Order는 축제 부스 현장에서 발생하는 주문·결제·서빙·정산의 불편함을 디지털로 해결하는 운영지원 서비스입니다. Customer(고객)·Admin(운영진)·Server(서빙) 웹을 분리해 역할별 흐름만 제공하고, WebSocket + Redis Pub/Sub로 주문/상태/직원 호출을 실시간 동기화했습니다.",
    decisions: [
      "React + TypeScript로 역할(고객/운영진/서빙)별 UI를 타입 안정적으로 분리",
      "WebSocket을 주문·테이블·직원 호출의 실시간 채널로 사용",
      "Redis Pub/Sub로 Front↔Back 이벤트 브로커 구성",
      "장바구니·주문 스냅샷의 단일 출처를 서버로 두고 클라이언트는 조회/구독",
      "Heartbeat(PING/PONG 30s)·Reconnect(3s, 최대 5회)로 현장 네트워크 변동 대응",
      "JWT/쿠키 인증 + 권한 분리로 역할별 구독 범위 설계",
    ],
    roles: [
      "Frontend Lead로 Customer/Admin/Server 전반의 흐름 설계 및 개발 기준 수립",
      "장바구니·주문·결제 흐름과 화면 간 상태 관리 아키텍처 설계",
      "축제 현장 네트워크를 고려한 인증/연결 전략·장애 대응 UX 정리",
      "고객·직원 WebSocket 채널 설계(구독 범위 분리)",
      "WebSocket + Redis Pub/Sub 기반 실시간 상태 동기화 구현",
      "2주 MVP 협업을 위한 와이어프레임·API 명세·GitHub→Discord 알림 자동화 주도",
    ],
    challenges: [
      {
        problem:
          "모바일 CPU slowdown 조건에서 radial-gradient + blur 배경이 GPU 과부하를 유발하며 프레임 저하·렌더 아티팩트가 발생했습니다.",
        solution:
          "Chrome DevTools + Lighthouse로 현장 조건을 재현한 뒤 Performance/Paint/Layers로 blur 비용을 확정하고, 배경을 이미지화·transform 중심 구성으로 전환해 composite에서 처리되게 했습니다.",
        learnings:
          "모바일 성능 이슈는 ‘느리다’가 아니라 ‘어떤 조건에서 깨지는가’를 재현하는 것부터가 시작이며, 감각적 UI도 DevTools 근거로 안전한 렌더링을 선택해야 합니다.",
      },
      {
        problem:
          "장바구니를 클라이언트 전역 상태 중심으로 관리하니 새로고침·로그인 변경·다중 탭에서 상태 유실이 났고 현장 신뢰성이 떨어졌습니다.",
        solution:
          "localStorage·BroadcastChannel·React Query cache를 비교 실험한 뒤, 서버를 단일 출처로 두고 클라이언트는 스냅샷 조회/WebSocket 구독으로 수렴하도록 전환했습니다.",
        learnings:
          "현장 운영에서는 편의성보다 신뢰성이 우선이며, 서버 기준 정합성 설계가 필요합니다.",
      },
      {
        problem:
          "직원 호출에서 여러 직원이 동시에 수락하면 동일 요청이 중복 처리되거나 화면 상태가 꼬일 수 있었습니다.",
        solution:
          "호출 상태(PENDING/ACCEPTED/DELETED)를 WebSocket으로 구독하고, 서버에서 트랜잭션/비관적 락으로 PENDING→ACCEPTED 전이를 한 번만 보장한 뒤 Redis Pub/Sub로 브로드캐스트했습니다.",
        learnings:
          "실시간 도메인의 핵심은 동시성/정합성이며, 프론트는 UX와 함께 ‘상태가 수렴하는 구조’를 설계해야 합니다.",
      },
    ],
  },
  {
    slug: "portfolio",
    title: "포트폴리오 페이지",
    summary:
      "회색 명도차 철학을 담은 Next.js·Emotion 개인 포트폴리오. 프로젝트·스킬·블로그를 한곳에 아카이빙.",
    period: "2025.05 — 현재 (개선 지속)",
    periodShort: "2025.05 — Now",
    role: "Planning · Design · Frontend",
    team: "Solo",
    kind: "solo",
    tags: ["Solo", "React", "TypeScript", "Next.js", "Emotion"],
    featured: true,
    image: "/images/projectsImage/PortFolio.webp",
    imageSize: { width: 1440, height: 751 },
    featuredStory: {
      category: "인터랙션과 정보 설계",
      outcome: "프로젝트와 기록을 읽는 흐름에 모션·접근성·첫 화면 렌더링을 연결했습니다.",
      steps: [
        { title: "나를 설명하는 근거 보여주기", description: "소개·프로젝트·기록의 역할을 나누고, 대표 작업에서 실제 문제 해결 과정을 읽을 수 있도록 구성했습니다." },
        { title: "움직임에도 역할 부여하기", description: "텍스트·이미지·타임라인의 등장 방식을 구분하고 키보드 탐색과 동작 줄이기 설정을 함께 고려했습니다." },
        { title: "첫 화면부터 읽을 수 있게 만들기", description: "서버 렌더링과 테마 부트를 정리하고, 화면이 움직이기 전에도 핵심 콘텐츠와 이동 경로가 제공되도록 했습니다." },
      ],
    },
    // 1.92:1 스크린숏 — 좌우 내비 문구가 잘리지 않게 가장자리 회색으로 레터박스한다.
    imageMatte: "#f2f2f2",
    github: "https://github.com/taejun0/PortFolio_new",
    demo: "https://www.taejun0-portfolio.com",
    overview:
      "저를 가장 잘 표현하는 색이 회색이라 생각해 선택했습니다. “흑과 백이 아닌 회색의 명도차일 뿐이다.” React·TypeScript·Next.js 기반으로 프론트엔드 개발자로서의 저를 소개하고, Emotion·Framer Motion으로 몰입감 있는 인터페이스를 구성했습니다.",
    decisions: [
      "App Router로 중첩 레이아웃·서버/클라이언트 컴포넌트 경계 정리",
      "블로그는 마크다운 + Giscus(Discussions), 메타/OG로 SEO 보강",
      "WebP·next/image·LCP priority로 성능 개선",
      "보조 도메인 308 Permanent Redirect로 초기 재요청 비용 축소",
    ],
    roles: [
      "스토리텔링 중심 UX 기획·슬라이드/섹션 레이아웃 구성",
      "Figma 시안·인터랙션 흐름 설계",
      "Next.js 정적/SSR 웹 전체 구현 및 배포 자동화",
      "번들 최적화·lazy loading·debounce 등 성능 작업",
    ],
    challenges: [
      {
        problem:
          "Lighthouse Performance·SEO가 낮아 체감 속도와 검색 노출을 개선할 필요가 있었습니다.",
        solution:
          "공통 metadata/OG 보완, 307→308 리다이렉트 일원화, PNG→WebP·next/image·LCP priority로 점진 최적화했습니다. FCP가 23.9s→0.9s 수준으로 개선된 경험이 있습니다.",
        learnings:
          "성능·SEO는 지표가 아니라 UX이며, 코드뿐 아니라 도메인·라우팅·배포 흐름까지 점검해야 합니다.",
      },
      {
        problem:
          "파일 기반 라우팅만으로 시작하다 레이아웃 중복·라우팅 복잡성·상태 혼합이 커졌습니다.",
        solution:
          "App Router로 전환해 중첩 layout·RSC 기본·상호작용만 'use client'로 분리하고 metadata/icon으로 문서 설정을 단순화했습니다.",
        learnings:
          "라우팅은 경로가 아니라 코드베이스 유지보수성에 직결되며, 서버/클라 경계를 이해하는 것이 핵심입니다.",
      },
    ],
  },
  {
    slug: "dongbak",
    title: "동아리랑",
    summary:
      "동국대 2025 동아리 박람회 통합 안내 웹. 지도 UI·공연 일정·부스 검색으로 현장 탐색을 단순화.",
    period: "2025.02 — 2025.03 (2개월)",
    periodShort: "2025.02 — 03",
    role: "Frontend Developer",
    team: "Team project",
    kind: "team",
    tags: ["Team", "React", "JavaScript", "Framer Motion"],
    image: "/images/projectsImage/DongBak.webp",
    featured: false,
    imageSize: { width: 1440, height: 810 },
    github: "https://github.com/taejun0/2025_DongBak_Frontend",
    demo: "https://2025-dgu-dongbak.netlify.app/",
    overview:
      "60여 개 동아리 정보와 공연일정을 한눈에 보는 서비스입니다. 동국대학교 2025 동아리 박람회의 부스·공연 정보를 모았고, 지도 일러스트 기반 UI로 위치·시간표·상세 정보를 확인할 수 있습니다. React 19·Framer Motion·모바일 최적화·실시간 검색으로 현장 몰입감을 웹에 옮겼습니다.",
    decisions: [
      "지도 일러스트 중심의 직관적 부스 탐색 UX",
      "React Router v7로 SPA 페이지 전환·예외 처리",
      "Styled-components로 감성 UI를 컴포넌트 단위 관리",
      "Framer Motion으로 메인 몰입 모션 강화",
      "검색 디바운스(300ms)로 불필요 API 억제",
    ],
    roles: [
      "MainNavigation·커스텀 라우팅 훅으로 페이지 전환 흐름 일관화",
      "Floating Bubble 애니메이션으로 메인 시각 효과 연출",
      "useBoothSearch 훅으로 부스/푸드트럭 통합 검색 구현",
      "404·검색 없음 등 예외 UX와 useReloadPage 제공",
    ],
    challenges: [
      {
        problem:
          "npm 환경에서 lock/의존성 충돌과 설치 속도 저하로 팀 협업이 흔들렸습니다.",
        solution:
          "npm ci·strict-version 강화 후 yarn으로 패키지 매니저를 전환해 환경을 통일했습니다.",
        learnings:
          "초기 환경 통일만으로도 안정성과 협업 효율이 크게 좋아집니다.",
      },
      {
        problem:
          "검색 입력마다 API가 호출되어 트래픽·지연·중복 결과가 발생했습니다.",
        solution:
          "빈 입력 차단·길이 제한과 함께 Debounce를 적용해 요청을 제어했습니다.",
        learnings:
          "실시간 입력 UX에는 요청 제어가 필수이며, 사용자 입력 흐름을 고려해야 합니다.",
      },
    ],
  },
  {
    slug: "smart",
    title: "SMART",
    summary:
      "2025 동국대 캡스톤. MediaPipe AI 자세 분석으로 병사 체력 훈련 피드백을 제공하는 웹 서비스.",
    period: "2025.05 — 현재 추가 개발 중",
    periodShort: "2025.05 — Now",
    role: "Planning · Frontend",
    team: "Solo",
    kind: "solo",
    tags: ["Solo", "React", "JavaScript", "AI", "MediaPipe"],
    featured: false,
    image: "/images/projectsImage/SMART.webp",
    imageSize: { width: 1440, height: 754 },
    github: "https://github.com/taejun0/SMART_FE",
    demo: "https://smart-dgu.vercel.app/",
    overview:
      "SMART는 군 장병 체력 훈련을 지원하는 웹 서비스입니다. MediaPipe 기반 AI 자세 분석으로 동작을 실시간 인식·피드백하고, 훈련 요약·이력 조회까지 한 흐름으로 구성해 동기부여와 장기 체력 향상을 돕습니다.",
    decisions: [
      "react-router-dom v7로 SPA 라우팅",
      "Zustand로 훈련 결과·피드백·등급 등 전역 상태 관리",
      "styled-components로 테마·컴포넌트 스타일 일관성 유지",
      "MediaPipe Pose로 실시간 자세 추정·카운트 피드백",
      "recharts로 누적 통계 시각화",
    ],
    roles: [
      "캡스톤 기획부터 프론트 전 구간 단독 구현",
      "훈련 종목 선택·실시간 카운트·피드백 UX 설계",
      "훈련 요약·최근 기록 비교 시각화",
    ],
    challenges: [
      {
        problem:
          "MediaPipe landmarks를 사용자 관점의 정확한 포즈 기준으로 튜닝하기 어려웠습니다.",
        solution:
          "포즈 기준을 반복 측정·보정하며 카운트/피드백 임계값을 사용자 체감에 맞게 조정했습니다.",
        learnings:
          "AI 기능도 UX 튜닝이 핵심이며, 기술 정확도와 사용자 인지의 간극을 메우는 작업이 필요합니다.",
      },
    ],
  },
  {
    slug: "mohae",
    title: "MOHAE",
    summary:
      "가족 건강·정서 연결 웹. 캘린더·챌린지·병원 예약·약 복용·음성 챗봇을 묶은 해커톤 프로덕트.",
    period: "2025.07 (해커톤)",
    periodShort: "2025.07",
    role: "Frontend Developer",
    team: "Team",
    kind: "hackathon",
    tags: ["Team", "React", "JavaScript", "Django"],
    featured: false,
    image: "/images/projectsImage/Mohae.webp",
    imageSize: { width: 1440, height: 810 },
    github:
      "https://github.com/LikeLion-at-DGU/2024-hackathon-2-mohae-frontend",
    overview:
      "MOHAE는 부모님과 함께하는 삶을 위해 가족 간 건강 정보 공유와 정서적 연결을 돕는 서비스입니다. 가족 캘린더, 건강 챌린지, 병원 예약, 약 복용 체크, 음성 인식/출력 챗봇 등 실생활 밀착 기능을 제공합니다.",
    decisions: [
      "기능별 React 컴포넌트 분리(캘린더·챌린지·예약·약 복용)",
      "styled-components props 기반 조건부 스타일",
      "공통 axios 인스턴스로 API 호출 일원화",
      "SpeechRecognition/SpeechSynthesis로 고령 사용자 접근성 강화",
    ],
    roles: [
      "CustomCalendar·HealthChallenge·Hospital·Medicine UI/인터랙션 구현",
      "음성 입출력 통합·약 복용 체크 상태 로직",
      "챌린지 이미지 업로드·반응형 UI·모달/커서 등 UX 디테일",
    ],
    challenges: [
      {
        problem:
          "페이지 전환 시 상태 유실·로그인 전 토큰 미확인으로 리로드 오류가 반복되었습니다.",
        solution:
          "토큰/사용자 상태 검사 후 API를 호출하도록 순서를 고정하고, 로그인 전 요청을 차단했습니다.",
        learnings:
          "SPA에서 초기 렌더링 순서와 인증 상태 확인이 안정성의 핵심입니다.",
      },
      {
        problem:
          "Git 충돌·브랜치 전략 미흡으로 기능 손실이 발생했습니다.",
        solution:
          "pull→conflict 확인→작업 브랜치 규칙을 팀에 공유·강제했습니다.",
        learnings:
          "브랜치 전략은 협업 도구를 넘어 팀 작업 안정성과 직결됩니다.",
      },
    ],
  },
  {
    slug: "udongchin",
    title: "우동친",
    summary:
      "Kakao Maps 기반 지역 생태 커뮤니티. 위치 제보·생태 정보·검색·마커 UX를 담당.",
    period: "2025.03 — 2025.04 (약 1.5개월)",
    periodShort: "2025.03 — 04",
    role: "Frontend Developer",
    team: "Team",
    kind: "team",
    tags: ["Team", "React", "JavaScript", "Kakao Maps"],
    featured: false,
    image: "/images/projectsImage/Udongchin.webp",
    imageSize: { width: 1440, height: 810 },
    github: "https://github.com/taejun0/2024_udongchin_front",
    demo: "https://2024-udongchin-front.vercel.app/",
    overview:
      "우동친은 지역 주민이 생태계·동물·환경을 주제로 정보와 경험을 나누는 커뮤니티입니다. Kakao Maps API 지도 UI를 중심으로 위치 기반 제보, 생태 정보 확인, 커뮤니티 기능을 제공합니다.",
    decisions: [
      "지도·마커 중심 인터랙션을 SPA로 구성",
      "이전 축제 지도 프로젝트의 마커 중첩·성능 이슈를 모듈화로 개선",
      "검색·마커 생성·에러 페이지 UX를 프론트에서 일관 처리",
    ],
    roles: [
      "메인 구조·검색·마커 생성·오류 페이지 UX 담당",
      "지도 성능·중첩 문제 리팩토링",
    ],
    challenges: [
      {
        problem:
          "HTTPS↔HTTP 혼합 통신이 브라우저에서 차단되어 API 연동이 막혔습니다.",
        solution:
          "Vercel rewrites를 역방향 프록시처럼 써서 정적 SPA에서도 안전하게 우회했습니다.",
        learnings:
          "배포 플랫폼 프록시는 혼합 콘텐츠 이슈의 실용적 해법이며, 인프라를 프론트 설계에 포함해야 합니다.",
      },
    ],
  },
];

export const getProjectBySlug = (slug: string) =>
  PROJECTS.find((project) => project.slug === slug);

export const getFeaturedProjects = () =>
  PROJECTS.filter((project) => project.featured);

/**
 * 생성 이유: 메인 Stack·About Tools가 같은 기술 카테고리와 이미지를 공유해야 한다.
 * 역할: 인터랙티브 스택 셀렉터의 단일 데이터 소스다.
 * 책임: 카테고리 설명과 기술 이름·stackImage 경로, 쇼케이스 접근성 문구(정지 토글 이름 포함)·자동 전환 주기를 관리한다.
 *       아이콘은 타일 최대 크기(68px)의 2배인 144px WebP다 — 이미 작게 줄인 파일이라 이미지 최적화를 거치지 않고
 *       그대로 내려받는다(쇼케이스의 Image unoptimized).
 */
export type StackItem = {
  name: string;
  image?: string;
  /** 이미지가 없는 기술의 약어 아이콘 */
  mark?: string;
  /** 약어 아이콘 배경 — 브랜드 컬러 */
  markColor?: string;
};

export type StackGroup = {
  index: string;
  title: string;
  description: string;
  items: StackItem[];
  project: { slug: string; title: string };
};

export const STACK_SHOWCASE_UI = {
  regionLabel: "기술 스택 슬라이드",
  paginationLabel: "기술 카테고리 선택",
  /** "{카테고리} 기술" — 아이콘 목록 이름 */
  toolsLabelSuffix: "기술",
  autoplayStart: "자동 전환 켜기",
  autoplayStop: "자동 전환 멈추기",
  projectLabel: "관련 프로젝트",
  /** 자동 전환 주기 — 활성 탭 진행 바도 같은 값으로 채운다 */
  autoplayMs: 4600,
} as const;

const image = (file: string) => `/images/stackImage/${file}`;

export const STACK_GROUPS: StackGroup[] = [
  {
    index: "01",
    title: "Language",
    project: { slug: "behavior-rpa", title: "사용자 행동 분석 기반 RPA" },
    description: "구조를 세우고 의도를 명확하게 전달하는 언어들입니다.",
    items: [
      { name: "JavaScript", image: image("javascript.webp") },
      { name: "TypeScript", mark: "TS", markColor: "#3178c6" },
      { name: "Java", image: image("java.webp") },
    ],
  },
  {
    index: "02",
    title: "Frontend",
    project: { slug: "d-order", title: "D-Order" },
    description: "사용자가 직접 만나는 흐름과 상태를 설계하는 중심 도구입니다.",
    items: [
      { name: "HTML & CSS", image: image("htmlcss.webp") },
      { name: "React", image: image("react.webp") },
      { name: "React Native", image: image("reactnative.webp") },
      { name: "Next.js", image: image("nextjs.webp") },
      { name: "React Query", image: image("reactquery.webp") },
      { name: "Emotion", image: image("emotion.webp") },
      { name: "Framer Motion", image: image("framermotion.webp") },
    ],
  },
  {
    index: "03",
    title: "Backend",
    project: { slug: "d-order", title: "D-Order" },
    description: "화면 뒤의 API와 실시간 데이터 흐름을 이해하고 연결합니다.",
    items: [
      { name: "Spring Boot", image: image("springboot.webp") },
      { name: "WebSocket", image: image("websocket.webp") },
      { name: "Redis", image: image("redis.webp") },
    ],
  },
  {
    index: "04",
    title: "Testing",
    project: { slug: "behavior-rpa", title: "사용자 행동 분석 기반 RPA" },
    description: "기능이 계속 신뢰받을 수 있도록 검증하고 기록합니다.",
    items: [
      { name: "Playwright", image: image("playwright.webp") },
      { name: "Vitest", image: image("vitest.webp") },
      { name: "Jest", image: image("jest.webp") },
      { name: "MSW", image: image("msw.webp") },
      { name: "Storybook", image: image("storybook.webp") },
    ],
  },
  {
    index: "05",
    title: "Workflow",
    project: { slug: "portfolio", title: "포트폴리오 페이지" },
    description: "디자인부터 협업과 배포까지 제품이 전달되는 환경입니다.",
    items: [
      { name: "Figma", image: image("figma.webp") },
      { name: "GitHub", image: image("github.webp") },
      { name: "Docker", image: image("docker.webp") },
      { name: "Notion", image: image("notion.webp") },
    ],
  },
];

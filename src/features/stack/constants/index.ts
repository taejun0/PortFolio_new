/**
 * 생성 이유: 메인 Stack·About Tools가 같은 기술 카테고리와 이미지를 공유해야 한다.
 * 역할: 인터랙티브 스택 셀렉터의 단일 데이터 소스다.
 * 책임: 카테고리 설명과 기술 이름·stackImage 경로를 관리한다.
 */
export type StackItem = {
  name: string;
  image?: string;
  mark?: string;
};

export type StackGroup = {
  index: string;
  title: string;
  description: string;
  items: StackItem[];
};

const image = (file: string) => `/images/stackImage/${file}`;

export const STACK_GROUPS: StackGroup[] = [
  {
    index: "01",
    title: "Language",
    description: "구조를 세우고 의도를 명확하게 전달하는 언어들입니다.",
    items: [
      { name: "JavaScript", image: image("javascript.svg") },
      { name: "TypeScript", mark: "TS" },
      { name: "Java", image: image("java.svg") },
    ],
  },
  {
    index: "02",
    title: "Frontend",
    description: "사용자가 직접 만나는 흐름과 상태를 설계하는 중심 도구입니다.",
    items: [
      { name: "HTML & CSS", image: image("htmlcss.svg") },
      { name: "React", image: image("react.svg") },
      { name: "React Native", image: image("reactnative.svg") },
      { name: "Next.js", image: image("nextjs.svg") },
      { name: "React Query", image: image("reactquery.svg") },
      { name: "Emotion", image: image("emotion.svg") },
      { name: "Framer Motion", image: image("framermotion.svg") },
    ],
  },
  {
    index: "03",
    title: "Backend",
    description: "화면 뒤의 API와 실시간 데이터 흐름을 이해하고 연결합니다.",
    items: [
      { name: "Spring Boot", image: image("springboot.svg") },
      { name: "WebSocket", image: image("websocket.svg") },
      { name: "Redis", image: image("redis.svg") },
    ],
  },
  {
    index: "04",
    title: "Testing",
    description: "기능이 계속 신뢰받을 수 있도록 검증하고 기록합니다.",
    items: [
      { name: "Playwright", image: image("playwright.svg") },
      { name: "Vitest", image: image("vitest.svg") },
      { name: "Jest", image: image("jest.svg") },
      { name: "MSW", image: image("msw.svg") },
      { name: "Storybook", image: image("storybook.svg") },
    ],
  },
  {
    index: "05",
    title: "Workflow",
    description: "디자인부터 협업과 배포까지 제품이 전달되는 환경입니다.",
    items: [
      { name: "Figma", image: image("figma.svg") },
      { name: "GitHub", image: image("github.svg") },
      { name: "Docker", image: image("docker.svg") },
      { name: "Notion", image: image("notion.svg") },
    ],
  },
];

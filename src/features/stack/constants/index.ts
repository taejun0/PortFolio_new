/**
 * 생성 이유: 메인 Stack·About Tools가 같은 기술 목록을 공유해야 한다.
 * 역할: stackImage 자산과 6개 카테고리 그룹의 단일 데이터 소스다.
 * 책임: Language·Frontend·Backend·Infra&Tools·Testing·UI 분류와 이미지 경로를 관리한다.
 */
export type StackItem = {
  name: string;
  image: string;
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
    description: "언어와 타입 기반",
    items: [
      { name: "JavaScript", image: image("javascript.png") },
      { name: "Java", image: image("java.png") },
    ],
  },
  {
    index: "02",
    title: "Frontend",
    description: "인터페이스와 사용자 경험",
    items: [
      { name: "HTML & CSS", image: image("htmlcss.png") },
      { name: "React", image: image("react.png") },
      { name: "React Native", image: image("reactnative.png") },
      { name: "Next.js", image: image("nextjs.png") },
      { name: "React Query", image: image("reactquery.png") },
      { name: "Framer Motion", image: image("framermotion.png") },
    ],
  },
  {
    index: "03",
    title: "Backend",
    description: "서버·실시간·데이터",
    items: [
      { name: "Spring Boot", image: image("springboot.png") },
      { name: "Redis", image: image("redis.png") },
      { name: "WebSocket", image: image("websocket.png") },
    ],
  },
  {
    index: "04",
    title: "Infra & Tools",
    description: "배포·협업·운영",
    items: [
      { name: "Docker", image: image("docker.png") },
      { name: "GitHub", image: image("github.png") },
      { name: "Notion", image: image("notion.png") },
    ],
  },
  {
    index: "05",
    title: "Testing",
    description: "품질과 신뢰성",
    items: [
      { name: "Jest", image: image("jest.png") },
      { name: "Vitest", image: image("vitest.png") },
      { name: "MSW", image: image("msw.png") },
      { name: "Playwright", image: image("playwright.png") },
    ],
  },
  {
    index: "06",
    title: "UI",
    description: "디자인·스타일·문서화",
    items: [
      { name: "Emotion", image: image("emotion.png") },
      { name: "Figma", image: image("figma.png") },
      { name: "Storybook", image: image("storybook.png") },
    ],
  },
];

export const STACK_MARQUEE_ITEMS = STACK_GROUPS.flatMap((group) =>
  group.items.map((item) => item.name)
);

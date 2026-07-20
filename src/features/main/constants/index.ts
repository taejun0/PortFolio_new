/**
 * 생성 이유: 메인 섹션 문구를 컴포넌트 JSX에서 분리한다.
 * 역할: Hero→지표→About→Projects→Stack→Blog→Contact 카피·앵커 id를 제공한다.
 * 책임: PortfolioPage 톤을 유지한 채 Thomas Eduardo식 섹션 서사에 배치한다.
 */
export const MAIN_SECTION_IDS = {
  intro: "intro",
  about: "about",
  projects: "projects",
  stack: "stack",
  blog: "blog",
  close: "close",
} as const;

export const MAIN_HERO_UI = {
  roles: ["Frontend oriented Developer"],
  displayName: "OHTAEJUN",
  title: "웹의 형태로 표현하고 소통하는 개발자 오태준입니다",
  scroll: "Scroll",
  scrollHref: "#about",
} as const;

export const MAIN_STATS_UI = {
  items: [
    { value: "20+", unit: "Projects", detail: "팀·솔로·해커톤·외주 포함" },
    { value: "1만+", unit: "Users", detail: "실사용자가 있는 서비스 제공 경험" },
    { value: "51+", unit: "Writing", detail: "Velog 기술 기록" },
    {
      value: "FE",
      unit: "Oriented",
      detail: "FE·BE·Infra 경험, FE 중심",
    },
  ],
} as const;

export const MAIN_ABOUT_UI = {
  label: "About",
  title: "About me",
  quoteLead: "라는 말을 들은 적이 있습니다.",
  quote: '"집단에서 공유되는 정보가, 곧 그 집단의 IQ다"',
  paragraphs: [
    "아무리 뛰어난 개인이 있더라도, 구성원들 간 대화가 없다면 팀 전체의 성장이 어려워지게 됩니다.",
    "저는 그러한 흐름을 만들어가는 개발자가 되고 싶습니다. 내가 아는 것을 아낌없이 나누고, 다른 사람의 의견을 경청하며, 더 나은 방향으로 함께 나아갈 수 있도록.",
  ],
  photo: "/images/myimage/1.png",
  photoAlt: "오태준 프로필 사진",
  facts: [
    { label: "이름", value: "오태준" },
    { label: "거주지", value: "경기도 의정부시" },
    { label: "학력", value: "동국대학교 컴퓨터정보통신공학부" },
  ],
  cta: "자세히 보기 →",
} as const;

export const MAIN_PROJECTS_UI = {
  label: "Projects",
  title: "Featured projects",
  cta: "전체 보기",
  detailCta: "자세히",
  demoCta: "웹 뷰",
  githubCta: "Github",
} as const;

export const MAIN_STACK_UI = {
  label: "Stack",
  title: "Tools & technologies",
  aside: "실제 프로젝트에서 쓰는 스택입니다.",
} as const;

export const MAIN_BLOG_UI = {
  label: "Articles",
  title: "Recent writing",
  aside: "배운 것을 글로 남깁니다.",
  velogCount: 51,
  statsTemplate: (velog: number, portfolio: number) =>
    `Velog ${velog} · Portfolio ${portfolio}`,
  cta: "전체 글 보기",
  empty: "아직 등록된 글이 없습니다.",
} as const;

export const MAIN_CLOSE_UI = {
  label: "Contact",
  title: "Contact me",
  body: "언제든 편하게 연락주세요",
  githubLabel: "GitHub",
  emailLabel: "Email",
  cta: "Get In Touch",
} as const;

export const MAIN_FOOTER_UI = {
  availability: "Available for projects",
  brand: "taejun0",
  location: "Uijeongbu, KR",
  nav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ],
} as const;

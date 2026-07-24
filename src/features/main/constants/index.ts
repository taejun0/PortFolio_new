/**
 * 생성 이유: 메인 섹션 문구를 컴포넌트 JSX에서 분리한다.
 * 역할: Hero→About→Projects→Stack→Blog→Contact 카피·앵커 id를 제공한다.
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
    { value: "20+", unit: "Projects", detail: "다양한 프로젝트 경험" },
    { value: "1만+", unit: "Users", detail: "사용자 있는 서비스" },
    { value: "50+", unit: "Writing", detail: "공유의 가치" },
    {
      value: "FE·BE·Infra",
      unit: "Oriented",
      detail: "FE·BE·Infra 경험",
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
  aside: "프로젝트를 누르면 상세 정보를 볼 수 있습니다.",
  cta: "전체 보기",
  detailCta: "자세히 보기",
  demoCta: "웹 뷰",
  githubCta: "Github",
} as const;

export const MAIN_STACK_UI = {
  label: "Stack",
  title: "Tools & technologies",
  aside: "실제 프로젝트에서 사용해온 기술들입니다.",
} as const;

export const MAIN_BLOG_UI = {
  label: "Articles",
  title: "Selected writing",
  aside: "50편 넘게 써온 기록 중, 지금 읽히길 바라는 글입니다.",
  stats: "기술 글 50+",
  cta: "전체 글 보기",
  velogCta: "Velog에서 더 보기",
  empty: "아직 등록된 글이 없습니다.",
} as const;

/** 메인에 고정으로 노출할 큐레이션 글. 1번은 반응·조회가 가장 큰 Velog 글. */
export const MAIN_BLOG_FEATURED = [
  {
    title: "24시간 안에 서비스를 만들면서 느낀점, 바이브 코딩",
    date: "2025-11-17",
    href: "https://velog.io/@taejun0/24시간-안에-서비스를-만들면서-느낀점-바이브-코딩",
    external: true as const,
    meta: "Velog · 조회 500+",
  },
  {
    title: "기술적 의사결정이 중요한 이유",
    date: "2026-05-10",
    slug: "2026-05-10-01",
    external: false as const,
    meta: "의사결정",
  },
  {
    title: "왜 Next.js를 선택했는가 (프로젝트에서의 문제→적용 회고)",
    date: "2025-04-22",
    slug: "2026-04-22-01",
    external: false as const,
    meta: "회고",
  },
] as const;

export const MAIN_CLOSE_UI = {
  label: "Contact",
  title: "Contact me.",
  body: "프로젝트·협업·커피챗 모두 환영합니다. 편하게 메일이나 GitHub로 연락 주세요.",
  availability: "Available for projects",
  location: "Uijeongbu, KR",
  channels: [
    {
      label: "Email",
      hint: "가장 빠른 연락",
      valueKey: "email" as const,
      hrefKind: "mailto" as const,
    },
    {
      label: "GitHub",
      hint: "코드와 활동",
      valueKey: "githubPath" as const,
      hrefKind: "github" as const,
    },
    {
      label: "Velog",
      hint: "기술 기록",
      valueKey: "velog" as const,
      hrefKind: "velog" as const,
    },
  ],
  cta: "Send email",
  ctaHint: "또는 아래 채널로 바로 이동",
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

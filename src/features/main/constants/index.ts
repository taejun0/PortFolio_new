/**
 * 생성 이유: 메인 섹션 문구를 컴포넌트 JSX에서 분리한다.
 * 역할: Hero→Projects→About→Stack→Blog→Contact 카피·앵커 id를 제공한다.
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
  /**
   * 히어로 h1이 보조기기에 주는 이름 — 그림 글자(displayName)는 aria-hidden이라 대신 읽힌다.
   * 대문자 한 덩어리는 한국어 TTS가 철자로 읽기 쉬워 한글 이름과 띄어 쓴 로마자를 함께 둔다(About h1과 같은 표기).
   */
  nameLabel: "오태준 Oh Taejun",
  title: "실제 서비스와 업무 자동화를 만드는 개발자 오태준입니다",
  primaryCta: "대표 작업 보기",
  primaryHref: "#projects",
  secondaryCta: "소개·이력 보기",
  secondaryHref: "/about",
  scroll: "Scroll",
  /**
   * 보이는 "Scroll" 뒤에 시각적으로만 숨겨 붙이는 설명 — 링크 이름이 "Scroll — 아래로 스크롤"이 된다.
   * aria-label 대신 내용으로 이름을 만들어 롤 복사본 글자가 이름 불일치(label-content-name-mismatch)로 잡히지 않는다.
   */
  scrollHint: "— 아래로 스크롤",
  scrollHref: "#projects",
} as const;

/** 4번째 지표는 수치가 아닌 범위(단어)라 단위·설명이 값을 되풀이하지 않게 둔다. */
export const MAIN_STATS_UI = {
  label: "핵심 지표",
  items: [
    { value: "20+", unit: "Projects", detail: "다양한 프로젝트 경험" },
    { value: "1만+", unit: "Users", detail: "사용자 있는 서비스" },
    { value: "50+", unit: "Writing", detail: "공유의 가치" },
    {
      value: "FE·BE·Infra",
      unit: "Full-cycle",
      detail: "화면부터 서버·배포까지",
    },
  ],
} as const;

export const MAIN_ABOUT_UI = {
  label: "About",
  title: "About me",
  quoteLead: "라는 말을 들은 적이 있습니다.",
  quote: "“집단에서 공유되는 정보가, 곧 그 집단의 IQ다”",
  summary: "배운 것을 나누고, 동료의 의견을 들으며 더 나은 서비스를 만듭니다. 사용자와 운영자가 겪는 문제를 이해하고 화면부터 서버·배포까지 연결하는 개발을 지향합니다.",
  paragraphs: [
    "아무리 뛰어난 개인이 있더라도, 구성원들 간 대화가 없다면 팀 전체의 성장이 어려워지게 됩니다.",
    "내가 아는 것을 아낌없이 나누고, 다른 사람의 의견을 경청하며, 더 나은 방향으로 함께 나아갈 수 있도록 노력하고 싶습니다.",
  ],
  photo: "/images/myimage/1.png",
  photoAlt: "오태준 프로필 사진",
  facts: [
    { label: "이름", value: "오태준" },
    { label: "생년월일", value: "2001.09.29" },
    { label: "학력", value: "동국대학교 컴퓨터정보통신공학부" },
  ],
  cta: "About 자세히 보기",
  experience: {
    label: "최근 경험",
    title: "신한펀드파트너스 IT 인턴십",
    summary: "금융 업무의 흐름을 이해하고, 반복 작업을 자동화하는 RPA를 기획·개발했습니다.",
    href: "/about#trajectory",
    cta: "경험과 배움 보기",
  },
} as const;

export const MAIN_PROJECTS_UI = {
  label: "Projects",
  title: "Featured projects",
  aside: "작업을 골라 핵심 과정을 살펴보고, 자세한 이야기를 읽어보세요.",
  cta: "프로젝트 전체 보기",
  detailCta: "과정 보기",
  previewSuffix: "미리보기",
  previewRegion: "선택한 프로젝트의 문제 해결 과정",
  storyLabels: ["문제", "판단", "결과"],
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
  aside: "공유의 가치를 남기기 위해 작성한 글들입니다.",
  /** 헤더 줄의 분량 시그널 — 라벨은 차분하게, 수치만 액센트로 둔다. */
  stat: { label: "기술 글", value: "50+" },
  cta: "전체 글 보기",
  velogCta: "Velog에서 더 보기",
  /** 외부(Velog) 글 행에만 붙는 숨김 안내 — Contact 채널과 같은 문구. */
  newTab: "(새 창)",
  empty: "아직 등록된 글이 없습니다.",
} as const;

type MainBlogFeaturedPost = {
  title: string;
  /** frontmatter와 같은 ISO(yyyy-MM-dd) — 화면에서는 2025.11.17 점 표기로 보인다. */
  date: string;
  /** 글이 실린 곳 (Velog · Blog) */
  source: string;
  topic: string;
  /** 메타 줄 끝에 은은하게 강조할 반응 지표 */
  highlight?: string;
} & (
  | { external: true; href: string }
  | { external: false; slug: string }
);

/**
 * 메인에 고정으로 노출할 큐레이션 글 — 날짜순이 아니라 추천 순서라 화면에는 01·02·03 번호로 보인다.
 * 1번은 반응·조회가 가장 큰 Velog 글.
 */
export const MAIN_BLOG_FEATURED: readonly MainBlogFeaturedPost[] = [
  {
    title: "24시간 안에 서비스를 만들면서 느낀점, 바이브 코딩",
    date: "2025-11-17",
    href: "https://velog.io/@taejun0/24시간-안에-서비스를-만들면서-느낀점-바이브-코딩",
    external: true,
    source: "Velog",
    topic: "회고",
    highlight: "조회 500+",
  },
  {
    title: "기술적 의사결정이 중요한 이유",
    date: "2026-05-10",
    slug: "2026-05-10-01",
    external: false,
    source: "Blog",
    topic: "의사결정",
  },
  {
    title: "왜 Next.js를 선택했는가 (프로젝트에서의 문제→적용 회고)",
    date: "2025-04-22",
    slug: "2026-04-22-01",
    external: false,
    source: "Blog",
    topic: "회고",
  },
];

export const MAIN_CLOSE_UI = {
  label: "Contact",
  title: "Contact me.",
  body: "프로젝트·협업·커피챗 모두 환영합니다.",
  quoteLines: ["프로젝트·협업·커피챗", "모두 환영합니다"],
  note: "편하게 메일이나 GitHub로 연락 주세요.",
  availability: "Available for projects",
  photo: "/images/myimage/2.jpg",
  photoAlt: "오태준 명함 사진",
  /** 명함 두 면의 랜드마크 이름(스크린리더용). */
  frontLabel: "명함 앞면",
  backLabel: "명함 뒷면",
  channelsLabel: "연락 채널",
  /** 새 창으로 열리는 채널 링크 뒤에 덧붙는 숨김 안내. */
  newTab: "(새 창)",
  worksLabel: "WORKS",
  worksTitle: "Selected projects",
  works: ["사용자 행동 분석 기반 RPA", "D-Order", "포트폴리오 페이지"],
  channels: [
    {
      label: "Email",
      hint: "빠른 연락을 원한다면 이메일로 연락주세요.",
      valueKey: "email" as const,
      hrefKind: "mailto" as const,
    },
    {
      label: "GitHub",
      hint: "코드와 활동을 보고 싶다면 GitHub를 방문해주세요.",
      valueKey: "githubPath" as const,
      hrefKind: "github" as const,
    },
    {
      label: "Velog",
      hint: "기술 기록을 보고 싶다면 Velog를 방문해주세요.",
      valueKey: "velog" as const,
      hrefKind: "velog" as const,
    },
  ],
  cta: "메일 보내기",
  copyEmail: "이메일 복사",
  copiedEmail: "복사 완료",
  copyEmailSuccess: "이메일 주소를 복사했습니다.",
  copyEmailError: "복사하지 못했습니다. 위 이메일 주소를 선택해 복사해주세요.",
} as const;

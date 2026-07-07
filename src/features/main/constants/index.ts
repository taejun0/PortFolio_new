/**
 * 생성 이유: 메인 섹션 문구를 컴포넌트 JSX에서 분리한다.
 * 역할: Hero→About→Thinking→Projects→Blog→Contact 카피·앵커 id를 제공한다.
 * 책임: PortfolioPage 원본 카피 톤을 유지한 채 Thomas Eduardo식 섹션 서사에 배치한다.
 */
export const MAIN_SECTION_IDS = {
  intro: "intro",
  about: "about",
  thinking: "thinking",
  projects: "projects",
  signals: "signals",
  blog: "blog",
  close: "close",
} as const;

export const MAIN_HERO_UI = {
  roles: [
    "Frontend oriented Developer",
  ],
  displayName: "OHTAEJUN",
  title: "웹의 형태로 표현하고 소통하는 개발자 오태준입니다",
  scroll: "Scroll",
  scrollHref: "#about",
} as const;

export const MAIN_ABOUT_UI = {
  label: "About",
  title: "About me.",
  quoteLead: "라는 말을 들은 적이 있습니다.",
  quote: '"집단에서 공유되는 정보가, 곧 그 집단의 IQ다"',
  paragraphs: [
    "아무리 뛰어난 개인이 있더라도, 구성원들 간 대화가 없다면 팀 전체의 성장이 어려워지게 됩니다.",
    "저는 그러한 흐름을 만들어가는 개발자가 되고 싶습니다. 내가 아는 것을 아낌없이 나누고, 다른 사람의 의견을 경청하며, 더 나은 방향으로 함께 나아갈 수 있도록.",
    "앞으로도 지식과 인사이트를 적극적으로 나누는 개발자가 되겠습니다.",
  ],
  facts: [
    "이름: 오태준",
    "생년월일: 2001.09.29",
    "경기도 의정부시",
    "이메일: xownswns@naver.com",
    "학력: 동국대학교 컴퓨터정보통신공학부",
  ],
} as const;

export const MAIN_THINKING_UI = {
  label: "Thinking",
  title: "Development Philosophy.",
  steps: [
    {
      title: "소통",
      body: `프론트엔드는 사용자와 가장 먼저 마주하는 영역이며, '보이는 것' 그 이상의 의미를 가진다고 생각합니다.

저는 D-Order라는 축제 주문 시스템 프로젝트에서 사용자 흐름을 기반으로 UI/UX를 설계했습니다. 테이블 이용료처럼 예외 조건이 많은 로직도 자연스럽게 안내할 수 있도록 구성했고, 장바구니나 모달 인터랙션 또한 흐름을 끊지 않도록 고민했습니다.

하지만 진짜 소통은 사용자뿐 아니라 팀원 간의 커뮤니케이션에서도 빛난다고 믿습니다. 짧은 개발 기간 동안 API 명세를 실시간으로 문서화하고 공유한 경험은 작업 오류를 최소화하는 동시에, 개발 속도를 높여주었습니다.

"모른다"고 말하는 것을 주저하지 않고, 이해를 바탕으로 함께 설계하는 태도는 제가 가장 자랑스러워하는 역량 중 하나입니다.`,
    },
    {
      title: "협업",
      body: `저는 멋쟁이사자처럼 13기에서 프론트엔드 트랙장과 홍보팀장을 맡으며 팀원들의 성장을 이끄는 역할도 수행했습니다.

개발을 늦게 시작했기에 누구보다 배우는 입장에서 출발했고, 그래서 더 깊이 공감할 수 있는 팀원이었습니다.

질문을 주고받고, 아이디어를 조율하며, 모두가 납득할 수 있는 결과를 만들어가는 과정을 소중히 여기며 팀워크를 다져왔습니다.

그 결과, 실력뿐 아니라 소통과 협업을 통해 프로젝트를 끝까지 완수하는 경험을 여러 차례 쌓을 수 있었고, 이는 다양한 개발 환경에서의 유연한 태도와 리더십으로 이어졌습니다.`,
    },
    {
      title: "경험",
      body: `기능이 동작하는 UI보다, 사용자가 머무르고 싶어지는 경험을 설계하는 것이 제가 추구하는 프론트엔드입니다.

AI 기반 훈련 시스템에서는 단순한 카운트 측정에 그치지 않고, 실시간 피드백·훈련 종료 요약·이력 조회까지 하나의 사용자 흐름으로 구성했습니다.

이러한 경험 중심의 개발은 단순히 기술을 사용하는 것이 아닌, 사용자의 입장에서 시뮬레이션하고 고민하는 사고방식에서 비롯된다고 생각합니다.

저는 한 줄의 문구, 한 픽셀의 여백도 이유 없이 두지 않으려 노력합니다. 그리고 그 태도는 앞으로도 변하지 않을 것입니다.`,
    },
  ],
} as const;

export const MAIN_PROJECTS_UI = {
  label: "Projects",
  title: "Selected projects.",
  cta: "전체 보기",
  detailCta: "자세히",
  clickHint: "CLICK",
  challengeLabel: "문제",
  resultLabel: "해결",
} as const;

export const MAIN_SIGNALS_UI = {
  label: "Signals",
  title: "How I work.",
  topRow: [
    {
      title: "소통",
      body: "사용자 흐름과 팀 명세를 같은 속도로 맞춥니다.",
      meta: "Philosophy · Communication",
    },
    {
      title: "협업",
      body: "모두가 납득할 방향을 조율하는 일을 중요하게 봅니다.",
      meta: "Philosophy · Collaboration",
    },
    {
      title: "경험",
      body: "동작하는 UI보다 머무르고 싶은 화면을 목표로 둡니다.",
      meta: "Philosophy · Experience",
    },
    {
      title: "공유",
      body: "집단 IQ는 공유된 정보에서 온다고 믿습니다.",
      meta: "Writing · Knowledge",
    },
  ],
  bottomRow: [
    {
      title: "멋사 프론트엔드 트랙장",
      body: "13기 트랙장·홍보팀장으로 팀원 성장을 이끌었습니다.",
      meta: "Leadership",
    },
    {
      title: "D-Order Frontend Lead",
      body: "현장 주문 플랫폼의 핵심 UX와 실시간 흐름을 설계했습니다.",
      meta: "Product · Team",
    },
    {
      title: "Velog 55+",
      body: "기술 블로그로 배운 것을 꾸 남기고 나눕니다.",
      meta: "Technical Writer",
    },
    {
      title: "React · TypeScript · Next.js",
      body: "타입과 컴포넌트 경계로 읽히는 프론트를 만듭니다.",
      meta: "Stack",
    },
  ],
} as const;

export const MAIN_BLOG_UI = {
  label: "Blog",
  title: "Best Articles.",
  velogCount: 55,
  statsTemplate: (velog: number, portfolio: number, total: number) =>
    `지금까지 총 벨로그 ${velog}개, 개인 포폴 블로그 ${portfolio}개로 총 ${total}개의 지식을 공유해왔습니다.`,
  paragraphs: [
    "저는 공유의 가치를 알고 있기 때문에 글을 씁니다.",
    "하나의 조직이 잘 굴러가려면 모든 이들이 공유된 생각을 가지는 것이 중요합니다.",
    "지식과 인사이트를 적극적으로 나누어 함께 성장하는 개발자가 되고자 합니다.",
  ],
  cta: "저의 기술 블로그를 보러가요",
  empty: "아직 등록된 글이 없습니다.",
} as const;

export const MAIN_CLOSE_UI = {
  label: "Contact",
  title: "Contact.",
  body: "언제든 편하게 연락주세요",
  githubLabel: "GitHub",
  emailLabel: "Email",
  cta: "Get In Touch",
} as const;

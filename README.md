# Taejun's Portfolio

프론트엔드 개발자 오태준의 프로젝트·경험·기술 블로그를 소개하는 포트폴리오입니다.

**Live:** [https://www.taejun0-portfolio.site](https://www.taejun0-portfolio.site)

디자인 레퍼런스: [Thomas Eduardo](https://www.thomaseduardo.com.br) — deep black canvas, lime accent, numbered sections.

## 기술 스택

| 구분 | 사용 |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Emotion (CSS-in-JS), Pretendard |
| Motion | Framer Motion |
| Blog | gray-matter + remark (마크다운), GitHub Discussions |
| Comments | Giscus |
| Package manager | pnpm |

## 시작하기

```bash
pnpm install
pnpm dev
```

| 스크립트 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 빌드 결과 실행 |
| `pnpm lint` | ESLint |

### 환경 변수 (선택)

Discussions 기반 블로그 글을 안정적으로 불러오려면:

```bash
GITHUB_TOKEN=ghp_...
# 또는
GITHUB_DISCUSSIONS_TOKEN=ghp_...
```

Giscus 댓글은 `src/lib/siteConfig.ts`의 `GISCUS_CONFIG`에 `repoId`·`categoryId`를 채우면 활성화됩니다.

## 사이트 맵

| 경로 | 설명 |
| --- | --- |
| `/` | Intro → Stats → About 티저 → Projects → Stack → Blog → Contact |
| `/about` | Profile · Approach · Trajectory · Tools |
| `/projects` | 프로젝트 쇼케이스 목록 |
| `/projects/[slug]` | 프로젝트 상세 |
| `/blog` | 글 목록 (마크다운 + Discussions) |
| `/blog/[slug]` | 글 상세 + 댓글 |

## 주요 구성

### Main (`/`)

- 히어로와 핵심 지표(Stats)로 후킹
- About 티저 → `/about`으로 상세 연결
- Featured 프로젝트, Stack, 최근 글, Contact

### About (`/about`)

- Profile + Tools 마퀴
- Development Philosophy (소통 / 협업 / 경험)
- Trajectory 타임라인
- Stack 미리보기

### Projects

- 이미지 중심 쇼케이스 목록·상세
- 프로젝트 데이터: `src/features/projects/constants/projects.ts`

### Blog

두 소스를 합쳐 표시합니다.

1. **마크다운** — `content/blog/<slug>/index.md`
2. **GitHub Discussions** — `Blog` 카테고리 (slug: `d-{number}`)

글 번호는 Velog 이전 글(51편)에 이어 매깁니다.  
자세한 작성 방법은 [`content/blog/README.md`](content/blog/README.md)를 참고하세요.

## 폴더 구조

```text
src/
├── app/                 # App Router (라우트·metadata만)
├── components/          # 공통 레이아웃·UI
│   ├── layout/          # Header, Footer, Splash, PageTransition
│   ├── common/          # PortraitFrame 등
│   └── theme/           # light/dark ThemeModeProvider
├── features/            # 페이지 단위 feature
│   ├── main/
│   ├── about/
│   ├── projects/
│   ├── blog/
│   └── stack/
├── styles/              # theme, GlobalStyle, fonts
└── lib/                 # siteConfig, EmotionRegistry
content/blog/            # 마크다운 블로그 본문
public/images/           # 프로필·스택·프로젝트 이미지
```

페이지 전용 로직·컴포넌트·상수는 해당 `features/<page>/` 안에 둡니다.  
자세한 규칙은 `.cursor/rules/`를 참고합니다.

## 연락

- GitHub: [taejun0](https://github.com/taejun0)
- Email: xownswns@naver.com
- Velog: [taejun0](https://velog.io/@taejun0/posts)

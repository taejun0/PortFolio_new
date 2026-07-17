# Portfolio

스크롤 서사 중심의 포트폴리오 리빌드 프로젝트입니다.

## 기술 스택

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Emotion** (CSS-in-JS)
- **Framer Motion** (메인 Featured 스크롤 연출)
- **remark** + **gray-matter** (블로그 마크다운)
- **Giscus** (GitHub Discussions 댓글)
- **pnpm**

## 시작하기

```bash
pnpm install
pnpm dev
```

## 사이트 맵

| 경로 | 설명 |
| --- | --- |
| `/` | Intro → Thinking → Projects → Blog → Close |
| `/projects` | 프로젝트 목록 |
| `/projects/[slug]` | 프로젝트 상세 |
| `/blog` | 글 목록 |
| `/blog/[slug]` | 마크다운 본문 + Giscus 댓글 |

## 블로그

- 본문: `content/blog/<slug>/index.md`
- 댓글: `src/lib/siteConfig.ts`의 `GISCUS_CONFIG`에 repoId·categoryId 설정 후 활성화

## 폴더 컨벤션

페이지 feature 단위로 `components` / `constants` / `services` / `types`를 둔다. 자세한 규칙은 `.cursor/rules/`를 참고한다.

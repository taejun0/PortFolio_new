# Blog content

블로그는 **두 소스**를 합쳐 보여 줍니다.

## 1) 기존 글 — 마크다운 (`content/blog`)

PortfolioPage에서 옮긴 글과 레포에 직접 추가하는 글입니다.

- `content/blog/<slug>/index.md` (권장)
- 또는 `content/blog/<slug>.md`

```md
---
title: "제목"
date: "YYYY-MM-DD"
description: "한 줄 요약"
tags:
  - "태그"
series: "시리즈"
---
```

마크다운 글의 댓글은 Giscus로 `/blog/[slug]` 하단에 붙습니다. `src/lib/siteConfig.ts`의 `GISCUS_CONFIG`에 repoId·categoryId를 채우면 활성화됩니다.

## 2) 신규 글 — GitHub Discussions (`Blog` 카테고리)

1. 레포에서 Discussions를 켭니다.
2. 카테고리 이름 **`Blog`** 를 만듭니다. (`BLOG_DISCUSSIONS_CONFIG.category`)
3. 새 Discussion을 올리면 사이트 목록·상세(`/blog/d-{number}`)에 자동 반영됩니다.
4. GraphQL 조회를 안정적으로 쓰려면 `GITHUB_TOKEN`(또는 `GITHUB_DISCUSSIONS_TOKEN`) 환경 변수를 넣습니다.
5. Discussion 글의 댓글은 GitHub Discussion 스레드에서 이어갑니다.

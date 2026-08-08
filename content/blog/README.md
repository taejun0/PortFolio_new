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

## 마크다운 글 쓰는 법

폴더는 `content/blog/<slug>/index.md`로 만들고, slug는 `YYYY-MM-DD-01`처럼 날짜+순번을 씁니다. 같은 날 두 번째 글이면 `-02`입니다. 이 폴더의 `README.md`는 글 목록에 들어가지 않습니다.

페이지 맨 위 제목은 본문의 `#`이 아니라 frontmatter `title`입니다. 본문은 그 아래에서 절 제목을 붙입니다.

````md
# 서론

소개 문단.

# 본론

## 소제목

본문. **강조**, `인라인 코드`, 리스트, 표를 그대로 씁니다.

```ts
const story = { args: { disabled: true } };
```

### 더 작은 소제목

![캡션](https://example.com/image.png)

# 결론
````


- `#` : 본문의 첫 제목. `서론` / `본론` / `결론`처럼 큰 절에 씁니다.
- `##` : 본론 안의 소제목.
- `###` : 그 아래 단계.
- 본문 제목을 `# 글 제목`으로 다시 쓰지 않습니다. 이미 `title`이 페이지 제목입니다.
- 인라인 코드는 `` `코드` ``, 블록은 ` ```ts `처럼 펜스에 언어를 붙입니다. 파싱은 이미 되고, 배경·글자색은 라이트/다크 테마 토큰을 따릅니다. 문법 하이라이트(키워드 색)는 아직 없습니다.
- 이미지는 본문에 `![설명](url)`로 넣거나, 글 폴더에 파일을 두고 상대 경로를 씁니다.
- `thumbnail`은 목록 카드용입니다. 본문 대표 이미지와 별개입니다.

## 2) 신규 글 — GitHub Discussions (`Blog` 카테고리)

1. 레포에서 Discussions를 켭니다.
2. 카테고리 이름 **`Blog`** 를 만듭니다. (`BLOG_DISCUSSIONS_CONFIG.category`)
3. 새 Discussion을 올리면 사이트 목록·상세(`/blog/d-{number}`)에 자동 반영됩니다.
4. GraphQL 조회를 안정적으로 쓰려면 `GITHUB_TOKEN`(또는 `GITHUB_DISCUSSIONS_TOKEN`) 환경 변수를 넣습니다.
5. Discussion 글의 댓글은 GitHub Discussion 스레드에서 이어갑니다.

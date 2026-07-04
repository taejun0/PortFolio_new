# Portfolio

포트폴리오 웹사이트 리빌드 프로젝트입니다.
디자인·콘텐츠·페이지 구성은 아직 미확정 상태이며, 기술 기반(Next.js + Emotion + 폰트/테마 세팅)만 잡혀 있습니다.

## 기술 스택

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Emotion** (CSS-in-JS, SSR 레지스트리 구성)
- **pnpm**

## 시작하기

```bash
pnpm install
pnpm dev
```

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | ESLint 검사 |

## 현재 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (메타데이터, 폰트)
│   ├── providers.tsx           # Emotion Registry + ThemeProvider + GlobalStyle
│   └── page.tsx                # 메인 페이지 (/)
├── features/
│   └── main/                   # 메인 페이지 (구성 미정, 빈 상태)
│       ├── MainPage.tsx
│       └── MainPage.styled.ts
├── fonts/                      # Pretendard (woff2)
├── lib/                        # EmotionRegistry
└── styles/                     # theme(임시 토큰), GlobalStyle, fonts
```

## 폴더 구조 컨벤션

페이지(feature) 단위로 다음 구조를 따른다.

```
features/<페이지명>/
├── <페이지명>Page.tsx          # 페이지 진입 컴포넌트
├── <페이지명>Page.styled.ts    # 페이지 스타일
├── components/                 # 페이지 내부 컴포넌트 (폴더 단위)
│   └── <컴포넌트명>/
│       ├── <컴포넌트명>.tsx
│       └── <컴포넌트명>.styled.ts
└── constants/                  # 페이지 전용 상수 (문구, 데이터 등)
    └── index.ts
```

## 작업 원칙

- **디자인 토큰**: `src/styles/theme.ts`에 글꼴·레이아웃(간격) 토큰만 정의된 상태. 색상 토큰은 디자인 확정 시 추가하고, 컴포넌트에서 hex 직접 사용 금지.
- **문구/데이터**: 컴포넌트에 하드코딩하지 않고 해당 feature의 `constants/`에 정의.

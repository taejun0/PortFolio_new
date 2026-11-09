/**
 * 생성 이유: 라우트 전환 시 본문이 끊기지 않고 이어지게 한다.
 * 역할: 클라이언트 라우트 변경 때만 새 페이지가 왼쪽에서 짧게 쓸려 들어오는 진입 전환이다.
 * 책임: 앞으로 가는 클라이언트 이동의 스크롤 리셋(주소에 #섹션이 있으면 그 섹션으로 이동)과
 *       exit 없는 진입 스윕(data-page-enter)만 소유한다. 시각은 PageTransition.styled가 소유한다.
 *       - 첫 하드 로드에는 붙이지 않는다 — 첫 화면 제목·이미지(LCP 후보)는 첫 페인트에 그대로 칠해진다.
 *       - 새로고침·뒤로/앞으로(문서 단위든 클라이언트 기록 이동이든)는 브라우저가 복원한 스크롤을 건드리지 않고,
 *         돌아온 페이지에 진입 스윕을 다시 틀지 않는다.
 *       - exit(opacity 0)은 네비 전환 시 깜빡임 원인이라 쓰지 않는다.
 *       - 페이지 안 리빌(제목 스윕·블록 스윕)은 공용 모션 컨트롤러가 새 마운트로 알아보고 따로 재생한다.
 */
"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useState, type ReactNode } from "react";

import * as S from "./PageTransition.styled";

/**
 * 뒤로·앞으로(popstate)로 돌아온 경로. 모듈 평가 때(= Next가 popstate를 처리해 새 경로를 렌더하기 전에)
 * 리스너를 걸어 기록해 두면, 그 경로의 렌더·효과가 기록 이동임을 알아 스크롤은 브라우저 복원에 맡기고
 * 진입 스윕을 생략한다. 경로가 바뀔 때마다 비워 해시만 바뀐 popstate가 다음 이동으로 새지 않는다.
 */
let traversalPath: string | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    traversalPath = window.location.pathname;
  });
}

/** 새로고침·문서 단위 뒤로/앞으로로 연 문서 — 브라우저가 이전 스크롤 위치를 복원해 칠한다. */
const isRestoredDocument = () => {
  try {
    const [entry] = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    return entry?.type === "reload" || entry?.type === "back_forward";
  } catch {
    return false;
  }
};

/** 주소의 #해시가 가리키는 요소. 깨진 퍼센트 인코딩이면 원문 그대로 찾는다. */
const findHashTarget = () => {
  const raw = window.location.hash.slice(1);
  if (!raw) return null;
  try {
    return document.getElementById(decodeURIComponent(raw));
  } catch {
    return document.getElementById(raw);
  }
};

const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  /*
   * 첫 문서 주소에서 한 번이라도 벗어났는지 — 렌더 중 이전 값과 비교해(React 권장 패턴) 새 페이지의 첫 커밋부터 맞는다.
   * SSR·hydration은 항상 false라 첫 로드 마크업이 같고, 첫 주소로 돌아와도 클라이언트 전환이면 다시 들어온다.
   */
  const [landingPath] = useState(pathname);
  const [navigated, setNavigated] = useState(false);
  const leftLanding = pathname !== landingPath;
  if (leftLanding && !navigated) setNavigated(true);
  const entering = navigated || leftLanding;
  /* 뒤로·앞으로로 돌아온 페이지는 진입 스윕 없이 그대로 보인다(브라우저가 스크롤을 되돌린다). */
  const traversing = traversalPath === pathname;

  useLayoutEffect(() => {
    /*
     * 첫 문서(이 탭에서 연 주소, 아직 클라이언트 이동 전)인지. 효과 실행 횟수가 아니라 이동 상태로 판단해
     * 개발 모드 StrictMode가 효과를 두 번 돌려도 새로고침 복원을 0으로 당기지 않는다.
     */
    const first = !entering;
    const traversal = traversalPath === pathname;
    traversalPath = null;
    // 클라이언트 기록 이동(뒤로·앞으로): 브라우저가 복원한 위치를 그대로 둔다.
    if (traversal) return;
    // 새로고침·문서 단위 뒤로/앞으로: 브라우저가 이미 복원해 칠한 위치를 hydration이 맨 위로 당기지 않는다.
    if (first && isRestoredDocument()) return;

    // 공유된 /#close, /projects/[slug]#challenges 같은 링크는 그 섹션에서 시작한다.
    // html의 scroll-padding-top(= 헤더 높이, GlobalStyle)이 고정 헤더 바로 아래에 맞춰 멈추게 한다.
    const target = findHashTarget();
    if (!target) {
      // 앞으로 가는 클라이언트 이동은 새 페이지 맨 위에서 시작한다(새로 연 첫 문서는 이미 맨 위다).
      if (!first) window.scrollTo(0, 0);
      return;
    }

    target.scrollIntoView({ block: "start" });
    // 첫 페인트 뒤 폰트·이미지로 위쪽 높이가 바뀌어도 한 프레임 뒤 다시 맞춘다.
    const frame = window.requestAnimationFrame(() =>
      target.scrollIntoView({ block: "start" })
    );
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, entering]);

  return (
    <S.Page
      key={pathname}
      data-page-enter={entering && !traversing ? "" : undefined}
    >
      {children}
    </S.Page>
  );
};

export default PageTransition;

/**
 * 생성 이유: 없는 주소·notFound()가 Next 기본 404 대신 사이트 테마의 404 화면을 쓰게 한다.
 * 역할: App Router 루트 not-found 진입점이다(사이트 셸 안에서 렌더링되고 상태 코드는 404).
 * 책임: 문서 제목 메타데이터(루트 템플릿 → "페이지를 찾을 수 없습니다 | 오태준 포트폴리오")와 NotFoundPage 연결만 담당한다.
 */
import type { Metadata } from "next";

import NotFoundPage from "@/features/notFound/NotFoundPage";
import { NOT_FOUND_UI } from "@/features/notFound/constants";

export const metadata: Metadata = {
  title: NOT_FOUND_UI.title,
};

export default function NotFound() {
  return <NotFoundPage />;
}

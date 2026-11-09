/**
 * 생성 이유: 404 화면 문구를 JSX에서 분리한다.
 * 역할: 없는 주소(not-found) 화면의 라벨·제목·안내·CTA 문구 상수다.
 * 책임: notFound feature의 정적 문구만 관리한다. 제목은 라우트 메타데이터(문서 제목)도 함께 쓴다.
 */
export const NOT_FOUND_UI = {
  label: "404",
  title: "페이지를 찾을 수 없습니다",
  body: "주소가 바뀌었거나 삭제된 페이지입니다.",
  cta: "홈으로",
} as const;

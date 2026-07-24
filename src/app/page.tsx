/**
 * 생성 이유: 루트 URL과 메인 페이지 기능을 연결한다.
 * 역할: App Router의 `/` 라우트 진입점이다.
 * 책임: MainPage를 연결하는 얇은 계층을 유지한다.
 */
import MainPage from "@/features/main/MainPage";

export default function Page() {
  return <MainPage />;
}

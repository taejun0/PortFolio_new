/**
 * 생성 이유: 루트 URL과 메인 페이지 기능을 연결한다.
 * 역할: App Router의 `/` 라우트 진입점이다.
 * 책임: 최근 글 데이터를 읽어 MainPage에 전달하는 얇은 연결 계층을 유지한다.
 */
import MainPage from "@/features/main/MainPage";
import { getRecentBlogPosts } from "@/features/blog/services/blog";

export default async function Page() {
  const recentPosts = await getRecentBlogPosts(3);
  return <MainPage recentPosts={recentPosts} />;
}

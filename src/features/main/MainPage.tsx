/**
 * 생성 이유: 메인 페이지에 속한 UI와 동작을 라우트 계층에서 분리한다.
 * 역할: Thomas Eduardo식 섹션 스크롤 메인 페이지다.
 * 책임: Hero→About→Thinking→Projects→Signals→Blog→Contact 순서를 관리한다.
 */
"use client";

import * as S from "./MainPage.styled";
import IntroSection from "./components/intro/IntroSection";
import AboutSection from "./components/about/AboutSection";
import ThinkingSection from "./components/thinking/ThinkingSection";
import ProjectsSection from "./components/projects/ProjectsSection";
import SignalsSection from "./components/signals/SignalsSection";
import BlogSection from "./components/blog/BlogSection";
import CloseSection from "./components/close/CloseSection";
import type { BlogPostMeta } from "@/features/blog/types";

type MainPageProps = {
  recentPosts: BlogPostMeta[];
};

const MainPage = ({ recentPosts }: MainPageProps) => (
  <S.Wrapper>
    <IntroSection />
    <AboutSection />
    <ThinkingSection />
    <ProjectsSection />
    <SignalsSection />
    <BlogSection posts={recentPosts} />
    <CloseSection />
  </S.Wrapper>
);

export default MainPage;

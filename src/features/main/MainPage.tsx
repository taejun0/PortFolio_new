/**
 * 생성 이유: 메인 페이지에 속한 UI와 동작을 라우트 계층에서 분리한다.
 * 역할: Thomas Eduardo식 섹션 스크롤 메인 페이지다.
 * 책임: Hero→지표→About→Projects→Stack→Blog→Contact 순서를 관리한다.
 */
"use client";

import * as S from "./MainPage.styled";
import IntroSection from "./components/intro/IntroSection";
import StatsSection from "./components/stats/StatsSection";
import AboutSection from "./components/about/AboutSection";
import ProjectsSection from "./components/projects/ProjectsSection";
import StackSection from "./components/stack/StackSection";
import BlogSection from "./components/blog/BlogSection";
import CloseSection from "./components/close/CloseSection";
import type { BlogPostMeta } from "@/features/blog/types";

type MainPageProps = {
  recentPosts: BlogPostMeta[];
};

const MainPage = ({ recentPosts }: MainPageProps) => (
  <S.Wrapper>
    <IntroSection />
    <StatsSection />
    <AboutSection />
    <ProjectsSection />
    <StackSection />
    <BlogSection posts={recentPosts} />
    <CloseSection />
  </S.Wrapper>
);

export default MainPage;

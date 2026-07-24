/**
 * 생성 이유: 메인 페이지에 속한 UI와 동작을 라우트 계층에서 분리한다.
 * 역할: 섹션 스크롤 메인 페이지다.
 * 책임: Hero→About→Projects→Stack→Blog→Contact 순서를 관리한다.
 */
"use client";

import * as S from "./MainPage.styled";
import IntroSection from "./components/intro/IntroSection";
import AboutSection from "./components/about/AboutSection";
import ProjectsSection from "./components/projects/ProjectsSection";
import StackSection from "./components/stack/StackSection";
import BlogSection from "./components/blog/BlogSection";
import CloseSection from "./components/close/CloseSection";

const MainPage = () => (
  <S.Wrapper>
    <IntroSection />
    <AboutSection />
    <ProjectsSection />
    <StackSection />
    <BlogSection />
    <CloseSection />
  </S.Wrapper>
);

export default MainPage;

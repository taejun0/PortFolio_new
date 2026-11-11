/**
 * 생성 이유: 메인 페이지에 속한 UI와 동작을 라우트 계층에서 분리한다.
 * 역할: 섹션 스크롤 메인 페이지다.
 * 책임: Hero→Projects→About→Stack→Blog→Contact 순서를 관리한다.
 *       Featured 책장 데이터는 서버(app/page.tsx)가 고른 필드만 props로 받아 Projects 섹션에 넘긴다.
 */
"use client";

import * as S from "./MainPage.styled";
import IntroSection from "./components/intro/IntroSection";
import AboutSection from "./components/about/AboutSection";
import ProjectsSection from "./components/projects/ProjectsSection";
import StackSection from "./components/stack/StackSection";
import BlogSection from "./components/blog/BlogSection";
import CloseSection from "./components/close/CloseSection";
import type { ShelfProject } from "./components/projects/projectShelfItem/ProjectShelfItem";

type MainPageProps = {
  /** Featured 책장 항목 — slug·제목·요약·표지만 담긴다 */
  projects: ShelfProject[];
};

const MainPage = ({ projects }: MainPageProps) => (
  <S.Wrapper>
    <IntroSection />
    <ProjectsSection projects={projects} />
    <AboutSection />
    <StackSection />
    <BlogSection />
    <CloseSection />
  </S.Wrapper>
);

export default MainPage;

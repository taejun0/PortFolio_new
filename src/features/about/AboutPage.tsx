/**
 * 생성 이유: About 상세를 메인 티저와 분리해 Thomas식 자기소개 페이지로 둔다.
 * 역할: /about 페이지 feature 컴포넌트다.
 * 책임: 프로필·접근·궤적·툴 챕터를 순서대로 조합한다.
 */
"use client";

import SplashScreen from "@/components/layout/splash/SplashScreen";

import * as S from "./AboutPage.styled";
import ApproachSection from "./components/approach/ApproachSection";
import ProfileSection from "./components/profile/ProfileSection";
import ToolsSection from "./components/tools/ToolsSection";
import TrajectorySection from "./components/trajectory/TrajectorySection";

const AboutPage = () => (
  <S.Wrapper>
    <SplashScreen />
    <ProfileSection />
    <ApproachSection />
    <TrajectorySection />
    <ToolsSection />
  </S.Wrapper>
);

export default AboutPage;

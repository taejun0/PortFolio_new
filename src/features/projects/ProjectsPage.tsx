/**
 * 생성 이유: 프로젝트 목록 UI를 라우트 계층과 분리한다.
 * 역할: /projects 페이지 feature 컴포넌트다.
 * 책임: 히어로와 번호·기간·형태 메타를 갖춘 케이스 카드 리스트, 상세 링크를 렌더링한다.
 *       카드 데이터(ProjectCard)는 라우트(서버)가 PROJECTS에서 카드에 보이는 필드만 골라 넘긴다 —
 *       프로젝트 전체 원문(개요·의사결정·Challenge)이 이 클라이언트 번들에 실리지 않는다.
 *       모션 — 페이지 제목은 캔버스색 커튼이 걷히는 스윕(첫 페인트부터 칠해져 LCP 안전),
 *       라벨·리드는 어절 스윕, 카드는 화면에 함께 들어온 것끼리 읽는 순서대로 쓸려 들어온다.
 */
"use client";

import SplashScreen from "@/components/layout/splash/SplashScreen";

import Image from "next/image";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, RollText, SweepText } from "@/components/common/motion";
import { motionTokens } from "@/styles/theme";
import * as S from "./ProjectsPage.styled";
import { PROJECTS_PAGE_UI } from "./constants";
import { projectDetailPath } from "@/constants/routes";

/**
 * 목록 카드 한 장에 필요한 값 — 서버(라우트)가 Project에서 계산해 넘긴다.
 * period는 짧은 기간 표기(없으면 연도), kind는 표시 문구(PROJECTS_PAGE_UI.kindLabel), takeaway는 첫 Challenge의 배운 점이다.
 */
export type ProjectCard = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  imageMatte?: string;
  role: string;
  period: string;
  kind: string | null;
  takeaway: string;
};

type ProjectsPageProps = {
  projects: ProjectCard[];
};

/**
 * 카드 썸네일의 실제 표시 폭 — Wrapper 거터·카드 패딩·열 구성에서 뽑은 값이다.
 * 폰 1열(≈92.6vw−24px) → 태블릿~소형 데스크톱 2열(≈45vw−22px) → wide 가로 카드(49vw, 1330px부터 640px 고정).
 * 실제보다 크게 적으면 폰이 한 단계 큰 변환본을 받는다(Lighthouse 이미지 낭비 경고의 원인이었다).
 */
const CARD_IMAGE_SIZES =
  "(min-width: 1330px) 640px, (min-width: 1280px) 49vw, (min-width: 768px) calc(45vw - 22px), calc(92.6vw - 24px)";

const ProjectsPage = ({ projects }: ProjectsPageProps) => (
  <S.Wrapper>
    <SplashScreen />
    <S.Inner>
      <S.Intro>
        <SweepText as={S.Label}>{PROJECTS_PAGE_UI.label}</SweepText>
        <SweepText
          as={S.Title}
          variant="curtain"
          duration={motionTokens.duration.title}
        >
          {PROJECTS_PAGE_UI.title}
        </SweepText>
        <SweepText as={S.Subtitle}>{PROJECTS_PAGE_UI.subtitle}</SweepText>
      </S.Intro>

      {projects.length === 0 ? (
        <S.Empty>{PROJECTS_PAGE_UI.empty}</S.Empty>
      ) : (
        <S.List>
          {projects.map((project, index) => {
            const order = String(index + 1).padStart(2, "0");
            const { period, kind, takeaway } = project;
            // 첫 카드 썸네일은 폰·데스크톱 모두 첫 화면 LCP 후보라 HTML에서 바로 높은 우선순위로 받는다.
            const isLead = index === 0;

            return (
              <Reveal as={S.Item} key={project.slug}>
                <S.Card>
                  <S.Media $matte={project.imageMatte}>
                    {/* 제목 링크가 이름을 주므로 썸네일은 장식으로 둔다. */}
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes={CARD_IMAGE_SIZES}
                      style={{
                        objectFit: project.imageMatte ? "contain" : "cover",
                      }}
                      preload={isLead}
                      fetchPriority={isLead ? "high" : undefined}
                    />
                  </S.Media>

                  <S.Copy>
                    <S.Head>
                      <S.Meta>
                        <S.Index aria-hidden>{order}</S.Index>
                        {period || kind ? (
                          <S.Facts>
                            {period ? <S.Fact>{period}</S.Fact> : null}
                            {kind ? <S.Fact>{kind}</S.Fact> : null}
                          </S.Facts>
                        ) : null}
                      </S.Meta>
                      <S.Role>{project.role}</S.Role>
                      {/* 링크 이름은 보이는 제목 그대로 — 카드 전체 클릭은 링크의 ::after가 맡는다. */}
                      <S.ItemTitle>
                        <S.CardLink href={projectDetailPath(project.slug)}>
                          {project.title}
                        </S.CardLink>
                      </S.ItemTitle>
                      <S.ItemSummary>{project.summary}</S.ItemSummary>
                    </S.Head>

                    <S.Foot>
                      {takeaway ? (
                        <S.Result>
                          <S.ResultLabel>
                            {PROJECTS_PAGE_UI.takeawayLabel}
                          </S.ResultLabel>
                          <S.ResultText>{takeaway}</S.ResultText>
                        </S.Result>
                      ) : null}

                      {/* 제목 링크와 같은 이동을 알리는 시각 단서 — 링크 이름과 겹치지 않게 낭독에서는 뺀다. */}
                      <S.Cta aria-hidden>
                        <RollText>{PROJECTS_PAGE_UI.viewProject}</RollText>
                        <HoverArrow />
                      </S.Cta>
                    </S.Foot>
                  </S.Copy>
                </S.Card>
              </Reveal>
            );
          })}
        </S.List>
      )}
    </S.Inner>
  </S.Wrapper>
);

export default ProjectsPage;

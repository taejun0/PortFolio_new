/**
 * 생성 이유: 프로젝트 목록 UI를 라우트 계층과 분리한다.
 * 역할: /projects 페이지 feature 컴포넌트다.
 * 책임: 히어로·대형 케이스 카드 리스트와 상세 링크를 렌더링한다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";

import * as S from "./ProjectsPage.styled";
import {
  PROJECTS_PAGE_UI,
  extractProjectYear,
} from "./constants";
import { PROJECTS } from "./constants/projects";
import { projectDetailPath } from "@/constants/routes";

const ProjectsPage = () => (
  <S.Wrapper>
    <S.Inner>
      <S.Intro>
        <S.Label>{PROJECTS_PAGE_UI.label}</S.Label>
        <S.Title>{PROJECTS_PAGE_UI.title}</S.Title>
        <S.Subtitle>{PROJECTS_PAGE_UI.subtitle}</S.Subtitle>
      </S.Intro>

      {PROJECTS.length === 0 ? (
        <S.Empty>{PROJECTS_PAGE_UI.empty}</S.Empty>
      ) : (
        <S.List>
          {PROJECTS.map((project, index) => {
            const year = extractProjectYear(project.period);
            const result =
              project.challenges[0]?.learnings ??
              project.challenges[0]?.solution ??
              "";

            return (
              <S.Item key={project.slug}>
                <Link href={projectDetailPath(project.slug)}>
                  <S.Media>
                    <Image
                      src={project.image}
                      alt={`${project.title} 미리보기`}
                      fill
                      sizes="(max-width: 768px) 92vw, 55vw"
                      style={{ objectFit: "cover" }}
                      priority={index < 2}
                    />
                    <S.Badges>
                      <S.Badge>{String(index + 1).padStart(2, "0")}</S.Badge>
                      {year ? <S.Badge>{year}</S.Badge> : null}
                    </S.Badges>
                  </S.Media>

                  <S.Copy>
                    <S.Category>{project.role}</S.Category>
                    <S.ItemTitle>{project.title}</S.ItemTitle>
                    <S.ItemSummary>{project.summary}</S.ItemSummary>
                    <S.ItemBody>{project.overview}</S.ItemBody>

                    {result ? (
                      <S.Block>
                        <S.BlockLabel>
                          {PROJECTS_PAGE_UI.resultLabel}
                        </S.BlockLabel>
                        <S.BlockText>{result}</S.BlockText>
                      </S.Block>
                    ) : null}

                    <S.Block>
                      <S.BlockLabel>
                        {PROJECTS_PAGE_UI.galleryLabel}
                      </S.BlockLabel>
                      <S.Tags>
                        {project.tags.map((tag) => (
                          <S.Tag key={tag}>{tag}</S.Tag>
                        ))}
                      </S.Tags>
                    </S.Block>

                    <S.Cta>{PROJECTS_PAGE_UI.viewProject} ↗</S.Cta>
                  </S.Copy>
                </Link>
              </S.Item>
            );
          })}
        </S.List>
      )}
    </S.Inner>
  </S.Wrapper>
);

export default ProjectsPage;

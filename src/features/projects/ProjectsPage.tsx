/**
 * 생성 이유: 프로젝트 목록 UI를 라우트 계층과 분리한다.
 * 역할: /projects 페이지 feature 컴포넌트다.
 * 책임: 전체 프로젝트 리스트와 상세 링크를 렌더링한다.
 */
"use client";

import Link from "next/link";

import * as S from "./ProjectsPage.styled";
import { PROJECTS_PAGE_UI } from "./constants";
import { PROJECTS } from "./constants/projects";
import { projectDetailPath } from "@/constants/routes";

const ProjectsPage = () => (
  <S.Wrapper>
    <S.Inner>
      <S.Label>{PROJECTS_PAGE_UI.label}</S.Label>
      <S.Title>{PROJECTS_PAGE_UI.title}</S.Title>
      {PROJECTS.length === 0 ? (
        <p>{PROJECTS_PAGE_UI.empty}</p>
      ) : (
        <S.List>
          {PROJECTS.map((project) => (
            <S.Item key={project.slug}>
              <Link href={projectDetailPath(project.slug)}>
                <S.ItemTitle>{project.title}</S.ItemTitle>
                <S.ItemSummary>{project.summary}</S.ItemSummary>
                <S.Meta>
                  {project.period} · {project.role} · {project.tags.join(" / ")}
                </S.Meta>
              </Link>
            </S.Item>
          ))}
        </S.List>
      )}
    </S.Inner>
  </S.Wrapper>
);

export default ProjectsPage;

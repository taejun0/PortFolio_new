/**
 * 생성 이유: 프로젝트 목록 UI를 라우트 계층과 분리한다.
 * 역할: /projects 페이지 feature 컴포넌트다.
 * 책임: 컴팩트 미디어 + 카피 케이스 리스트와 상세 링크를 렌더링한다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";

import * as S from "./ProjectsPage.styled";
import { PROJECTS_PAGE_UI } from "./constants";
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
          {PROJECTS.map((project, index) => (
            <S.Item key={project.slug}>
              <Link href={projectDetailPath(project.slug)}>
                <S.Row>
                  <S.Media>
                    <Image
                      src={project.image}
                      alt={`${project.title} 미리보기`}
                      fill
                      sizes="(max-width: 768px) 88vw, 28rem"
                      style={{ objectFit: "cover" }}
                      priority={index < 2}
                    />
                  </S.Media>
                  <S.Copy>
                    <S.IndexRow>
                      <S.Index>{String(index + 1).padStart(2, "0")}</S.Index>
                      {project.featured ? (
                        <S.Featured>{PROJECTS_PAGE_UI.featuredBadge}</S.Featured>
                      ) : null}
                    </S.IndexRow>
                    <S.ItemTitle>{project.title}</S.ItemTitle>
                    <S.ItemSummary>{project.summary}</S.ItemSummary>
                    <S.Meta>
                      <span>{project.period}</span>
                      <S.Dot aria-hidden>·</S.Dot>
                      <span>{project.role}</span>
                    </S.Meta>
                    <S.Tags>
                      {project.tags.slice(0, 4).map((tag) => (
                        <S.Tag key={tag}>{tag}</S.Tag>
                      ))}
                    </S.Tags>
                  </S.Copy>
                </S.Row>
              </Link>
            </S.Item>
          ))}
        </S.List>
      )}
    </S.Inner>
  </S.Wrapper>
);

export default ProjectsPage;

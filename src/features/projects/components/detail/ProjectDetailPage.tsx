/**
 * 생성 이유: 프로젝트 상세 UI를 라우트 계층과 분리한다.
 * 역할: /projects/[slug] feature 컴포넌트다.
 * 책임: 커버 이미지·개요·의사결정·역할·트러블슈팅을 구조화해 보여 준다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";

import * as S from "./ProjectDetailPage.styled";
import { PROJECTS_PAGE_UI } from "../../constants";
import type { Project } from "../../constants/projects";
import { ROUTES } from "@/constants/routes";

type ProjectDetailPageProps = {
  project: Project;
};

const ProjectDetailPage = ({ project }: ProjectDetailPageProps) => (
  <S.Wrapper>
    <S.Inner>
      <Link href={ROUTES.PROJECTS}>
        <S.BackLink>{PROJECTS_PAGE_UI.backToList}</S.BackLink>
      </Link>

      <S.Hero>
        <S.HeroCopy>
          <S.Title>{project.title}</S.Title>
          <S.Meta>
            {project.period}
            <S.Dot aria-hidden>·</S.Dot>
            {project.role}
            <S.Dot aria-hidden>·</S.Dot>
            {project.team}
          </S.Meta>
          <S.Tags>
            {project.tags.map((tag) => (
              <S.Tag key={tag}>{tag}</S.Tag>
            ))}
          </S.Tags>
          {(project.github || project.demo) && (
            <S.Links>
              {project.github ? (
                <S.ExtLink
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  {PROJECTS_PAGE_UI.viewGithub} →
                </S.ExtLink>
              ) : null}
              {project.demo ? (
                <S.ExtLink href={project.demo} target="_blank" rel="noreferrer">
                  {PROJECTS_PAGE_UI.viewDemo} →
                </S.ExtLink>
              ) : null}
            </S.Links>
          )}
        </S.HeroCopy>

        <S.Cover>
          <Image
            src={project.image}
            alt={`${project.title} 커버`}
            fill
            sizes="(max-width: 768px) 92vw, 60vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </S.Cover>
      </S.Hero>

      <S.Overview>{project.overview}</S.Overview>

      <S.Block>
        <S.BlockTitle>{PROJECTS_PAGE_UI.decisionsHeading}</S.BlockTitle>
        <S.List>
          {project.decisions.map((item) => (
            <S.ListItem key={item}>{item}</S.ListItem>
          ))}
        </S.List>
      </S.Block>

      <S.Block>
        <S.BlockTitle>{PROJECTS_PAGE_UI.rolesHeading}</S.BlockTitle>
        <S.List>
          {project.roles.map((item) => (
            <S.ListItem key={item}>{item}</S.ListItem>
          ))}
        </S.List>
      </S.Block>

      <S.Block>
        <S.BlockTitle>{PROJECTS_PAGE_UI.challengesHeading}</S.BlockTitle>
        {project.challenges.map((challenge) => (
          <S.Challenge key={challenge.problem}>
            <S.ChallengeLabel>{PROJECTS_PAGE_UI.problemLabel}</S.ChallengeLabel>
            <S.ChallengeText>{challenge.problem}</S.ChallengeText>
            <S.ChallengeLabel>{PROJECTS_PAGE_UI.solutionLabel}</S.ChallengeLabel>
            <S.ChallengeText>{challenge.solution}</S.ChallengeText>
            <S.ChallengeLabel>{PROJECTS_PAGE_UI.learningsLabel}</S.ChallengeLabel>
            <S.ChallengeText>{challenge.learnings}</S.ChallengeText>
          </S.Challenge>
        ))}
      </S.Block>
    </S.Inner>
  </S.Wrapper>
);

export default ProjectDetailPage;

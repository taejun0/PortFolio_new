/**
 * 생성 이유: 메인 Featured 프로젝트를 Process 가로 아코디언 책장으로 보여 주기 위함이다.
 * 역할: Projects 섹션 컴포넌트다.
 * 책임: 활성 spine 상태·헤더·책장 트랙·아카이브 링크를 관리한다.
 */
"use client";

import Link from "next/link";
import { useState } from "react";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./ProjectsSection.styled";
import ProjectShelfItem from "./projectShelfItem/ProjectShelfItem";
import { MAIN_PROJECTS_UI, MAIN_SECTION_IDS } from "../../constants";
import { ROUTES } from "@/constants/routes";
import { getFeaturedProjects } from "@/features/projects/constants/projects";

const ProjectsSection = () => {
  const featured = getFeaturedProjects();
  const [active, setActive] = useState(0);

  return (
    <P.Section id={MAIN_SECTION_IDS.projects}>
      <P.SectionInner>
        <P.Label>{MAIN_PROJECTS_UI.label}</P.Label>
        <S.Header>
          <S.TitleBlock>
            <P.Title $flush>{MAIN_PROJECTS_UI.title}</P.Title>
            <S.Aside>{MAIN_PROJECTS_UI.aside}</S.Aside>
          </S.TitleBlock>
          <Link href={ROUTES.PROJECTS}>
            <S.ArchiveLink>
              {MAIN_PROJECTS_UI.cta}
              <HoverArrow aria-hidden />
            </S.ArchiveLink>
          </Link>
        </S.Header>
        <S.Shelf>
          {featured.map((project, index) => (
            <ProjectShelfItem
              key={project.slug}
              project={project}
              index={index}
              expanded={active === index}
              onActivate={() => setActive(index)}
            />
          ))}
        </S.Shelf>
      </P.SectionInner>
    </P.Section>
  );
};

export default ProjectsSection;

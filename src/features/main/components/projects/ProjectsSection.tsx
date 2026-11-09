/**
 * 생성 이유: 메인 Featured 프로젝트를 Process 아코디언 책장으로 보여 주기 위함이다.
 * 역할: Projects 섹션 컴포넌트다.
 * 책임: 활성 칸 상태·헤더·책장 트랙·아카이브 링크와 섹션 등장 순서를 관리한다.
 *       헤더는 라벨→제목→보조 문구→링크→책장 순으로 같은 가로 스윕을 탄다(공용 리빌 배치 스태거).
 *       책장 항목은 서버가 고른 필드(ShelfProject)만 props로 받는다 — 프로젝트 데이터 모듈을 값으로 가져오지 않는다.
 */
"use client";

import Link from "next/link";
import { useState, type PointerEvent } from "react";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, RollText, SweepText } from "@/components/common/motion";
import * as P from "../shared/SectionPrimitives.styled";
import * as S from "./ProjectsSection.styled";
import ProjectShelfItem, {
  type ShelfEdge,
  type ShelfProject,
} from "./projectShelfItem/ProjectShelfItem";
import { MAIN_PROJECTS_UI, MAIN_SECTION_IDS } from "../../constants";
import { ROUTES } from "@/constants/routes";

type ProjectsSectionProps = {
  /** 책장에 놓을 Featured 프로젝트 — 순서대로 01·02·03 칸이 된다 */
  projects: ShelfProject[];
};

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const [active, setActive] = useState(0);
  /** 마우스가 책장에 들어왔는지 — 이후로는 접힌 책등도 펼침 크기 표지를 받아 펼치는 순간 선명하다. */
  const [warm, setWarm] = useState(false);

  const edgeOf = (index: number): ShelfEdge =>
    index === active ? "open" : index < active ? "before" : "after";

  const warmUp = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === "mouse") setWarm(true);
  };

  return (
    <P.Section id={MAIN_SECTION_IDS.projects}>
      <P.SectionInner>
        <SweepText as={P.Label}>{MAIN_PROJECTS_UI.label}</SweepText>
        <S.Header>
          <S.TitleBlock>
            <SweepText as={P.Title} $flush>
              {MAIN_PROJECTS_UI.title}
            </SweepText>
            <SweepText as={S.Aside}>{MAIN_PROJECTS_UI.aside}</SweepText>
          </S.TitleBlock>
          <Reveal as={Link} href={ROUTES.PROJECTS}>
            <S.ArchiveLink>
              <RollText>{MAIN_PROJECTS_UI.cta}</RollText>
              <HoverArrow aria-hidden />
            </S.ArchiveLink>
          </Reveal>
        </S.Header>
        <Reveal
          as={S.Shelf}
          $count={projects.length}
          onPointerEnter={warm ? undefined : warmUp}
        >
          {projects.map((project, index) => (
            <ProjectShelfItem
              key={project.slug}
              project={project}
              index={index}
              edge={edgeOf(index)}
              warm={warm}
              onActivate={() => setActive(index)}
            />
          ))}
        </Reveal>
      </P.SectionInner>
    </P.Section>
  );
};

export default ProjectsSection;

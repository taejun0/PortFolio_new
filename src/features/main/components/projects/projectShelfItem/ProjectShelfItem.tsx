/**
 * 생성 이유: Featured 프로젝트를 Process 가로 아코디언 책장으로 보여 주기 위함이다.
 * 역할: 접힌 spine / 펼친 미디어 패널을 렌더링하는 shelf 아이템이다.
 * 책임: 활성화 콜백과 펼침 시 상세 링크만 관리한다.
 */
"use client";

import Image from "next/image";
import type { KeyboardEvent } from "react";

import * as S from "./ProjectShelfItem.styled";
import { projectDetailPath } from "@/constants/routes";
import type { Project } from "@/features/projects/constants/projects";

type ProjectShelfItemProps = {
  project: Project;
  index: number;
  expanded: boolean;
  onActivate: () => void;
};

const ProjectShelfItem = ({
  project,
  index,
  expanded,
  onActivate,
}: ProjectShelfItemProps) => {
  const label = String(index + 1).padStart(2, "0");

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (expanded) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <S.Spine
      $expanded={expanded}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={expanded ? undefined : onActivate}
      onKeyDown={onKeyDown}
      role={expanded ? undefined : "button"}
      tabIndex={expanded ? undefined : 0}
      aria-expanded={expanded ? undefined : false}
      title={expanded ? undefined : `${project.title} 펼치기`}
    >
      {expanded ? (
        <S.PanelLink href={projectDetailPath(project.slug)}>
          <S.Media>
            <Image
              src={project.image}
              alt={`${project.title} 대표 이미지`}
              fill
              sizes="(max-width: 768px) 92vw, 55vw"
            />
          </S.Media>
          <S.PanelCopy>
            <S.IndexPill>{label}</S.IndexPill>
            <S.PanelText>
              <S.PanelTitle>{project.title}</S.PanelTitle>
              <S.PanelSummary>{project.summary}</S.PanelSummary>
            </S.PanelText>
          </S.PanelCopy>
        </S.PanelLink>
      ) : (
        <S.Collapsed>
          <S.SpineLabel>{project.title}</S.SpineLabel>
          <S.IndexPill>{label}</S.IndexPill>
        </S.Collapsed>
      )}
    </S.Spine>
  );
};

export default ProjectShelfItem;

/** 데스크톱은 미리보기와 상세 이동을 분리하고, 모바일은 한 번 눌러 이동한다. */
"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { MAIN_PROJECTS_UI } from "../../../constants";
import { projectDetailPath } from "@/constants/routes";
import type { Project } from "@/features/projects/constants/projects";
import * as S from "./ProjectShelfItem.styled";

export type { ShelfEdge } from "./ProjectShelfItem.styled";
export type ShelfProject = Pick<Project, "slug" | "title" | "summary" | "image" | "role" | "featuredStory">;
const COVER_SIZES = {
  open: "(max-width: 767px) 92vw, (max-width: 1023px) 75vw, 56vw",
  spine: "(max-width: 767px) 92vw, 256px",
} as const;
type Props = { project: ShelfProject; index: number; edge: S.ShelfEdge; warm: boolean; onActivate: () => void };

export default function ProjectShelfItem({ project, index, edge, warm, onActivate }: Props) {
  const expanded = edge === "open";
  const label = String(index + 1).padStart(2, "0");
  const sizes = expanded || warm ? COVER_SIZES.open : COVER_SIZES.spine;
  const [previousExpanded, setPreviousExpanded] = useState(expanded);
  const [hasToggled, setHasToggled] = useState(false);
  if (previousExpanded !== expanded) { setPreviousExpanded(expanded); setHasToggled(true); }

  return (
    <S.Item data-edge={edge} data-animate={hasToggled ? "" : undefined} style={{ "--shelf-index": index } as CSSProperties}>
      <S.Card onPointerEnter={event => { if (event.pointerType === "mouse") onActivate(); }}>
        <S.Window>
          <S.Media aria-hidden><Image src={project.image} alt="" fill sizes={sizes} fetchPriority={expanded ? undefined : "low"}/></S.Media>
          <S.PreviewButton type="button" aria-label={`${project.title} ${MAIN_PROJECTS_UI.previewSuffix}`} aria-pressed={expanded} aria-controls="featured-project-story" onFocus={onActivate} onClick={onActivate}/>
          <S.PanelCopy aria-hidden={!expanded}>
            <S.IndexPill aria-hidden>{label}</S.IndexPill>
            <S.PanelTitle>{project.title}</S.PanelTitle>
            <S.DetailCta href={projectDetailPath(project.slug)} tabIndex={expanded ? 0 : -1}>{MAIN_PROJECTS_UI.detailCta}<HoverArrow aria-hidden /></S.DetailCta>
          </S.PanelCopy>
          <S.Spine aria-hidden><S.SpineTitle>{project.title}</S.SpineTitle><S.IndexPill>{label}</S.IndexPill></S.Spine>
        </S.Window>
      </S.Card>
      <S.MobileCard href={projectDetailPath(project.slug)}>
        <S.MobileMedia><Image src={project.image} alt="" fill sizes={COVER_SIZES.open}/></S.MobileMedia>
        <S.MobileCopy>
          <S.MobileCategory>{label} · {project.featuredStory?.category ?? project.role}</S.MobileCategory>
          <S.MobileTitle>{project.title}</S.MobileTitle>
          <S.MobileRole>{project.role}</S.MobileRole>
          <S.MobileSummary>{project.featuredStory?.outcome ?? project.summary}</S.MobileSummary>
          <S.MobileCta>{MAIN_PROJECTS_UI.detailCta}<HoverArrow aria-hidden /></S.MobileCta>
        </S.MobileCopy>
      </S.MobileCard>
    </S.Item>
  );
}

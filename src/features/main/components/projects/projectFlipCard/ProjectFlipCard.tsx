/**
 * 생성 이유: 프로젝트 카드를 앞면(비주얼)·뒷면(상세 소개)로 뒤집는다.
 * 역할: 카드 어디를 눌러도 flip 되고, 뒷면은 아카이브형 상세를 보여 준다.
 * 책임: flip 상태, 링크 클릭 전파 차단, 뒷면 휠 스크롤 가로채기, 이미지·태그·역할·바로가기를 관리한다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type KeyboardEvent,
} from "react";

import * as S from "./ProjectFlipCard.styled";
import { MAIN_PROJECTS_UI } from "../../../constants";
import { projectDetailPath } from "@/constants/routes";
import type { Project } from "@/features/projects/constants/projects";

type ProjectFlipCardProps = {
  project: Project;
  index: number;
  onMediaLoad?: () => void;
};

const ProjectFlipCard = ({
  project,
  index,
  onMediaLoad,
}: ProjectFlipCardProps) => {
  const [flipped, setFlipped] = useState(false);
  const backScrollRef = useRef<HTMLDivElement>(null);

  const toggle = () => setFlipped((prev) => !prev);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

  const stop = (event: MouseEvent) => {
    event.stopPropagation();
  };

  // sticky 가로 트랙이 세로 휠을 가로 이동에 쓰므로, 뒷면에서는 카드 내부 스크롤을 우선한다.
  useEffect(() => {
    const node = backScrollRef.current;
    if (!node || !flipped) return;

    const onWheel = (event: WheelEvent) => {
      event.stopPropagation();

      const canScroll = node.scrollHeight > node.clientHeight + 1;
      if (!canScroll) return;

      const { scrollTop, scrollHeight, clientHeight } = node;
      const delta = event.deltaY;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const scrollingDown = delta > 0;

      if ((scrollingDown && atBottom) || (!scrollingDown && atTop)) {
        return;
      }

      event.preventDefault();
      node.scrollTop += delta;
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [flipped]);

  return (
    <S.Scene>
      <S.Card
        $flipped={flipped}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${project.title} 카드 ${flipped ? "앞면으로" : "뒤집기"}`}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <S.Face $front>
          <S.Badge>
            {String(index + 1).padStart(2, "0")} · {project.role}
          </S.Badge>
          <S.Media>
            <Image
              src={project.image}
              alt={`${project.title} 대표 이미지`}
              fill
              sizes="(max-width: 768px) 78vw, 28rem"
              style={{ objectFit: "cover" }}
              onLoadingComplete={onMediaLoad}
            />
          </S.Media>
          <S.FrontCopy>
            <S.Title>{project.title}</S.Title>
            <S.Summary>{project.summary}</S.Summary>
          </S.FrontCopy>
        </S.Face>

        <S.Face $back>
          <S.BackScroll ref={backScrollRef}>
            <S.BackHeader>
              <S.TitleMark aria-hidden />
              <S.Title>{project.title}</S.Title>
            </S.BackHeader>
            <S.Overview>{project.overview}</S.Overview>
            <S.Tags>
              {project.tags.map((tag) => (
                <S.Tag key={tag}>{tag}</S.Tag>
              ))}
            </S.Tags>
            <S.Meta>
              <span>{project.team}</span>
              <span>{project.period}</span>
            </S.Meta>
            <S.RoleTitle>{project.role}</S.RoleTitle>
            <S.RoleList>
              {project.roles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </S.RoleList>
          </S.BackScroll>
          <S.Actions onClick={stop}>
            <Link href={projectDetailPath(project.slug)} onClick={stop}>
              <S.TextLink>{MAIN_PROJECTS_UI.detailCta} →</S.TextLink>
            </Link>
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                onClick={stop}
              >
                <S.TextLink>{MAIN_PROJECTS_UI.demoCta} →</S.TextLink>
              </a>
            ) : null}
            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={stop}
              >
                <S.TextLink>{MAIN_PROJECTS_UI.githubCta} →</S.TextLink>
              </a>
            ) : null}
          </S.Actions>
        </S.Face>
      </S.Card>
    </S.Scene>
  );
};

export default ProjectFlipCard;

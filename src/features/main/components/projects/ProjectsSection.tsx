/**
 * 생성 이유: 메인 프로젝트를 스크롤 연동 가로 트랙으로 보여 주기 위함이다.
 * 역할: sticky pin 구간에서 세로 스크롤을 가로 translate로만 매핑한다.
 * 책임: 트랙 폭 측정·스크롤 진행도→x 변환·플립 카드 렌더링을 관리한다.
 */
"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import * as S from "./ProjectsSection.styled";
import ProjectFlipCard from "./projectFlipCard/ProjectFlipCard";
import { MAIN_PROJECTS_UI, MAIN_SECTION_IDS } from "../../constants";
import { ROUTES } from "@/constants/routes";
import { PROJECTS } from "@/features/projects/constants/projects";

const ProjectsSection = () => {
  const pinRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const reduceMotion = useReducedMotion();

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const next = Math.max(0, track.scrollWidth - viewport.clientWidth);
    setTravel((prev) => (prev === next ? prev : next));
  }, []);

  useLayoutEffect(() => {
    if (reduceMotion) return;
    measure();
    const id = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(id);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -Math.max(travel, 0)]);

  const header = (
    <S.Header>
      <div>
        <S.Label>{MAIN_PROJECTS_UI.label}</S.Label>
        <S.Title>{MAIN_PROJECTS_UI.title}</S.Title>
      </div>
      <Link href={ROUTES.PROJECTS}>
        <S.ArchiveLink>{MAIN_PROJECTS_UI.cta} →</S.ArchiveLink>
      </Link>
    </S.Header>
  );

  const cards = PROJECTS.filter((project) => project.featured).map(
    (project, index) => (
      <ProjectFlipCard
        key={project.slug}
        project={project}
        index={index}
        onMediaLoad={measure}
      />
    )
  );

  if (reduceMotion) {
    return (
      <S.Pin id={MAIN_SECTION_IDS.projects}>
        <S.Sticky $static>
          {header}
          <S.Viewport>
            <S.StaticTrack>{cards}</S.StaticTrack>
          </S.Viewport>
        </S.Sticky>
      </S.Pin>
    );
  }

  return (
    <S.Pin
      id={MAIN_SECTION_IDS.projects}
      ref={pinRef}
      style={
        travel > 0
          ? { height: `calc(100vh + ${travel}px)` }
          : { height: "100vh" }
      }
    >
      <S.Sticky>
        {header}
        <S.Viewport ref={viewportRef}>
          <S.MotionTrack ref={trackRef} style={{ x }}>
            {cards}
            <S.TrackEnd aria-hidden />
          </S.MotionTrack>
        </S.Viewport>
      </S.Sticky>
    </S.Pin>
  );
};

export default ProjectsSection;

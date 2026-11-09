/**
 * 생성 이유: 프로젝트 상세 UI를 라우트 계층과 분리한다.
 * 역할: /projects/[slug] 케이스 스터디 feature 컴포넌트다.
 * 책임: 히어로·메타 스트립·목차(활성 섹션 추적)·의사결정/역할 목록·
 *       Challenge 카드·다음 프로젝트 내비를 구조화해 보여 준다.
 *       목록 내 순번·총수·다음 프로젝트 요약은 라우트(서버)가 계산해 props로 넘긴다 —
 *       다른 프로젝트 원문(PROJECTS)을 이 클라이언트 번들에 들이지 않는다.
 *       모션 — 히어로 제목·커버는 캔버스색 커튼이 걷히는 스윕(첫 페인트부터 칠해져 LCP 안전),
 *       섹션 라벨·제목은 왼쪽부터 쓸려 들어오고, 목록·Challenge 카드는 함께 들어온 것끼리 차례로 등장한다.
 *       목차 활성 막대는 활성 항목이 바뀔 때 레일 위를 미끄러진다(위치는 ResizeObserver가 잰 캐시에서만 쓴다).
 *       새 탭으로 여는 외부 링크(Live demo·GitHub)는 보이지 않는 "(새 창)" 안내를 이름 끝에 붙인다.
 */
"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { Reveal, RollText, SweepText } from "@/components/common/motion";
import { VisuallyHidden } from "@/components/common/visuallyHidden/VisuallyHidden.styled";
import { motionTokens } from "@/styles/theme";
import * as S from "./ProjectDetailPage.styled";
import { PROJECTS_PAGE_UI } from "../../constants";
import { PROJECT_DETAIL_UI } from "../../constants/detail";
import type { Project } from "../../constants/projects";
import { ROUTES, projectDetailPath } from "@/constants/routes";

const ui = PROJECT_DETAIL_UI;

/** 메타 값의 구분자(" · ", " / ") — 조각 단위로만 줄바꿈되도록 쪼갠다. */
const META_SEPARATOR = /\s+([·/])\s+/;

type MetaPart = { text: string; separator?: string };

/** "FE 3 / BE 4" → [{ text: "FE 3", separator: "/" }, { text: "BE 4" }] */
const splitMeta = (value: string): MetaPart[] => {
  const tokens = value.split(META_SEPARATOR);
  const parts: MetaPart[] = [];
  for (let index = 0; index < tokens.length; index += 2) {
    parts.push({ text: tokens[index], separator: tokens[index + 1] });
  }
  return parts;
};

/** 조각은 inline-block 한 덩어리라 "Designer / 1"처럼 끝 토큰만 홀로 내려가지 않는다. */
const MetaText = ({ value }: { value: string }) => (
  <>
    {splitMeta(value).map(({ text, separator }, index) => (
      <S.MetaPart key={`${index}-${text}`}>
        {text}
        {separator ? <S.MetaSep>{separator}</S.MetaSep> : null}
      </S.MetaPart>
    ))}
  </>
);

/** 목차 활성 판정선: 뷰포트 위에서 30~35% 띠에 걸친 섹션을 현재 위치로 본다. */
const ACTIVE_LINE_MARGIN = "-30% 0px -65% 0px";

/** 판정 띠의 아래 끝(뷰포트 높이 비율) — rootMargin 하단 -65%와 짝이다. */
const ACTIVE_LINE_BOTTOM = 0.35;

/** 목차 클릭 뒤 부드러운 스크롤이 지나치는 섹션이 활성을 덮어쓰지 않게 잠근다(ms). */
const TOC_CLICK_LOCK_MS = 900;

const TOC_LABEL_ID = "project-toc-label";

/**
 * 이미지 실제 표시 폭 — Wrapper 거터·히어로/내비 열 구성에서 뽑은 값이다(크게 적으면 한 단계 큰 변환본을 받는다).
 * 커버: 1024px 미만 본문 전폭(≈93.6vw−11px) → 데스크톱 히어로 오른쪽 열(48vw, 1330px부터 634px 고정).
 * 다음 프로젝트: 768px 미만 카드 전폭 → 태블릿 이상 카드 오른쪽 0.9fr 열(1330px부터 579px 고정).
 */
const COVER_SIZES =
  "(min-width: 1330px) 634px, (min-width: 1024px) 48vw, calc(93.6vw - 11px)";
const NEXT_MEDIA_SIZES =
  "(min-width: 1330px) 579px, (min-width: 768px) calc(44.3vw - 5px), calc(93.6vw - 13px)";

/** 커버 커튼은 제목 커튼보다 이만큼 늦게 걷힌다 — 왼쪽 제목 → 오른쪽 커버 순으로 읽힌다(s). */
const COVER_CURTAIN_DELAY = motionTokens.stagger.item * 2;

const pad = (value: number) => String(value).padStart(2, "0");

type SectionKey = keyof typeof ui.sections;

type DetailSection = {
  key: SectionKey;
  id: string;
  label: string;
  title: string;
  index: string;
};

const SECTION_TITLES: Record<SectionKey, string> = {
  overview: ui.sections.overview.title,
  decisions: PROJECTS_PAGE_UI.decisionsHeading,
  roles: PROJECTS_PAGE_UI.rolesHeading,
  challenges: PROJECTS_PAGE_UI.challengesHeading,
};

/** 내용이 있는 섹션만 순서대로 번호를 매긴다. 목차와 본문이 같은 목록을 쓴다. */
const buildSections = (project: Project): DetailSection[] => {
  const present: Record<SectionKey, boolean> = {
    overview: project.overview.length > 0,
    decisions: project.decisions.length > 0,
    roles: project.roles.length > 0,
    challenges: project.challenges.length > 0,
  };

  return (Object.keys(ui.sections) as SectionKey[])
    .filter((key) => present[key])
    .map((key, order) => ({
      key,
      id: ui.sections[key].id,
      label: ui.sections[key].label,
      title: SECTION_TITLES[key],
      index: pad(order + 1),
    }));
};

/**
 * 판정선에 걸친 섹션을 IntersectionObserver로 추적해 목차 활성 항목을 정한다.
 * 섹션은 여백 없이 이어 붙어 있고(간격은 섹션 padding), 그 바로 아래 내비(endRef)도
 * 함께 관찰한다 — 맨 아래 ↔ 맨 위처럼 섹션을 건너뛰는 점프에서도 콜백이 반드시 돈다.
 * 위치 판단은 콜백 항목의 사각형(관찰자가 이미 잰 값)만 쓴다 — 콜백 안에서 레이아웃을 다시 읽지 않는다.
 */
const useActiveSection = (
  ids: readonly string[],
  endRef: RefObject<HTMLElement | null>
) => {
  const [activeId, setActiveId] = useState(ids[0] ?? "");
  const lockUntil = useRef(0);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;

    const first = sections[0];
    const last = sections[sections.length - 1];
    const sectionSet = new Set<Element>(sections);
    const crossing = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) crossing.add(entry.target);
          else crossing.delete(entry.target);
        });
        if (Date.now() < lockUntil.current) return;

        const current = sections.find((section) => crossing.has(section));
        if (current) {
          setActiveId(current.id);
          return;
        }

        // 판정선이 섹션 밖이면 위치로 정한다: 첫 섹션 위(히어로·메타) → 첫 항목,
        // 마지막 섹션 아래(다음 프로젝트·푸터) → 마지막 항목.
        // 섹션·내비는 빈틈없이 이어지므로 이번 항목 하나의 위치로 충분하다 — 섹션 항목이 있으면 그것(가장 최근 값),
        // 없으면 내비 항목을 본다. 그 대상이 판정 띠 아래에 있으면 띠는 첫 섹션 위다.
        const probe =
          entries.findLast((entry) => sectionSet.has(entry.target)) ??
          entries[entries.length - 1];
        const bandBottom =
          probe.rootBounds?.bottom ?? window.innerHeight * ACTIVE_LINE_BOTTOM;
        const bandAbove =
          !probe.isIntersecting && probe.boundingClientRect.top >= bandBottom;
        setActiveId(bandAbove ? first.id : last.id);
      },
      { rootMargin: ACTIVE_LINE_MARGIN }
    );

    sections.forEach((section) => observer.observe(section));
    if (endRef.current) observer.observe(endRef.current);
    return () => observer.disconnect();
  }, [ids, endRef]);

  const activate = useCallback((id: string) => {
    lockUntil.current = Date.now() + TOC_CLICK_LOCK_MS;
    setActiveId(id);
  }, []);

  return { activeId, activate };
};

type LinkBox = { top: number; height: number };

/**
 * 데스크톱 목차 레일의 활성 막대 하나를 활성 링크 자리로 옮긴다 — 위치·높이는 CSS 변수로만 넘기고
 * 움직임은 transform 전환이 맡는다(레이아웃 속성은 애니메이션하지 않는다).
 * 링크 위치는 ResizeObserver 콜백(레이아웃이 끝난 뒤라 강제 레이아웃이 없다)에서만 읽어 섹션 id별로 캐시하고,
 * 활성 항목이 바뀌면 캐시 값만 쓴다 — 스크롤 중 활성 변경이 레이아웃을 동기로 다시 돌리지 않는다.
 * 레일·링크 크기(폭·폰트·활성 굵기로 줄바꿈이 바뀜)가 바뀌면 다시 잰다.
 * 첫 배치는 첫 콜백에서 전환 없이 놓고, 한 프레임 뒤(data-ready)부터 미끄러지게 한다.
 */
const useTocIndicator = (activeId: string) => {
  const railRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(activeId);
  const boxes = useRef(new Map<string, LinkBox>());

  /** 캐시에서만 쓴다 — 레이아웃 값을 읽지 않는다. 아직 재지 않았으면 첫 측정이 놓는다. */
  const write = useCallback((id: string) => {
    const indicator = indicatorRef.current;
    const box = boxes.current.get(id);
    if (!indicator || !box) return;
    indicator.style.setProperty("--toc-y", `${box.top}px`);
    indicator.style.setProperty("--toc-h", String(box.height));
  }, []);

  useLayoutEffect(() => {
    activeRef.current = activeId;
    write(activeId);
  }, [activeId, write]);

  useEffect(() => {
    const rail = railRef.current;
    const indicator = indicatorRef.current;
    if (!rail || !indicator || typeof ResizeObserver === "undefined") return;

    const links = Array.from(
      rail.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    );
    let frame = 0;
    const observer = new ResizeObserver(() => {
      // offsetTop·offsetHeight는 리빌 transform의 영향을 받지 않는 레이아웃 값이다(기준: TocRail).
      links.forEach((link) => {
        boxes.current.set((link.getAttribute("href") ?? "").slice(1), {
          top: link.offsetTop,
          height: link.offsetHeight,
        });
      });
      write(activeRef.current);
      if (!frame && !indicator.hasAttribute("data-ready")) {
        frame = window.requestAnimationFrame(() =>
          indicator.setAttribute("data-ready", "")
        );
      }
    });
    observer.observe(rail);
    links.forEach((link) => observer.observe(link));
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [write]);

  return { railRef, indicatorRef };
};

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3.5 8.4 6.6 11.4 12.5 4.8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 다음 프로젝트 카드에 보이는 값만 — 라우트(서버)가 PROJECTS에서 골라 넘긴다. */
export type NextProject = Pick<Project, "slug" | "title" | "summary" | "image">;

type ProjectDetailPageProps = {
  project: Project;
  /** 목록(PROJECTS) 안 0부터 센 순번 */
  position: number;
  /** 목록 전체 프로젝트 수 */
  total: number;
  /** 목록상 다음 프로젝트(마지막이면 처음으로 돈다). 자기 자신뿐이면 null */
  next: NextProject | null;
};

const ProjectDetailPage = ({
  project,
  position,
  total,
  next,
}: ProjectDetailPageProps) => {
  const sections = useMemo(() => buildSections(project), [project]);
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections]
  );
  const nextNavRef = useRef<HTMLElement>(null);
  const { activeId, activate } = useActiveSection(sectionIds, nextNavRef);
  const { railRef, indicatorRef } = useTocIndicator(activeId);

  const nextPosition = (position + 1) % Math.max(total, 1);
  const totalLabel = pad(total);

  const teamTags: readonly string[] = ui.teamTags;
  const stack = project.tags.filter((tag) => !teamTags.includes(tag));

  const onTocClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    activate(id);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(window.history.state, "", `#${id}`);
    // 키보드 사용자가 이어서 Tab 하면 해당 섹션부터 읽히도록 제목에 포커스를 옮긴다.
    document.getElementById(`${id}-title`)?.focus({ preventScroll: true });
  };

  // 목록 항목·카드는 각각 리빌한다 — 함께 화면에 들어온 것끼리 컨트롤러가 읽는 순서대로 스태거한다.
  const bodies: Record<SectionKey, ReactNode> = {
    overview: <Reveal as={S.Overview}>{project.overview}</Reveal>,
    decisions: (
      <S.PointList>
        {project.decisions.map((item, index) => (
          <Reveal as={S.PointItem} key={item}>
            <S.PointIndex aria-hidden>{pad(index + 1)}</S.PointIndex>
            <S.PointText>{item}</S.PointText>
          </Reveal>
        ))}
      </S.PointList>
    ),
    roles: (
      <S.PointList as="ul">
        {project.roles.map((item) => (
          <Reveal as={S.PointItem} key={item}>
            <S.PointCheck aria-hidden>
              <CheckIcon />
            </S.PointCheck>
            <S.PointText>{item}</S.PointText>
          </Reveal>
        ))}
      </S.PointList>
    ),
    challenges: (
      <S.ChallengeList>
        {project.challenges.map((challenge, index) => (
          <Reveal as={S.ChallengeCard} key={challenge.problem}>
            <S.CardHead>
              <S.CardIndex>{pad(index + 1)}</S.CardIndex>
              <S.CardKicker>{ui.challengeKicker}</S.CardKicker>
            </S.CardHead>
            <S.Rows>
              <S.Row>
                <S.RowLabel>{PROJECTS_PAGE_UI.problemLabel}</S.RowLabel>
                <S.RowText $tone="lead">{challenge.problem}</S.RowText>
              </S.Row>
              <S.Row>
                <S.RowLabel>{PROJECTS_PAGE_UI.solutionLabel}</S.RowLabel>
                <S.RowText>{challenge.solution}</S.RowText>
              </S.Row>
              <S.Row $takeaway>
                <S.RowLabel $takeaway>
                  {PROJECTS_PAGE_UI.learningsLabel}
                </S.RowLabel>
                <S.RowText $tone="takeaway">{challenge.learnings}</S.RowText>
              </S.Row>
            </S.Rows>
          </Reveal>
        ))}
      </S.ChallengeList>
    ),
  };

  return (
    <S.Wrapper>
      <S.Inner>
        <Reveal as={S.BackLink} href={ROUTES.PROJECTS}>
          {PROJECTS_PAGE_UI.backToList}
        </Reveal>

        <S.Hero>
          <S.HeroCopy>
            <Reveal as={S.Eyebrow}>
              {ui.eyebrow}
              <S.EyebrowCount>
                {pad(position + 1)} / {totalLabel}
              </S.EyebrowCount>
            </Reveal>
            <SweepText
              as={S.Title}
              variant="curtain"
              duration={motionTokens.duration.title}
            >
              {project.title}
            </SweepText>
            <SweepText as={S.Summary}>{project.summary}</SweepText>
            {project.demo || project.github ? (
              <Reveal as={S.Links} variant="stagger">
                {project.demo ? (
                  <S.ExtLink
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    $primary
                  >
                    <RollText>{PROJECTS_PAGE_UI.viewDemo}</RollText>
                    <VisuallyHidden> {PROJECTS_PAGE_UI.newTab}</VisuallyHidden>
                    <HoverArrow aria-hidden />
                  </S.ExtLink>
                ) : null}
                {project.github ? (
                  <S.ExtLink
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <RollText>{PROJECTS_PAGE_UI.viewGithub}</RollText>
                    <VisuallyHidden> {PROJECTS_PAGE_UI.newTab}</VisuallyHidden>
                    <HoverArrow aria-hidden />
                  </S.ExtLink>
                ) : null}
              </Reveal>
            ) : null}
          </S.HeroCopy>

          <Reveal
            as={S.CoverFrame}
            variant="curtain"
            delay={COVER_CURTAIN_DELAY}
          >
            <S.Cover>
              {/* 고정 비율 박스에 cover로 자르면 스크린숏 가장자리 문구가 잘려 원본 비율로 둔다. */}
              {/* 원본 크기로 비율 자리를 잡아 로드 뒤에도 높이가 그대로다(CLS 0). */}
              {/* 첫 화면 LCP 이미지 — HTML에서 바로 높은 우선순위로 받는다(preload + fetchpriority). */}
              <Image
                src={project.image}
                alt={`${project.title} 커버`}
                width={project.imageSize.width}
                height={project.imageSize.height}
                sizes={COVER_SIZES}
                style={{ width: "100%", height: "auto" }}
                preload
                fetchPriority="high"
              />
            </S.Cover>
          </Reveal>
        </S.Hero>

        <Reveal as={S.MetaStrip} variant="stagger">
          <S.MetaItem $span="period">
            <S.MetaLabel>{ui.meta.period}</S.MetaLabel>
            <S.MetaValue>
              <MetaText value={project.period} />
            </S.MetaValue>
          </S.MetaItem>
          <S.MetaItem>
            <S.MetaLabel>{ui.meta.role}</S.MetaLabel>
            <S.MetaValue>
              <MetaText value={project.role} />
            </S.MetaValue>
          </S.MetaItem>
          <S.MetaItem>
            <S.MetaLabel>{ui.meta.team}</S.MetaLabel>
            <S.MetaValue>
              <MetaText value={project.team} />
            </S.MetaValue>
          </S.MetaItem>
          {stack.length > 0 ? (
            <S.MetaItem $span="stack">
              <S.MetaLabel>{ui.meta.stack}</S.MetaLabel>
              <S.MetaValue>
                <S.Tags>
                  {stack.map((tag) => (
                    <S.Tag key={tag}>{tag}</S.Tag>
                  ))}
                </S.Tags>
              </S.MetaValue>
            </S.MetaItem>
          ) : null}
        </Reveal>

        <S.Body>
          <S.Toc aria-labelledby={TOC_LABEL_ID}>
            <SweepText as={S.TocLabel} id={TOC_LABEL_ID}>
              {ui.toc.label}
            </SweepText>
            <Reveal as={S.TocRail} ref={railRef}>
              <S.TocIndicator ref={indicatorRef} aria-hidden />
              <S.TocList>
                {sections.map((section) => {
                  const active = section.id === activeId;

                  return (
                    <li key={section.id}>
                      <S.TocLink
                        href={`#${section.id}`}
                        aria-current={active ? "true" : undefined}
                        $active={active}
                        onClick={(event) => onTocClick(event, section.id)}
                      >
                        <S.TocIndex $active={active}>
                          {section.index}
                        </S.TocIndex>
                        {section.title}
                      </S.TocLink>
                    </li>
                  );
                })}
              </S.TocList>
            </Reveal>
          </S.Toc>

          <S.Content>
            {sections.map((section) => (
              <S.Section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
              >
                <S.SectionHead>
                  <Reveal as={S.SectionLabel}>
                    <S.SectionIndex>{section.index}</S.SectionIndex>
                    {section.label}
                  </Reveal>
                  <SweepText
                    as={S.SectionTitle}
                    id={`${section.id}-title`}
                    tabIndex={-1}
                  >
                    {section.title}
                  </SweepText>
                </S.SectionHead>
                {bodies[section.key]}
              </S.Section>
            ))}
          </S.Content>
        </S.Body>

        <Reveal
          as={S.NextNav}
          ref={nextNavRef}
          variant="stagger"
          aria-label={ui.next.ariaLabel}
        >
          {next ? (
            <S.NextCard href={projectDetailPath(next.slug)}>
              <S.NextCopy>
                <S.NextLabel>
                  {ui.next.label}
                  <S.NextCount aria-hidden>
                    {pad(nextPosition + 1)} / {totalLabel}
                  </S.NextCount>
                </S.NextLabel>
                <S.NextTitle>
                  <S.NextTitleText>{next.title}</S.NextTitleText>
                  <HoverArrow aria-hidden />
                </S.NextTitle>
                <S.NextSummary>{next.summary}</S.NextSummary>
              </S.NextCopy>
              <S.NextMedia>
                <Image
                  src={next.image}
                  alt=""
                  fill
                  sizes={NEXT_MEDIA_SIZES}
                  style={{ objectFit: "cover" }}
                />
              </S.NextMedia>
            </S.NextCard>
          ) : null}
          <S.ListLink href={ROUTES.PROJECTS}>
            <S.ListArrow aria-hidden>←</S.ListArrow>
            <RollText>{ui.next.allProjects}</RollText>
          </S.ListLink>
        </Reveal>
      </S.Inner>
    </S.Wrapper>
  );
};

export default ProjectDetailPage;

/**
 * 생성 이유: Featured 프로젝트를 Process 아코디언 책장으로 보여 주기 위함이다.
 * 역할: 접힌 책등(spine) / 펼친 미디어 패널을 하나의 상세 링크로 렌더링하는 shelf 아이템이다.
 * 책임: 활성화 규칙(마우스 호버·포커스·첫 탭)과 상세 이동 시점, 표지 이미지 크기·우선순위 힌트만 관리한다.
 *       링크 요소를 접힘/펼침 내내 유지해 키보드 포커스가 상태 전환에 끊기지 않게 한다.
 *       책등과 패널 카피를 함께 렌더링하고 보이는 쪽만 CSS가 고른다 — 사라지는 쪽도 전환을 끝까지 그린다.
 *       칸 위치는 인라인 --shelf-index로만 넘긴다 — 칸마다 다른 클래스를 만들지 않아 SSR CSS가 한 벌이다.
 */
"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import * as S from "./ProjectShelfItem.styled";
import { MAIN_PROJECTS_UI } from "../../../constants";
import { projectDetailPath } from "@/constants/routes";
import type { Project } from "@/features/projects/constants/projects";

export type { ShelfEdge } from "./ProjectShelfItem.styled";

/** 책장 칸이 그리는 필드 — 서버(app/page.tsx)가 이 필드만 골라 클라이언트로 넘긴다. */
export type ShelfProject = Pick<Project, "slug" | "title" | "summary" | "image">;

/**
 * 표지 크기 힌트 — 펼친 패널(폰 92vw·데스크톱 72vw)과 접힌 데스크톱 책등.
 * 책등 표지는 흐린 베일 아래라 작은 사본(256px 기준)으로 충분해, 첫 로드에 큰 원본을 받지 않는다.
 * 폰은 접힌 행도 탭 한 번에 펼쳐지므로 미리 펼침 크기로 받는다(썸네일도 같은 주소를 재사용한다).
 */
const COVER_SIZES = {
  open: "(max-width: 767px) 92vw, (max-width: 1440px) 72vw, 1040px",
  spine: "(max-width: 767px) 92vw, 256px",
} as const;

type ProjectShelfItemProps = {
  project: ShelfProject;
  index: number;
  edge: S.ShelfEdge;
  /** 책장에 마우스가 들어왔다 — 접힌 책등도 펼침 크기 표지를 미리 받는다 */
  warm: boolean;
  onActivate: () => void;
};

const ProjectShelfItem = ({
  project,
  index,
  edge,
  warm,
  onActivate,
}: ProjectShelfItemProps) => {
  const expanded = edge === "open";
  const label = String(index + 1).padStart(2, "0");
  const sizes = expanded || warm ? COVER_SIZES.open : COVER_SIZES.spine;
  /**
   * 접힌 칸 표지는 낮은 우선순위로 받는다 — 지연 로딩 거리가 길어지는 느린 회선·긴 화면에서는 화면 아래 표지도
   * 첫 페인트와 함께 요청돼 폰트·스크립트와 대역을 다투고, 화면에 들어와도 썸네일·흐린 책등이라 서두를 이유가 없다
   * (low는 화면 안 이미지의 우선순위 올림도 막는다). 펼친 칸은 브라우저 기본값을 둔다.
   */
  const fetchPriority = expanded ? undefined : "low";
  /** 누른 순간 이미 펼쳐져 있었는지 — 첫 탭(포커스로 먼저 펼쳐짐)이 곧장 이동하지 않게 한다. */
  const pressedExpanded = useRef<boolean | null>(null);

  /*
   * 펼침 상태가 한 번이라도 바뀐 칸만 전환 모션을 켠다 — 첫 화면에 펼쳐 둔 패널과 그대로인 책등은
   * 다시 쓸려 들어오지 않는다. 같은 렌더에서 정해야 카피가 한 프레임 먼저 보였다 사라지지 않는다.
   */
  const [renderedExpanded, setRenderedExpanded] = useState(expanded);
  const [hasToggled, setHasToggled] = useState(false);
  if (renderedExpanded !== expanded) {
    setRenderedExpanded(expanded);
    setHasToggled(true);
  }

  /** 마우스만 호버로 펼친다. 터치는 첫 탭에 펼치고 두 번째 탭에 이동한다. */
  const onPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "mouse") onActivate();
  };

  const onPointerDown = () => {
    pressedExpanded.current = expanded;
  };

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // detail 0 = 키보드 Enter — 포커스 시점에 이미 펼쳐졌으므로 그대로 이동한다.
    const wasExpanded =
      event.detail > 0 ? (pressedExpanded.current ?? expanded) : expanded;
    pressedExpanded.current = null;
    // 수정 키 클릭(새 탭 등)은 브라우저 기본 동작을 존중한다.
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (wasExpanded || modified) return;
    event.preventDefault();
    onActivate();
  };

  return (
    <S.Item
      data-edge={edge}
      data-animate={hasToggled ? "" : undefined}
      style={{ "--shelf-index": index } as CSSProperties}
    >
      <S.Card
        href={projectDetailPath(project.slug)}
        onPointerEnter={onPointerEnter}
        onPointerDown={onPointerDown}
        onFocus={onActivate}
        onClick={onClick}
      >
        <S.Window>
          {/* 링크 안 텍스트가 이름을 주므로 표지는 장식 이미지로 둔다 */}
          <S.Media aria-hidden>
            <Image
              src={project.image}
              alt=""
              fill
              sizes={sizes}
              fetchPriority={fetchPriority}
            />
          </S.Media>
          {/* 보이지 않는 쪽(접힌 칸의 카피·펼친 칸의 책등)은 상태가 바뀌는 즉시 링크 이름에서 뺀다 */}
          <S.PanelCopy aria-hidden={expanded ? undefined : true}>
            <S.IndexPill $onMedia aria-hidden>
              {label}
            </S.IndexPill>
            <S.PanelTitle>{project.title}</S.PanelTitle>
            <S.PanelSummary>{project.summary}</S.PanelSummary>
            <S.DetailCta>
              {MAIN_PROJECTS_UI.detailCta}
              <HoverArrow aria-hidden />
            </S.DetailCta>
          </S.PanelCopy>
          <S.Spine aria-hidden={expanded ? true : undefined}>
            <S.Thumb aria-hidden>
              <Image
                src={project.image}
                alt=""
                fill
                sizes={sizes}
                fetchPriority={fetchPriority}
              />
            </S.Thumb>
            <S.SpineTitle>{project.title}</S.SpineTitle>
            <S.IndexPill aria-hidden>{label}</S.IndexPill>
          </S.Spine>
        </S.Window>
      </S.Card>
    </S.Item>
  );
};

export default ProjectShelfItem;

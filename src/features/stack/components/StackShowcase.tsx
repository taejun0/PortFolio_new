/**
 * 생성 이유: 메인·About에서 기술 그룹을 한 장씩 집중해서 보여주기 위함이다.
 * 역할: 드래그·스와이프·탭·키보드로 이동하며, 사용자가 켜면 자동 전환하는 기술 쇼케이스다.
 * 책임: 현재·직전 카테고리와 전환 방향, 포인터 드래그, 자동 전환(정지 토글, 호버·포커스·동작 줄이기 일시정지,
 *       화면 진입 감지), 탭 호버 의도, 탭 인디케이터 위치를 관리한다. 시각과 전환 모션은 StackShowcase.styled가 소유한다.
 *       슬라이드는 한 칸에 겹쳐 두고 바뀐 카테고리만 가로 스윕으로 들어온다 — 높이가 가장 긴 슬라이드로
 *       고정돼 전환이 아래 레이아웃을 흔들지 않고, 숨은 슬라이드 아이콘도 미리 받아진다.
 *
 * - 자동 전환은 기본으로 꺼져 있다. 재생·정지 버튼으로 켜고, 탭 클릭·화살표 키·스와이프로 직접 넘기면 멈춘 채 둔다.
 *   다시 켜려면 토글을 한 번 더 누른다. 마우스 호버·키보드 포커스 동안의 일시정지는 따로 돈다(떠나면 이어 간다).
 * - 마우스가 탭 위에 잠깐(HOVER_INTENT_MS) 머물러야 미리보기로 바뀐다 — 탭 줄을 가로질러도 슬라이드가 연달아 바뀌지 않는다.
 *   클릭·포커스·키보드·스와이프는 바로 바뀐다.
 * - 레이아웃은 ResizeObserver 콜백(레이아웃 직후)에서만 읽어 탭 위치·너비를 캐시한다. 인디케이터 배치와 탭 줄 자동
 *   스크롤은 캐시만 쓰고, 탭이 탭 줄 안에 다 보이는지는 탭 줄을 루트로 한 IntersectionObserver가 알려 준다
 *   (하이드레이션·전환 때 강제 레이아웃이 없다).
 */
"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { Reveal, SweepText } from "@/components/common/motion";
import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { projectDetailPath } from "@/constants/routes";
import { VisuallyHidden } from "@/components/common/visuallyHidden/VisuallyHidden.styled";
import { STACK_GROUPS, STACK_SHOWCASE_UI } from "../constants";
import * as S from "./StackShowcase.styled";

const ui = STACK_SHOWCASE_UI;
const totalLabel = String(STACK_GROUPS.length).padStart(2, "0");
/** 쇼케이스가 이 비율 이상 보일 때만 자동 전환한다. */
const IN_VIEW_RATIO = 0.35;
/** 끄는 동안 슬라이드가 손가락을 따라가는 비율 — 옆 슬라이드가 없어 살짝만 밀린다. */
const DRAG_FOLLOW = 0.3;
/** 마우스가 탭 위에 이만큼(ms) 머물러야 미리보기로 바꾼다 — 지나가는 커서는 무시한다. */
const HOVER_INTENT_MS = 140;
/** 탭이 탭 줄 안에 다 보인다고 보는 비율 — 1px 안팎의 반올림 오차는 봐준다. */
const FULLY_VISIBLE_RATIO = 0.99;

/** 들어오는 타일이 쓸리는 방향 — 번호가 커지면 왼→오, 끌어 넘길 때는 손가락 방향을 따른다. */
type Flow = "ltr" | "rtl";

type Showing = {
  active: number;
  /** 나가는 중인 슬라이드 — 첫 화면에는 없다 */
  previous: number | null;
  flow: Flow;
  /** 나가는 슬라이드가 출발하는 위치(px) — 끌던 자리에서 이어 간다 */
  exitFrom: number;
};

type ShowOptions = { flow?: Flow; exitFrom?: number };

type SlideState = "static" | "in" | "out" | "idle";

/** 탭 하나의 탭 줄 안 위치·너비(px) — ResizeObserver 콜백에서만 잰다. */
type TabBox = { left: number; width: number };

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const readReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const readServerReducedMotion = () => false;

const clampIndex = (index: number) =>
  Math.min(Math.max(index, 0), STACK_GROUPS.length - 1);

const StackShowcase = () => {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    readServerReducedMotion
  );
  const [showing, setShowing] = useState<Showing>({
    active: 1,
    previous: null,
    flow: "ltr",
    exitFrom: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isInView, setIsInView] = useState(false);
  /** 정지 토글·직접 이동으로 멈춘 자동 전환 — 토글을 다시 누르기 전까지 유지된다 */
  const [isStopped, setIsStopped] = useState(true);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pageRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  /** 레이아웃 관찰(ResizeObserver)·호버 의도 타이머가 현재 탭을 읽는 통로 */
  const activeRef = useRef(showing.active);
  /** 탭별 위치·너비 캐시 — 첫 ResizeObserver 콜백 전에는 없다 */
  const tabBoxes = useRef<TabBox[] | null>(null);
  /** 탭 줄 안에 다 보이는 탭 — 아직 모르면(undefined) 탭 줄을 스크롤하지 않는다 */
  const tabFullyVisible = useRef<boolean[]>([]);
  /** 마우스 호버 미리보기로 바뀐 탭은 탭 줄을 스크롤하지 않는다. */
  const skipPageScroll = useRef(false);
  const hoverTimer = useRef(0);
  /** 탭 줄 위 마지막 마우스 위치 — 커서는 그대로인데 탭 줄이 밀려 바뀐 탭(같은 좌표의 pointerenter)을 거른다 */
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const dragStart = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const dragFrame = useRef(0);

  const { active } = showing;
  const isAutoPlaying =
    isInView &&
    !isStopped &&
    !isHovered &&
    !hasFocusWithin &&
    !isDragging &&
    !reduceMotion;

  /** 카테고리를 바꾼다. 방향을 주지 않으면 번호가 커질 때 왼→오, 작아질 때 오→왼으로 쓸린다. */
  const show = useCallback((next: number, options: ShowOptions = {}) => {
    setShowing((current) => {
      const target = clampIndex(next);
      if (target === current.active) return current;
      return {
        active: target,
        previous: current.active,
        flow: options.flow ?? (target > current.active ? "ltr" : "rtl"),
        exitFrom: options.exitFrom ?? 0,
      };
    });
  }, []);

  /** 직접 넘김(탭 클릭·화살표 키·스와이프) — 바꾸고 자동 전환을 멈춘 채 둔다. */
  const navigate = (next: number, options?: ShowOptions) => {
    setIsStopped(true);
    show(next, options);
  };

  const cancelHoverIntent = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = 0;
  };

  // 보일 때만 자동 전환한다. 숨은 슬라이드도 같은 칸에 겹쳐 있어 아이콘이 함께 미리 받아진다.
  useEffect(() => {
    const node = showcaseRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.intersectionRatio >= IN_VIEW_RATIO),
      { threshold: [0, IN_VIEW_RATIO] }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // 슬라이드가 바뀔 때마다 주기를 새로 센다 — 인디케이터 진행 바와 같은 시점에 출발한다.
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = window.setTimeout(() => {
      show((active + 1) % STACK_GROUPS.length);
    }, ui.autoplayMs);

    return () => window.clearTimeout(timer);
  }, [active, isAutoPlaying, show]);

  /** 인디케이터를 탭 아래로 옮긴다 — 캐시한 위치로 transform만 바꿔 레이아웃을 읽지도 건드리지도 않는다. */
  const placeIndicator = useCallback((index: number) => {
    const bar = indicatorRef.current;
    const box = tabBoxes.current?.[index];
    if (!bar || !box) return;

    bar.style.setProperty("--indicator-x", `${box.left}px`);
    bar.style.setProperty(
      "--indicator-scale",
      String(box.width / S.INDICATOR_BASE_PX)
    );
  }, []);

  // 탭이 바뀌면 같은 페인트에서 인디케이터를 옮긴다(캐시가 생기기 전이면 첫 ResizeObserver 콜백이 놓는다).
  useLayoutEffect(() => {
    activeRef.current = active;
    placeIndicator(active);
  }, [active, placeIndicator]);

  // 레이아웃은 여기서만 읽는다 — ResizeObserver 콜백은 레이아웃 직후라 강제 레이아웃이 없다.
  // 폭·글꼴이 바뀌면 탭 너비가 달라진다: 탭 줄과 각 탭을 관찰해 캐시와 인디케이터를 다시 맞춘다.
  // 첫 콜백에서 이동 없이 자리만 잡고(placed), 다음 프레임부터 탭 사이를 미끄러진다(live).
  // 그 전(SSR·JS 없음)에는 활성 탭 자신의 밑줄이 보인다.
  useEffect(() => {
    const list = paginationRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;

    let frame = 0;
    const observer = new ResizeObserver(() => {
      tabBoxes.current = pageRefs.current.map((page) => ({
        left: page?.offsetLeft ?? 0,
        width: page?.offsetWidth ?? 0,
      }));
      placeIndicator(activeRef.current);

      if (list.dataset.indicator) return;
      list.dataset.indicator = "placed";
      frame = window.requestAnimationFrame(() => {
        list.dataset.indicator = "live";
      });
    });
    observer.observe(list);
    pageRefs.current.forEach((page) => {
      if (page) observer.observe(page);
    });
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [placeIndicator]);

  // 탭 줄이 가로로 넘칠 때 어떤 탭이 다 보이는지 — 탭 줄 스크롤과 무관하게 레이아웃을 읽지 않고 안다.
  // 포커스 링 여유(FOCUS_ROOM)는 보이는 영역에서 뺀다.
  useEffect(() => {
    const list = paginationRef.current;
    if (!list) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = pageRefs.current.indexOf(
            entry.target as HTMLButtonElement
          );
          if (index >= 0) {
            tabFullyVisible.current[index] =
              entry.intersectionRatio >= FULLY_VISIBLE_RATIO;
          }
        });
      },
      {
        root: list,
        rootMargin: `0px -${S.FOCUS_ROOM}`,
        threshold: FULLY_VISIBLE_RATIO,
      }
    );
    pageRefs.current.forEach((page) => {
      if (page) observer.observe(page);
    });
    return () => observer.disconnect();
  }, []);

  // 활성 탭이 탭 줄에서 가려지면 탭 줄만 스크롤한다(페이지는 움직이지 않는다). 위치는 캐시에서 계산한다.
  // 호버로 바뀐 경우까지 스크롤하면 멈춘 커서 아래로 옆 탭이 밀려와 연달아 전환된다.
  useEffect(() => {
    if (skipPageScroll.current) {
      skipPageScroll.current = false;
      return;
    }

    const list = paginationRef.current;
    const boxes = tabBoxes.current;
    if (!list || !boxes || tabFullyVisible.current[active] !== false) return;

    // 첫 탭 위치가 곧 탭 줄 안쪽 여백이다 — 그만큼 빼야 라벨이 본문 왼쪽 선에 맞는다.
    list.scrollTo({
      left: boxes[active].left - boxes[0].left,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [active, reduceMotion]);

  // 언마운트 시 남은 드래그 프레임·호버 의도 타이머를 거둔다.
  useEffect(
    () => () => {
      window.cancelAnimationFrame(dragFrame.current);
      window.clearTimeout(hoverTimer.current);
    },
    []
  );

  /**
   * 마우스가 탭 위에 잠깐 머물면 미리보기로 바꾼다 — 다른 탭에 들어가거나 떠나면 취소된다.
   * 클릭으로 탭 줄이 스크롤돼 멈춘 커서 아래로 옆 탭이 밀려 들어온 경우(좌표가 그대로)는 호버로 치지 않는다.
   */
  const previewTo = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (event.pointerType !== "mouse") return;

    cancelHoverIntent();
    const last = lastPointer.current;
    if (last && last.x === event.clientX && last.y === event.clientY) return;
    if (index === active) return;
    hoverTimer.current = window.setTimeout(() => {
      hoverTimer.current = 0;
      if (activeRef.current === index) return;
      skipPageScroll.current = true;
      show(index);
    }, HOVER_INTENT_MS);
  };

  const leavePage = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") cancelHoverIntent();
  };

  /** 끄는 양을 프레임마다 한 번만 DOM에 쓴다(React 상태를 거치지 않는다). */
  const paintDrag = () => {
    dragFrame.current = 0;
    const slide = slideRefs.current[activeRef.current];
    if (!slide) return;
    const follow = reduceMotion ? 0 : dragDelta.current * DRAG_FOLLOW;
    slide.style.transform = follow ? `translate3d(${follow}px, 0, 0)` : "";
  };

  const finishDrag = (width: number) => {
    window.cancelAnimationFrame(dragFrame.current);
    dragFrame.current = 0;

    const delta = dragDelta.current;
    const threshold = Math.min(72, width * 0.14);
    const exitFrom = reduceMotion ? 0 : delta * DRAG_FOLLOW;
    const slide = slideRefs.current[active];
    // 넘기지 않으면 CSS 트랜지션으로 제자리에 돌아오고, 넘기면 이 자리에서 나가는 애니메이션이 이어 간다.
    if (slide) slide.style.transform = "";

    dragStart.current = null;
    dragDelta.current = 0;
    setIsDragging(false);

    // 손가락을 왼쪽으로 밀면 다음 카테고리가 오른쪽에서 들어온다(그 반대도 같다).
    if (delta < -threshold) navigate(active + 1, { flow: "rtl", exitFrom });
    else if (delta > threshold) navigate(active - 1, { flow: "ltr", exitFrom });
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragStart.current = event.clientX;
    dragDelta.current = 0;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;

    const limit = event.currentTarget.clientWidth * 0.22;
    dragDelta.current = Math.max(
      -limit,
      Math.min(limit, event.clientX - dragStart.current)
    );
    if (!dragFrame.current) {
      dragFrame.current = window.requestAnimationFrame(paintDrag);
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    finishDrag(event.currentTarget.clientWidth);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(active - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(active + 1);
    }
  };

  // 키보드 포커스가 안에 있으면 쉬되, 정지 토글에 있을 때는 쉬지 않는다 — 다시 켠 자동 전환이 바로 돈다.
  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    setHasFocusWithin(!toggleRef.current?.contains(event.target));
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setHasFocusWithin(false);
    }
  };

  const slideState = (index: number): SlideState => {
    if (index === active) return showing.previous === null ? "static" : "in";
    return index === showing.previous ? "out" : "idle";
  };

  return (
    <Reveal
      as={S.Showcase}
      variant="group"
      ref={showcaseRef}
      // 호버 정지는 실제 마우스만 — 터치의 호환 마우스 이벤트가 탭 뒤 계속 "호버 중"으로 남지 않게 한다.
      onPointerEnter={(event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") setIsHovered(true);
      }}
      onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") setIsHovered(false);
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <S.TabBar>
        <Reveal
          as={S.Pagination}
          variant="group"
          ref={paginationRef}
          role="group"
          aria-label={ui.paginationLabel}
          onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
            if (event.pointerType === "mouse") {
              lastPointer.current = { x: event.clientX, y: event.clientY };
            }
          }}
        >
          {STACK_GROUPS.map((group, index) => {
            const isActive = index === active;

            return (
              // 이름은 보이는 글자 그대로("01 Language") — 레이블과 화면 글자가 어긋나지 않는다(WCAG 2.5.3).
              <S.PageButton
                key={group.index}
                ref={(node) => {
                  pageRefs.current[index] = node;
                }}
                type="button"
                $active={isActive}
                aria-current={isActive ? "true" : undefined}
                onPointerEnter={(event) => previewTo(event, index)}
                onPointerLeave={leavePage}
                onFocus={() => {
                  cancelHoverIntent();
                  show(index);
                }}
                onClick={() => {
                  cancelHoverIntent();
                  navigate(index);
                }}
              >
                <S.PageIndex $active={isActive}>{group.index}</S.PageIndex>{" "}
                <S.PageLabel>{group.title}</S.PageLabel>
              </S.PageButton>
            );
          })}
          <S.Indicator ref={indicatorRef} aria-hidden>
            {/* 전환마다 진행 바를 처음부터 다시 채운다 */}
            <S.IndicatorFill key={active} $autoplay={isAutoPlaying} />
          </S.Indicator>
        </Reveal>

        <Reveal
          as={S.AutoplayToggle}
          variant="fade"
          ref={toggleRef}
          type="button"
          title={isStopped ? ui.autoplayStart : ui.autoplayStop}
          onClick={() => setIsStopped((stopped) => !stopped)}
        >
          <VisuallyHidden>{isStopped ? ui.autoplayStart : ui.autoplayStop}</VisuallyHidden>
          <S.AutoplayIcon viewBox="0 0 16 16" aria-hidden focusable="false">
            {isStopped ? (
              <path d="M5 2.75v10.5L13.25 8z" />
            ) : (
              <path d="M4 3h2.75v10H4zM9.25 3H12v10H9.25z" />
            )}
          </S.AutoplayIcon>
        </Reveal>
      </S.TabBar>

      <Reveal
        as={S.Viewport}
        variant="group"
        role="region"
        aria-label={ui.regionLabel}
        tabIndex={0}
        data-flow={showing.flow}
        data-dragging={isDragging ? "" : undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {STACK_GROUPS.map((group, index) => {
          const state = slideState(index);

          return (
            <S.Slide
              key={group.index}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              data-state={state}
              aria-hidden={index !== active}
              style={
                state === "out"
                  ? ({
                      "--exit-from": `${showing.exitFrom}px`,
                    } as CSSProperties)
                  : undefined
              }
            >
              <S.SlideCopy>
                <S.Index>
                  {group.index} / {totalLabel}
                </S.Index>
                <S.TitleWrap>
                  <SweepText as={S.Title}>{group.title}</SweepText>
                </S.TitleWrap>
                <S.Description>{group.description}</S.Description>
              </S.SlideCopy>

              <S.Tools
                $count={group.items.length}
                aria-label={`${group.title} ${ui.toolsLabelSuffix}`}
              >
                {group.items.map((item) => (
                  <S.Tool key={item.name}>
                    <S.Icon aria-hidden>
                      {item.image ? (
                        // 144px로 미리 줄인 WebP — 최적화 서버를 거치지 않고 그대로 받는다.
                        <Image
                          src={item.image}
                          alt=""
                          width={72}
                          height={72}
                          unoptimized
                          draggable={false}
                        />
                      ) : (
                        <S.Monogram $color={item.markColor}>
                          {item.mark}
                        </S.Monogram>
                      )}
                    </S.Icon>
                    <S.ToolName>{item.name}</S.ToolName>
                  </S.Tool>
                ))}
              </S.Tools>
            </S.Slide>
          );
        })}
      </Reveal>
      <S.ProjectLink href={projectDetailPath(STACK_GROUPS[active].project.slug)}>
        <span>{ui.projectLabel}</span>
        {STACK_GROUPS[active].project.title}
        <HoverArrow aria-hidden />
      </S.ProjectLink>
    </Reveal>
  );
};

export default StackShowcase;

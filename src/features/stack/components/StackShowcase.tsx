/**
 * 생성 이유: 메인·About에서 기술 그룹을 한 장씩 집중해서 보여주기 위함이다.
 * 역할: 드래그·스와이프·버튼·키보드로 이동하는 기술 슬라이더다.
 * 책임: 현재 슬라이드와 포인터 드래그 상태를 관리한다.
 */
"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { STACK_GROUPS } from "../constants";
import * as S from "./StackShowcase.styled";

const StackShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragStart = useRef<number | null>(null);
  const dragDelta = useRef(0);

  useEffect(() => {
    if (
      isPaused ||
      isDragging ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % STACK_GROUPS.length);
    }, 4600);

    return () => window.clearInterval(timer);
  }, [isDragging, isPaused]);

  const moveTo = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), STACK_GROUPS.length - 1));
  };

  const finishDrag = (width: number) => {
    const threshold = Math.min(72, width * 0.14);

    if (dragDelta.current < -threshold) {
      setActiveIndex((current) =>
        Math.min(current + 1, STACK_GROUPS.length - 1)
      );
    } else if (dragDelta.current > threshold) {
      setActiveIndex((current) => Math.max(current - 1, 0));
    }

    dragStart.current = null;
    dragDelta.current = 0;
    setDragOffset(0);
    setIsDragging(false);
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

    const width = event.currentTarget.clientWidth;
    const limit = width * 0.22;
    const delta = Math.max(
      -limit,
      Math.min(limit, event.clientX - dragStart.current)
    );

    dragDelta.current = delta;
    setDragOffset(delta);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    finishDrag(event.currentTarget.clientWidth);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(activeIndex + 1);
    }
  };

  return (
    <S.Showcase>
      <S.Viewport
        role="region"
        aria-label="기술 스택 슬라이드"
        tabIndex={0}
        $dragging={isDragging}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <S.Track
          $dragging={isDragging}
          style={{
            transform: `translate3d(calc(${-activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
          }}
        >
          {STACK_GROUPS.map((group, index) => (
            <S.Slide key={group.index} aria-hidden={index !== activeIndex}>
              <S.SlideCopy>
                <S.Index>
                  {group.index} / {String(STACK_GROUPS.length).padStart(2, "0")}
                </S.Index>
                <S.Title>{group.title}</S.Title>
                <S.Description>{group.description}</S.Description>
              </S.SlideCopy>

              <S.Tools aria-label={`${group.title} 기술`}>
                {group.items.map((item) => (
                  <S.Tool key={item.name}>
                    <S.Icon aria-hidden>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          width={40}
                          height={40}
                          sizes="40px"
                          draggable={false}
                        />
                      ) : (
                        <S.Monogram>{item.mark}</S.Monogram>
                      )}
                    </S.Icon>
                    <S.ToolName>{item.name}</S.ToolName>
                  </S.Tool>
                ))}
              </S.Tools>
            </S.Slide>
          ))}
        </S.Track>
      </S.Viewport>

      <S.Controls>
        <S.Pagination
          aria-label="기술 카테고리 선택"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsPaused(false);
            }
          }}
        >
          {STACK_GROUPS.map((group, index) => (
            <S.PageButton
              key={group.index}
              type="button"
              $active={index === activeIndex}
              aria-label={`${group.title} 슬라이드로 이동`}
              aria-current={index === activeIndex ? "true" : undefined}
              onMouseEnter={() => moveTo(index)}
              onFocus={() => moveTo(index)}
              onClick={() => moveTo(index)}
            >
              <span>{group.index}</span>
              <strong>{group.title}</strong>
            </S.PageButton>
          ))}
        </S.Pagination>
      </S.Controls>
    </S.Showcase>
  );
};

export default StackShowcase;

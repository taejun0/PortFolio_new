/**
 * 생성 이유: Featured 아코디언 책장 섹션 스타일을 분리한다.
 * 역할: ProjectsSection 헤더·책장 트랙 셸 스타일을 정의한다.
 * 책임: 섹션 헤더와 책장 트랙의 기하(칸 두께·간격·펼친 칸 길이)만 소유한다.
 *       칸은 이 기하로 계산한 고정 위치에 놓이고 보이는 창만 바뀐다(ProjectShelfItem).
 */
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import { motionTransition } from "@/components/common/motion";

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[5]};

  /* 아카이브 링크 포커스도 책장 카드와 같은 액센트 링 */
  > a:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.layout.radius.sm};
  }
`;

export const TitleBlock = styled.div`
  max-width: 36rem;
`;

export const Aside = styled.p`
  margin-top: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ArchiveLink = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};
  ${hoverArrowParent}

  &:hover,
  a:focus-visible > & {
    color: ${({ theme }) => theme.colors.text};
  }
`;

/**
 * 책장 트랙 — 모바일은 세로(행), 태블릿 이상은 가로(책등) 아코디언.
 * --shelf-spine: 접힌 칸 두께, --shelf-gap: 칸 사이, --shelf-panel: 펼친 칸 길이,
 * --shelf-cut: 접힌 칸에서 잘라 내는 길이. 칸 i는 i × (두께 + 간격)에 고정된다.
 */
export const Shelf = styled.ul<{ $count: number }>`
  --shelf-spine: 3.75rem;
  --shelf-gap: ${({ theme }) => theme.space[2]};
  --shelf-panel: clamp(16rem, 48vh, 22rem);
  --shelf-cut: calc(var(--shelf-panel) - var(--shelf-spine));
  --shelf-radius: ${({ theme }) => theme.layout.radius.lg};

  position: relative;
  width: 100%;
  height: calc(
    var(--shelf-panel) + ${({ $count }) => $count - 1} *
      (var(--shelf-spine) + var(--shelf-gap))
  );

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    --shelf-spine: clamp(4.75rem, 7vw, 6.25rem);
    /* 펼친 칸 = 트랙 너비 - 나머지 책등과 간격(컨테이너 단위라 칸 안쪽에서도 같은 길이) */
    --shelf-panel: calc(
      100cqw - ${({ $count }) => $count - 1} *
        (var(--shelf-spine) + var(--shelf-gap))
    );

    container-type: inline-size;
    height: clamp(22rem, 54vh, 32rem);
  }
`;

/**
 * 생성 이유: Approach 탭·패널 시각을 로직과 분리한다.
 * 역할: ApproachSection 스타일이다.
 * 책임: Development Philosophy 탭 선택·활성 표시선·본문 패널 레이아웃과 첫 등장 순서, JS 없음·인쇄 배치만 소유한다.
 *       태블릿 이하는 가로 탭 위 본문, 데스크톱은 번호 붙은 큰 세로 탭 | 본문 2열이다.
 *       탭 전환 스윕(나가는 패널·들어오는 문단)은 panelSweep이 WAAPI로 맡는다.
 *       JS가 없으면(html:not([data-theme-ready="1"])) 탭을 바꿀 수 없고 인쇄에는 숨은 패널이 찍히지 않으므로,
 *       두 경우 모두 세 패널을 차례로 쌓아 전부 보이게 한다.
 */
import styled from "@emotion/styled";

import { motionTransition, staggerChildren } from "@/components/common/motion";

/** 활성 표시선 두께 — 같은 페이지 Stack 탭의 활성선과 같다 */
const INDICATOR = "2px";

/** JS가 없는 방문 — 부트 스크립트가 첫 페인트 전에 data-theme-ready를 붙이지 못했다 */
const NO_JS = 'html:not([data-theme-ready="1"])';

export const Stage = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  max-width: ${({ theme }) => theme.layout.measure};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: minmax(13rem, 1fr) minmax(0, 2.1fr);
    column-gap: ${({ theme }) => theme.space[8]};
    align-items: start;
    max-width: none;
  }
`;

/*
 * 첫 등장은 탭이 하나씩 쓸려 들어온다(Reveal variant="stagger").
 * 모바일 아래 여백은 각 탭 안쪽으로 옮겨(한 줄 배치는 그대로) 활성선이 탭 박스 안에서 기준선 위에 앉게 한다
 * — 박스 밖에 두면 등장 스윕의 clip-path에 잘렸다가 끝에 튀어나온다.
 */
export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 0;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    border-bottom: none;
  }
`;

/*
 * 비활성 탭은 흐린 불투명도 대신 textMuted 색만 써서 라이트 모드에서도 4.5:1을 지킨다.
 * 활성 표시선은 들어올 때 왼쪽부터 본문 스윕과 같은 길이로 그어지고, 나갈 때 오른쪽으로 짧게 빠진다.
 */
export const Tab = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: 0.2rem 0 calc(0.2rem + ${({ theme }) => theme.space[4]});
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  transition: ${motionTransition("color")};

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${INDICATOR};
    background: ${({ theme }) => theme.colors.accent};
    pointer-events: none;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: ${({ $active }) => ($active ? "left" : "right")} center;
    transition: ${({ $active }) =>
      motionTransition("transform", $active ? "reveal" : "hover")};
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    border-radius: 0.2rem;
  }

  /*
   * 데스크톱 라벨은 큰 굵은 글자(대형 텍스트 기준 3:1)라 비활성을 잉크 50%로 더 물린다.
   * (다크 약 5.3:1, 라이트 약 3.6:1) 활성선은 행 아래 구분선 위에 겹친다.
   */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    display: flex;
    align-items: baseline;
    gap: ${({ theme }) => theme.space[4]};
    width: 100%;
    padding: ${({ theme }) => theme.space[5]} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme, $active }) =>
      $active
        ? theme.colors.text
        : `color-mix(in srgb, ${theme.colors.text} 50%, transparent)`};

    &::after {
      bottom: -1px;
    }
  }
`;

export const TabIndex = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};
  transition: ${motionTransition("color")};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.label.fontSize};
  }
`;

export const TabLabel = styled.span<{ $active: boolean }>`
  font-size: clamp(1rem, 0.92rem + 0.35vw, 1.2rem);
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fonts.weights.bold : theme.fonts.weights.medium};
  letter-spacing: -0.01em;

  /* 데스크톱 세로 탭은 Thomas식 큰 번호 목록 — 굵기는 고정하고 색으로만 선택을 구분한다. */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.title.fontSize};
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    line-height: ${({ theme }) => theme.typography.title.lineHeight};
    letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  }
`;

/**
 * 세 패널을 같은 칸에 겹친다 — 칸 높이는 가장 긴 패널이 정해 탭을 바꿔도 아래 챕터가 튀지 않는다.
 * 첫 등장(Reveal variant="group")에서는 패널 안 문단이 리드부터 차례로 쓸려 들어온다.
 * 탭 전환 때 같은 순서를 panelSweep이 다시 그린다.
 */
export const Panels = styled.div`
  ${staggerChildren({ children: "> [role='tabpanel'] > *" })}

  display: grid;
  padding-top: ${({ theme }) => theme.space[2]};

  > * {
    grid-area: 1 / 1;
  }

  /* 첫 탭 행의 글자 높이와 리드 문단 첫 줄을 맞춘다. */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding-top: ${({ theme }) => theme.space[5]};
  }

  /* JS 없음·인쇄 — 겹쳐 둔 패널을 차례로 쌓는다(보임은 Panel이 맡는다). */
  ${NO_JS} & {
    row-gap: ${({ theme }) => theme.space[7]};

    > * {
      grid-area: auto;
    }
  }

  @media print {
    row-gap: ${({ theme }) => theme.space[7]};

    > * {
      grid-area: auto;
    }
  }
`;

/* 칸 높이는 가장 긴 패널이 정하되, 각 패널 박스(포커스 링)는 제 글 높이만큼만 잡는다. */
export const Panel = styled.div<{ $active: boolean }>`
  display: grid;
  align-self: start;
  gap: ${({ theme }) => theme.space[4]};
  visibility: ${({ $active }) => ($active ? "visible" : "hidden")};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 6px;
    border-radius: 0.2rem;
  }

  /* JS 없음·인쇄 — 고르지 않은 패널도 읽히고 찍힌다 */
  ${NO_JS} & {
    visibility: visible;
  }

  @media print {
    visibility: visible;
  }
`;

/** 첫 문단은 탭의 논지 — 한 단계 큰 글자로 먼저 읽히게 한다. */
export const Lead = styled.p`
  font-size: ${({ theme }) => theme.typography.quote.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: ${({ theme }) => theme.typography.quote.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.quote.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Paragraph = styled.p`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textMuted};
`;

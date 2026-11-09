/**
 * 생성 이유: 메인 블로그 티저 스타일을 분리한다.
 * 역할: Articles 헤더·행 리스트 스타일을 정의한다.
 * 책임: 헤더 분량 pill·번호·제목·메타·화살표 행 시각과 호버/포커스 상태만 소유한다.
 *       행 호버·키보드 포커스 = 제목이 오른쪽으로 살짝 밀림 + 행 아래 규칙선을 따라 액센트 선이 왼쪽부터 그어짐
 *       + 화살표가 ↗로 미끄러짐. 모두 공용 모션 헬퍼(underlineSweep·motionTransition·hoverArrowParent)라
 *       /blog 목록 행도 같은 조합으로 맞출 수 있다. 행 등장(스윕)은 컴포넌트의 Reveal이 맡는다.
 */
import { css, type Theme } from "@emotion/react";
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import {
  motionTransition,
  underlineSweep,
  underlineSweepActive,
} from "@/components/common/motion";
import { TextLink } from "../shared/SectionPrimitives.styled";

/** 행 좌우 안쪽 여백 — 포커스 링이 번호·화살표에 붙지 않게 한다. */
const ROW_PAD_X = "clamp(0.75rem, 0.55rem + 0.75vw, 1.25rem)";

/** 호버 때 제목이 밀리는 거리 — 읽던 줄이 튀지 않을 만큼만 */
const TITLE_NUDGE = "0.4rem";

/** 번호·메타 글자 — 기본은 label 토큰, 폰에서는 label이 10px 아래로 내려가 bodySm으로 키운다. */
const rowText = ({ theme }: { theme: Theme }) => css`
  font-size: ${theme.typography.label.fontSize};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.bodySm.fontSize};
  }
`;

/** 타이틀과 보조 문구·분량 pill을 같은 기준선에 둔다 — Stack 헤더와 같은 구성이다. */
export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  column-gap: ${({ theme }) => theme.space[5]};
  row-gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const HeaderMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: ${({ theme }) => theme.space[4]};
  row-gap: ${({ theme }) => theme.space[2]};
`;

export const Aside = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** 분량 시그널 — 프로젝트 목록 Fact pill과 같은 모양에 수치만 액센트로 둔다. */
export const Stat = styled.p`
  ${rowText}
  display: inline-flex;
  align-items: baseline;
  gap: 0.4em;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid
    color-mix(in srgb, ${({ theme }) => theme.colors.text} 16%, transparent);
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: ${({ theme }) => theme.typography.small.lineHeight};
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

export const StatValue = styled.strong`
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`;

export const PostList = styled.ul`
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

/** 큐레이션 순번 — 사이트 공통 번호 표기(굵은 액센트·고정폭 숫자) */
export const PostIndex = styled.span`
  ${rowText}
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`;

export const PostCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
`;

/** 제목 — 호버에서도 글자색은 그대로(모노톤) 두고 가로로만 살짝 밀린다. */
export const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: ${({ theme }) => theme.typography.heading.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.heading.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
  text-wrap: balance;
  transition: ${motionTransition("transform")};
`;

/** 날짜 · 출처 · 주제 한 줄 */
export const PostMeta = styled.p`
  ${rowText}
  line-height: 1.5;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};
`;

/** 반응 지표(조회 수) — 굵기는 한 단계만 올리고 색으로만 띄워 메타 줄 안에서 은은하게 둔다. */
export const PostHighlight = styled.span`
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.accent};
`;

/** 제목 첫 줄 기준선에 맞춰 서는 화살표 — 호버·키보드 포커스에서 ↗로 바뀐다. */
export const Arrow = styled.span`
  display: inline-flex;
  justify-content: center;
  width: 1em;
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  line-height: ${({ theme }) => theme.typography.heading.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition(["color", "transform"])};

  &::before {
    content: "→";
  }
`;

/** 행이 켜진 상태(호버·키보드 포커스) — 규칙선 위 액센트 선, 제목 밀림, 메타·화살표 색 */
const rowActive = (theme: Theme) => css`
  ${underlineSweepActive()}

  ${PostTitle} {
    transform: translateX(${TITLE_NUDGE});
  }

  ${PostMeta} {
    color: ${theme.colors.text};
  }

  ${Arrow} {
    color: ${theme.colors.accent};
  }

  /* 동작 줄이기: 제목은 제자리에 두고 선·색만 바뀐다 */
  @media (prefers-reduced-motion: reduce) {
    ${PostTitle} {
      transform: none;
    }
  }
`;

/** 행 — Reveal(sweep) 호스트라 아래 규칙선도 행과 함께 왼쪽부터 그어지며 들어온다. */
export const PostItem = styled.li`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  a {
    /* 행 아래 규칙선(li border) 위에 겹쳐 그어지는 1px 액센트 선 — 공용 underlineSweep의 전폭 변형 */
    ${({ theme }) =>
      underlineSweep({ inset: "auto 0 -1px 0", color: theme.colors.accent })}
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: baseline;
    column-gap: ${({ theme }) => theme.space[4]};
    padding: ${({ theme }) => theme.space[5]} ${ROW_PAD_X};
    -webkit-tap-highlight-color: transparent;
    ${hoverArrowParent}

    /* 번호 열 폭을 고정해 제목들이 같은 세로선에서 시작한다 */
    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      grid-template-columns:
        clamp(3.25rem, 1.5rem + 5vw, 7.5rem)
        minmax(0, 1fr)
        auto;
      column-gap: ${({ theme }) => theme.space[5]};
    }

    /* 터치 기기에서 탭 뒤 호버 상태가 남지 않게 실제 호버 기기에서만 켠다 */
    @media (hover: hover) {
      &:hover {
        ${({ theme }) => rowActive(theme)}
      }
    }

    /* 클릭 포커스(새 창으로 나간 뒤 돌아온 경우 등)에는 켜지 않고 키보드 포커스에만 켠다 */
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: -2px;
      ${({ theme }) => rowActive(theme)}
    }
  }
`;

/** 화면에는 숨기고 보조기기에만 읽히는 안내 (새 창 열림) */
export const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export const Empty = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CtaWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  margin-top: ${({ theme }) => theme.space[6]};

  ${TextLink} {
    margin-top: 0;
  }
`;

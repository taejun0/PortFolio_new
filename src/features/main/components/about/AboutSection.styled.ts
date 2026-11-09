/**
 * 생성 이유: 메인 About 티저를 지표 띠와 같은 열 그리드 위에 정돈해 보여 준다.
 * 역할: AboutSection 레이아웃 스타일을 정의한다.
 * 책임: 능력 지표·초상·본문·팩트 배치와 초상 등장 시각(마스크가 열리는 동안 사진이 제자리로 가라앉음)만 소유한다.
 *       (상세 구도는 AboutPage, 등장 판정은 공용 Reveal)
 *       데스크톱은 4열 — 초상은 1열, 본문·팩트는 2~4열에 놓여 지표 열과 세로로 맞는다.
 *       모바일·태블릿 지표는 2×2로 접어 한 화면을 다 먹지 않게 한다.
 */
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { TextLink } from "../shared/SectionPrimitives.styled";

/**
 * 초상 next/image sizes — 아래 Layout·Portrait가 실제로 그리는 폭을 구간별로 옮겼다(폭을 바꾸면 같이 바꾼다).
 * - ~415px: min(16rem, 55vw) 중 55vw / ~767px: 16rem(최대 약 244px)
 * - 768~1023px: portraitCol(22vw 중심) / 1024~1279px: 4열 중 1열(약 20vw)
 * - 그 이상: maxWidth 기준 1열(258~265px) — 256px로 둬 1x 화면이 256w 후보(3% 이내 확대)를 고른다.
 *   (실제 폭으로 적으면 384w를 받아 Lighthouse 기준 4KB 넘게 남는다.)
 */
export const PORTRAIT_SIZES =
  "(max-width: 415px) 55vw, (max-width: 767px) 244px, (max-width: 1023px) 22vw, (max-width: 1279px) 20vw, 256px";

/** 마스크가 왼쪽부터 열리는 동안 사진은 아주 조금 큰 상태에서 제자리로 가라앉는다(1.03 이하). */
const settle = keyframes`
  from {
    transform: scale(1.03);
  }
  to {
    transform: none;
  }
`;

/**
 * 지표 띠 — 모바일·태블릿 2×2, 데스크톱 4열.
 * 데스크톱은 띠 안쪽 여백을 한 단계 줄여 섹션 전체가 1440×900 한 화면에 들어오게 한다.
 */
export const Stats = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[7]};
  margin: 0 0 ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[5]} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding: ${({ theme }) => theme.space[4]} 0;
  }
`;

export const Stat = styled.li`
  display: grid;
  /*
   * 칸 안 트랙도 칸 폭에 묶는다 — 기본 auto 트랙은 줄바꿈 기회가 없는 값(FE·BE·Infra)의 최소 폭만큼 커져
   * 단위·설명까지 데리고 칸 밖(화면 가장자리)으로 넘친다(break-word는 최소 폭 계산에 들어가지 않는다).
   */
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: ${({ theme }) => theme.space[1]};
  min-width: 0;
`;

/**
 * 숫자든 단어(FE·BE·Infra)든 같은 크기로 세워 단위·설명 줄이 열마다 같은 높이에 온다.
 * 기본 글자 크기에서는 320~1440px 모든 폭에서 한 줄이고, 글자만 키운 화면(텍스트 200%)에서 칸을 넘을 때만
 * 상속된 overflow-wrap: break-word로 끊긴다 — nowrap이면 화면 가장자리에서 잘린다.
 */
export const StatValue = styled.p`
  font-size: clamp(1.85rem, 1.2rem + 2vw, 2.75rem);
  font-weight: ${({ theme }) => theme.fonts.weights.extraBold};
  letter-spacing: -0.045em;
  line-height: 0.95;
  white-space: normal;
  color: ${({ theme }) => theme.colors.text};
`;

export const StatUnit = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const StatDetail = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[7]};
  max-width: min(36rem, 100%);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns:
      ${({ theme }) => theme.layout.portraitCol}
      minmax(0, 1fr);
    max-width: none;
  }

  /* 지표 띠와 같은 4열·같은 간격 — 초상은 1열, 본문은 2~4열 */
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

/**
 * 초상 — Reveal(sweep) 호스트. 사진의 가라앉음은 리빌 상태("in")와 같은 지연으로 시작하고,
 * 마스크(reveal)보다 조금 길게(title) 이어져 열린 뒤에도 잠깐 움직임이 남는다. 동작 줄이기·JS 없음에서는 그대로 보인다.
 */
export const Portrait = styled.div`
  position: relative;
  width: 100%;
  max-width: min(16rem, 55vw);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-self: start;
    max-width: none;
  }

  @media screen and (prefers-reduced-motion: no-preference) {
    html[data-motion="live"] &[data-reveal-state="in"] img {
      animation: ${settle} ${({ theme }) => theme.motion.duration.title}s
        ${({ theme }) => theme.motion.curve.out} var(--reveal-delay, 0s)
        backwards;
    }
  }
`;

/** 2열 이상에서는 초상 높이만큼 늘어나, 인용은 초상 윗선·팩트와 CTA는 아랫선에 맞는다. */
export const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
  min-width: 0;
  padding-top: 0.15rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-column: 2 / -1;
  }
`;

export const Quote = styled.p`
  font-size: ${({ theme }) => theme.typography.quote.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: ${({ theme }) => theme.typography.quote.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.quote.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
  text-wrap: balance;
`;

export const QuoteLead = styled.p`
  margin-top: -0.35rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * 넓은 열에서도 한 줄이 너무 길어지지 않게 measure로 묶는다.
 * 한 문장짜리 짧은 문단이라 balance로 줄 길이를 고르게 해 "나아갈 수 / 있도록" 같은 어색한 끊김을 피한다.
 */
export const Body = styled.p`
  max-width: ${({ theme }) => theme.layout.measure};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: ${({ theme }) => theme.typography.body.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
  text-wrap: balance;
`;

/** 팩트·CTA 묶음 — 2열 이상에서는 남는 높이를 위로 보내 초상 아래 모서리에 붙는다. */
export const Details = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${({ theme }) => theme.space[2]};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-top: auto;
  }

  /* 간격은 링크 바깥에 둬 키보드 포커스 링이 글자에 붙는다 */
  > a {
    margin-top: ${({ theme }) => theme.space[4]};
  }

  ${TextLink} {
    margin-top: 0;
  }
`;

/** 데스크톱 3열은 지표 2~4열과 같은 폭·간격이라 세로로 정렬된다. */
export const Facts = styled.dl`
  align-self: stretch;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  padding-top: ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.space[7]};
  }
`;

export const Fact = styled.div`
  display: grid;
  gap: 0.2rem;
  min-width: 0;

  /* 2열에서 홀로 남는 마지막 항목(학력)은 한 줄을 다 써서 학교·학부명이 끊기지 않게 한다 */
  &:last-of-type:nth-of-type(odd) {
    grid-column: 1 / -1;

    @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
      grid-column: auto;
    }
  }
`;

export const FactLabel = styled.dt`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const FactValue = styled.dd`
  min-width: 0;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text};
`;

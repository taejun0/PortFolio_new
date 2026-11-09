/**
 * 생성 이유: Tools 챕터 헤더 시각을 로직과 분리한다.
 * 역할: ToolsSection 스타일이다.
 * 책임: 챕터 타이틀·보조 링크의 기준선 정렬과 푸터 앞 마지막 챕터 여백만 소유한다.
 */
import styled from "@emotion/styled";
import Link from "next/link";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import { motionTransition } from "@/components/common/motion";
import {
  Chapter as AboutChapter,
  Title as AboutTitle,
} from "../../AboutPage.styled";

/** 푸터 바로 앞 마지막 챕터 — 기본 챕터 하단 여백(최대 11rem)을 줄여 끝이 비어 보이지 않게 한다. */
export const Chapter = styled(AboutChapter)`
  padding-bottom: ${({ theme }) => theme.space[9]};
`;

/** 메인 Stack 섹션과 같은 구성 — 타이틀과 보조 링크를 같은 기준선에 둔다. */
export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  column-gap: ${({ theme }) => theme.space[5]};
  row-gap: ${({ theme }) => theme.space[3]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

/** 챕터 타이틀의 큰 하단 여백은 Header가 대신 맡는다. */
export const Title = styled(AboutTitle)`
  margin-bottom: 0;
`;

export const AsideLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: ${({ theme }) => theme.typography.bodySm.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};
  ${hoverArrowParent}

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 4px;
    border-radius: 2px;
  }
`;

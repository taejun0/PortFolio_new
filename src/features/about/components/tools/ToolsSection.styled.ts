/**
 * 생성 이유: Tools 챕터 헤더 시각을 로직과 분리한다.
 * 역할: ToolsSection 스타일이다.
 * 책임: 챕터 타이틀과 보조 링크 정렬만 소유한다.
 */
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[5]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const Aside = styled.span`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  ${hoverArrowParent}

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

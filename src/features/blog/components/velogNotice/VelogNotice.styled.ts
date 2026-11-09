/**
 * 생성 이유: Velog 안내 배너 스타일을 렌더링과 분리한다.
 * 역할: VelogNotice 레이아웃·타이포 스타일을 정의한다.
 * 책임: 목록 상단 안내 줄 시각만 소유한다.
 */
import styled from "@emotion/styled";

import { hoverArrowParent } from "@/components/common/hoverArrow/HoverArrow.styled";
import { motionTransition } from "@/components/common/motion";

export const Wrapper = styled.div`
  margin-top: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[5]} 0 ${({ theme }) => theme.space[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

export const Text = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Link = styled.a`
  margin-left: ${({ theme }) => theme.space[1]};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};
  ${hoverArrowParent}

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }
`;

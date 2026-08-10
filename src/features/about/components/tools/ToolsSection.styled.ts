/**
 * 생성 이유: Tools 아이콘 그리드 시각을 로직과 분리한다.
 * 역할: ToolsSection 스타일이다.
 * 책임: 6개 카테고리·stackImage 칩 그리드 레이아웃만 소유한다.
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

export const Grid = styled.div`
  display: grid;
  gap: clamp(2rem, 1.2rem + 3vw, 3rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const Group = styled.section`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  padding-top: ${({ theme }) => theme.space[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const GroupHead = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

export const Index = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.accent};
`;

export const GroupTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

export const Tools = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(4.75rem, 1fr));
  gap: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[3]};
`;

export const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  transition:
    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  img {
    width: 1.65rem;
    height: 1.65rem;
    object-fit: contain;
  }
`;

export const Name = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.02em;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const Tool = styled.li`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  justify-items: center;
  text-align: center;

  &:hover ${Icon} {
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 30%,
      transparent
    );
    transform: scale(1.1);
  }

  &:hover ${Name} {
    color: ${({ theme }) => theme.colors.text};
  }
`;

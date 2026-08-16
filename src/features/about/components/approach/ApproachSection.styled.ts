/**
 * 생성 이유: Approach 탭·패널 시각을 로직과 분리한다.
 * 역할: ApproachSection 스타일이다.
 * 책임: Development Philosophy 탭 선택·본문 패널 레이아웃만 소유한다.
 */
import styled from "@emotion/styled";

export const Stage = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  max-width: ${({ theme }) => theme.layout.measure};
`;

export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[4]};
  padding-bottom: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: 0.2rem 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  opacity: ${({ $active }) => ($active ? 1 : 0.75)};
  transition:
    color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 3px;
    border-radius: 0.2rem;
  }
`;

export const TabIndex = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};
`;

export const TabLabel = styled.span<{ $active: boolean }>`
  font-size: clamp(1rem, 0.92rem + 0.35vw, 1.2rem);
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fonts.weights.bold : theme.fonts.weights.medium};
  letter-spacing: -0.01em;
`;

export const Panel = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  padding-top: ${({ theme }) => theme.space[2]};
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[3]};
`;

export const PanelIndex = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.accent};
`;

export const PanelTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Body = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Paragraph = styled.p`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * 생성 이유: Thinking 섹션 전용 레이아웃을 공용 프리미티브와 구분한다.
 * 역할: 번호가 있는 철학 리스트 스타일을 정의한다.
 * 책임: 원문 철학 항목의 번호·간격·타이포만 소유한다.
 */
import styled from "@emotion/styled";

export const Steps = styled.ol`
  display: grid;
  gap: ${({ theme }) => theme.space[7]};
`;

export const Step = styled.li`
  max-width: ${({ theme }) => theme.layout.measure};
`;

export const StepIndex = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: 0.8125rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.accent};
`;

export const StepTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const StepBody = styled.p`
  font-size: 0.9875rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: pre-line;
`;

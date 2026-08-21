/**
 * 생성 이유: Stack 섹션 스타일을 렌더링과 분리한다.
 * 역할: 기술 인덱스 상단 헤더 레이아웃을 정의한다.
 * 책임: 타이틀과 보조 문구의 정렬만 소유한다.
 */
import styled from "@emotion/styled";

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const Aside = styled.p`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

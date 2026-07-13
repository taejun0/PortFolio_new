/**
 * 생성 이유: 메인 페이지 최상위 레이아웃 스타일을 분리한다.
 * 역할: Simplefolio식 풀폭 섹션 스택 셸 스타일을 정의한다.
 * 책임: 페이지 배경·폭만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

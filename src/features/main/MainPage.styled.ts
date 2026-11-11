/**
 * 생성 이유: 메인 페이지 최상위 레이아웃 스타일을 분리한다.
 * 역할: 내용 높이로 이어지는 메인 섹션의 공통 배경과 폭을 정의한다.
 * 책임: 섹션 높이를 실제 콘텐츠로 계산해 앵커·뒤로 가기 스크롤 복원이 추정 높이에 의존하지 않게 한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

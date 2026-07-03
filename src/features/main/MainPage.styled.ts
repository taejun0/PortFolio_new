/**
 * 생성 이유: 메인 페이지의 스타일 책임을 렌더링 코드와 분리한다.
 * 역할: MainPage에서 사용하는 최상위 스타일 컴포넌트를 정의한다.
 * 책임: 메인 페이지 범위의 레이아웃 스타일만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

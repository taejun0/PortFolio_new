/**
 * 생성 이유: 댓글 위젯 자리 스타일을 BlogComments 로직과 분리한다.
 * 역할: Giscus가 늦게 붙는 동안 댓글 영역 높이를 미리 잡아 두는 자리(slot) 스타일이다.
 * 책임: 자리 높이만 소유한다 — 위젯이 화면 근처에서 붙어도 아래 내용(푸터)이 크게 밀리지 않는다.
 */
import styled from "@emotion/styled";

/** 위젯(iframe)이 붙기 전 자리 — 빈 댓글창 한 벌 정도의 높이다. 위젯이 더 길어지면 그만큼 늘어난다. */
export const Slot = styled.div`
  min-height: 20rem;
`;

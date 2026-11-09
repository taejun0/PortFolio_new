/**
 * 생성 이유: 메인 페이지 최상위 레이아웃 스타일을 분리한다.
 * 역할: Simplefolio식 풀폭 섹션 스택 셸 스타일을 정의한다.
 * 책임: 페이지 배경·폭과 화면 밖 섹션의 렌더 생략(content-visibility) 자리 크기만 소유한다.
 *
 * content-visibility를 두는 이유와 대가(실측, 같은 트리에서 이 블록만 뺀 빌드와 비교):
 * - 첫 로드에서 화면 밖 섹션의 레이아웃·페인트를 건너뛴다 — 4x CPU 모바일에서 첫 렌더 작업이 약 55~70ms 짧고
 *   FCP/LCP가 약 30~55ms 이르다.
 * - 대신 새로 그린 문서(새로고침)·다시 마운트된 페이지(클라이언트 뒤로 가기)는 화면 밖 섹션이 기억한 높이 없이
 *   자리 크기로 시작해, 브라우저가 되돌린 scrollY가 떠날 때와 다른 내용에 멈춘다(자리 크기와 실제 높이의 차이만큼 —
 *   1440px Blog 232px, 390px Blog·Contact −190px). 이 블록을 빼면 복원은 정확해진다.
 */
import styled from "@emotion/styled";

import { chapterQuery } from "./components/shared/SectionPrimitives.styled";

/**
 * 아직 한 번도 그리지 않은 섹션의 자리 높이 — 세로 화면(폰·태블릿 세로)은 섹션이 내용 높이라
 * 실측 평균(390px 폭 530~1050px, 768px 폭 580~860px → 약 740px)으로 잡는다. 100vh(844~1366px)로 두면
 * 깊은 앵커·뒤로 가기 스크롤 복원이 실제 위치보다 아래로 떨어진다. 한 번 그린 뒤에는 auto가 실제 높이를 기억한다
 * (기억은 그 요소에만 남아 새로고침·재마운트에서는 다시 이 값부터 시작한다).
 */
const PORTRAIT_SECTION_ESTIMATE = "740px";

export const Wrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  > section:not(:first-of-type) {
    content-visibility: auto;
    contain-intrinsic-block-size: auto ${PORTRAIT_SECTION_ESTIMATE};

    /* 가로로 넓은 화면은 섹션이 한 화면 챕터(100dvh)다 */
    @media ${({ theme }) => chapterQuery(theme)} {
      contain-intrinsic-block-size: auto 100vh;
    }
  }
`;

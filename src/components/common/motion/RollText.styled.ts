/**
 * 생성 이유: 링크·버튼 라벨의 가로 롤 시각을 컴포넌트 로직과 분리한다.
 * 역할: RollText 루트·앞면·복사본(::after) 스타일이다.
 * 책임: 가로 클립과 롤 트랜지션, 트리거(a·button 호버·키보드 포커스), 동작 줄이기 대체 시각만 소유한다.
 *
 * 복사본은 루트의 data-roll-label을 그리는 ::after다. content를 두 번 쓴다 — 뒤 선언의 CSS 대체 텍스트("")가
 * 접근 가능한 이름에서 복사본을 빼고(없으면 크롬이 로고를 "taejun0taejun0 홈으로 이동"으로 읽는다),
 * 대체 텍스트를 모르는 브라우저는 앞 선언으로 그린다. 생성 콘텐츠라 선택·복사·찾기에도 잡히지 않는다.
 */
import styled from "@emotion/styled";

import { motionTransition, rollTextActive } from "./motionCss";

export const Root = styled.span`
  position: relative;
  display: inline-block;
  white-space: nowrap;
  /* 가로만 박스 경계에서 자르고 위아래는 여유를 둬 디센더·악센트가 잘리지 않게 한다 */
  clip-path: inset(-0.4em 0);
  /*
   * clip-path는 그리기만 자르고 스크롤 영역은 그대로라, 화면 오른쪽 끝 라벨이 구르는 동안
   * 빠져나간 앞면(105%)이 문서 폭을 넓힐 수 있다. 가로만 clip해 스크롤 영역에서도 뺀다
   * (clip은 스크롤 컨테이너를 만들지 않아 기준선·세로 여유는 그대로다).
   */
  overflow-x: clip;

  [data-roll-face] {
    display: block;
    transition: ${motionTransition("transform")};
  }

  /* 복사본은 왼쪽 밖에서 대기하다 앞면이 오른쪽으로 빠지는 만큼 들어온다 */
  &::after {
    content: attr(data-roll-label);
    content: attr(data-roll-label) / "";
    position: absolute;
    inset: 0;
    display: block;
    transform: translateX(-105%);
    transition: ${motionTransition("transform")};
    pointer-events: none;
  }

  /* 태그로 시작해야 한다 — ":"로 시작하면 stylis가 루트 자신의 가상 클래스로 붙인다 */
  @media (hover: hover) {
    a:hover &,
    button:hover & {
      ${rollTextActive}
    }
  }

  a:focus-visible &,
  button:focus-visible & {
    ${rollTextActive}
  }

  /* 동작 줄이기: 움직이지 않고 부모의 색 변화만 남긴다 */
  @media (prefers-reduced-motion: reduce) {
    &::after {
      display: none;
    }

    [data-roll-face] {
      transform: none !important;
    }
  }
`;

/**
 * 생성 이유: 화면에는 그리지 않고 보조기기에만 읽히는 글자를 여러 화면이 같은 방식으로 붙이게 한다.
 * 역할: 시각적으로 숨긴(스크린리더 전용) 인라인 span이다.
 * 책임: 레이아웃·흐름에 영향 없이(절대 위치 1px, 잘림) 글자를 접근성 트리에만 남기는 시각만 소유한다.
 *
 * RollText를 담은 링크에 설명을 더할 때 aria-label 대신 쓴다 — aria-label은 보이는 글자(롤 복사본 포함)가
 * 이름에 들어 있지 않다고 판정돼(label-content-name-mismatch), 내용으로 이름을 만들면 보이는 라벨이 이름 앞에 그대로 온다.
 * @example <S.Link href="/"><RollText>taejun0</RollText><VisuallyHidden> 홈으로 이동</VisuallyHidden></S.Link>
 */
import styled from "@emotion/styled";

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

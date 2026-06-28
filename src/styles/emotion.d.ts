/**
 * 생성 이유: Emotion의 기본 Theme 타입을 프로젝트 디자인 토큰과 연결한다.
 * 역할: styled 컴포넌트에서 theme 속성의 타입 추론을 제공한다.
 * 책임: AppTheme 변경 사항이 Emotion Theme 타입에 자동 반영되도록 유지한다.
 */
import "@emotion/react";
import type { AppTheme } from "./theme";

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends AppTheme {}
}

/**
 * 생성 이유: 화면들이 모션 프리미티브를 한 경로에서 가져오게 한다.
 * 역할: 공용 모션 시스템(리빌·텍스트 스윕·롤·CSS 조각·토큰 연결)의 배럴이다.
 * 책임: 공개 API만 다시 내보낸다. 구현 세부(컨트롤러 내부 상태)는 감춘다.
 */
export { default as Reveal, type RevealProps } from "./Reveal";
export { default as SweepText, type SweepTextProps } from "./SweepText";
export { default as RollText } from "./RollText";
export {
  useReveal,
  type UseRevealOptions,
  type RevealBindings,
} from "./useReveal";
export { revealNow, type RevealInfo } from "./revealController";
export {
  motionTransition,
  rollTextActive,
  rollTextParent,
  staggerChildren,
  underlineSweep,
  underlineSweepActive,
  type StaggerChildrenOptions,
  type UnderlineSweepOptions,
} from "./motionCss";
export {
  CURTAIN_TONES,
  type CurtainTone,
  type RevealVariant,
  type SweepTextVariant,
} from "./constants";

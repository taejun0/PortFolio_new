/**
 * 생성 이유: 스플래시를 클라이언트 JS 없이 서버 HTML만으로 첫 페인트에 그리기 위함이다.
 * 역할: 루트 레이아웃 body 맨 앞에 놓이는 OHTAEJUN 부트 스플래시 정적 마크업(서버 컴포넌트)이다.
 * 책임: 워드마크 한 덩어리 텍스트와 스윕 훅 클래스만 렌더링한다.
 *       표시·종료는 splashBoot가, 실제 첫 화면의 준비 확인은 SplashScreen이 맡는다.
 */
import { SPLASH_DOM, SPLASH_UI } from "./constants";

/**
 * 워드마크는 글자별로 쪼개지 않는다 — 한 블록의 텍스트여야 LCP 후보가 첫 페인트에 통째로 잡힌다.
 * 워드마크는 장식으로 숨기고, 준비 상태 문구만 보조기기에 전달한다.
 */
const BootSplash = () => (
  <div id={SPLASH_DOM.rootId} role="status" aria-live="polite" aria-atomic="true">
    <span className={SPLASH_DOM.markClass}>
      <span className={SPLASH_DOM.wordClass} aria-hidden="true">{SPLASH_UI.name}</span>
      <span className={SPLASH_DOM.statusClass}>{SPLASH_UI.status}</span>
    </span>
  </div>
);

export default BootSplash;

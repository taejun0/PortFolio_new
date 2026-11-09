/**
 * 생성 이유: 스플래시를 클라이언트 JS 없이 서버 HTML만으로 첫 페인트에 그리기 위함이다.
 * 역할: 루트 레이아웃 body 맨 앞에 놓이는 OHTAEJUN 부트 스플래시 정적 마크업(서버 컴포넌트)이다.
 * 책임: 워드마크 한 덩어리 텍스트와 스윕 훅 클래스만 렌더링한다.
 *       연출·스킵·종료는 splashBoot의 CSS·head 스크립트가, React 연동은 SplashScreen이 맡는다.
 */
import { SPLASH_DOM, SPLASH_UI } from "./constants";

/**
 * 워드마크는 글자별로 쪼개지 않는다 — 한 블록의 텍스트여야 LCP 후보가 첫 페인트에 통째로 잡힌다.
 * 장식용 오버레이라 보조기기에는 숨기고(본문 h1이 이름을 읽는다), 서버·클라이언트 마크업이 항상 같다.
 */
const BootSplash = () => (
  <div id={SPLASH_DOM.rootId} aria-hidden="true">
    <span className={SPLASH_DOM.markClass}>
      <span className={SPLASH_DOM.wordClass}>{SPLASH_UI.name}</span>
    </span>
  </div>
);

export default BootSplash;

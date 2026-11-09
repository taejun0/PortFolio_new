/**
 * 생성 이유: 스플래시를 JS·hydration과 무관하게 첫 페인트부터 그리고, 스스로 끝나게 하기 위함이다.
 * 역할: 루트 레이아웃 head에 들어가는 스플래시 부트 CSS와 재생/스킵 결정 인라인 스크립트 문자열이다.
 * 책임: 가로 스윕 연출(등장 와이프·커튼 퇴장)·세션 1회 스킵·스크롤 잠금·dismiss 시그널 발행만 소유한다.
 *
 * 설계 원칙
 * - LCP 안전: 워드마크는 한 덩어리 텍스트로 첫 페인트에 이미 칠해진다(opacity 0·전체 클립 없음).
 *   등장은 그 위를 덮은 캔버스색 셔터가 옆으로 빠지는 와이프라 LCP가 JS·애니메이션에 묶이지 않는다.
 *   스플래시는 기본 display:none이고 html[data-splash="play"]일 때만 그려지는데, head 스크립트가 body 파싱 전에
 *   동기로 이 값을 붙이므로 JS 방문자에게는 첫 페인트부터 그대로 보인다.
 * - 컴포지터 전용: transform·opacity만 움직여 hydration으로 메인 스레드가 바빠도 끊기지 않는다.
 * - 퇴장: 패널 한 장이 오른쪽으로 걷히고, 워드마크는 패널에 실려 함께 나간다(역방향으로 붙잡지 않는다).
 *   워드마크를 제자리에 붙잡으면 패널 가장자리(칼선)가 글자를 가르는 동안 같은 기준선의 히어로 이름이 칼선 왼쪽에
 *   드러나, 두 이름의 글자가 칼선에서 이어 붙은 것처럼 보인다(OHTA|TAEJUN). 함께 나가면 칼선과 워드마크 사이가
 *   처음 여백(가운데 정렬 여백) 그대로 비어 있어 두 이름이 겹쳐 보이지 않는다.
 * - JS가 없으면 그리지 않는다: 세션 1회 재생을 정하는 head 스크립트가 없으면 전체 페이지 이동마다 다시 덮기 때문이다.
 *   스크롤 잠금도 data-splash="play"일 때만 걸린다.
 * - 동작 줄이기·세션 재방문은 첫 페인트 전에 data-splash="skip"으로 결정해 한 프레임도 그리지 않는다.
 * - 색은 팔레트 CSS 변수(theme.colors)라 같은 head <style> 앞부분의 THEME_BOOT_CSS를 따라 첫 페인트부터 저장된 모드다.
 */
import { theme } from "@/styles/theme";
import { STUDY_ROOM_PATH } from "@/features/study-room/config";

import {
  SPLASH_DISMISS_EVENT,
  SPLASH_DOM,
  SPLASH_SESSION_KEY,
  SPLASH_TIMING,
} from "./constants";

const { colors, fonts, motion, typography } = theme;
const EASE = `cubic-bezier(${motion.ease.out.join(",")})`;
const HERO = typography.heroName;
const { rootId, markClass, wordClass, enterAnimation, exitAnimation } =
  SPLASH_DOM;
const { enterMs, exitDelayMs, exitMs, failSafeMs } = SPLASH_TIMING;

/** 줄바꿈·들여쓰기를 걷어 HTML(과 RSC 페이로드에 한 번 더 실리는) 바이트를 줄인다. */
const compact = (source: string) => source.replace(/\n\s*/g, "");

/**
 * 등장 와이프·정지·퇴장 커튼 — 모두 transform/opacity라 컴포지터에서 돈다.
 * 재생(play)일 때만 그린다. 동작 줄이기·인쇄 규칙은 재생 규칙과 같은 구체성으로 뒤에 둬 재생 중에도 이긴다.
 */
export const SPLASH_BOOT_CSS = compact(`
#${rootId}{
  position:fixed;
  inset:0;
  z-index:5000;
  display:none;
  place-items:center;
  overflow:hidden;
  background:${colors.background};
  color:${colors.text};
  will-change:transform;
  animation:${exitAnimation} ${exitMs}ms ${EASE} ${exitDelayMs}ms forwards;
}
html[data-splash="play"] #${rootId}{display:grid}
#${rootId} .${markClass}{display:block}
#${rootId} .${wordClass}{
  position:relative;
  display:block;
  font-family:${fonts.display};
  font-size:${HERO.fontSize};
  font-weight:${fonts.weights.bold};
  line-height:${HERO.lineHeight};
  letter-spacing:${HERO.letterSpacing};
  text-transform:uppercase;
  white-space:nowrap;
  -webkit-user-select:none;
  user-select:none;
  animation:${enterAnimation} ${enterMs}ms ${EASE} both;
}
#${rootId} .${wordClass}::before,
#${rootId} .${wordClass}::after{
  content:"";
  position:absolute;
  top:-0.3em;
  bottom:-0.3em;
  left:-0.12em;
  right:-0.12em;
}
#${rootId} .${wordClass}::after{
  background:${colors.background};
  animation:boot-splash-wipe ${enterMs}ms ${EASE} both;
}
#${rootId} .${wordClass}::before{
  z-index:1;
  border-left:2px solid ${colors.accent};
  animation:boot-splash-wipe ${enterMs}ms ${EASE} both,boot-splash-scan ${enterMs}ms linear both;
}
@keyframes ${enterAnimation}{
  from{transform:translateX(-0.42em)}
  to{transform:none}
}
@keyframes boot-splash-wipe{
  from{transform:translateX(0)}
  to{transform:translateX(104%)}
}
@keyframes boot-splash-scan{
  0%,38%{opacity:1}
  68%,100%{opacity:0}
}
@keyframes ${exitAnimation}{
  from{transform:translateX(0)}
  to{transform:translateX(100%)}
}
html[data-splash="play"]:not([data-splash-done="1"]){scrollbar-gutter:stable}
html[data-splash="play"]:not([data-splash-done="1"]) body{overflow:hidden}
html[data-splash="skip"] #${rootId},
html[data-splash="done"] #${rootId}{display:none}
@media (prefers-reduced-motion:reduce){html[data-splash] #${rootId}{display:none}}
@media print{html[data-splash] #${rootId}{display:none}}
`);

/**
 * body 파싱 전에 실행된다. 재방문(sessionStorage)·동작 줄이기면 스킵을 확정하고,
 * 첫 방문이면 플래그를 남긴 뒤 CSS 애니메이션 이벤트로 dismiss(퇴장 시작)·정리(퇴장 끝)를 맞춘다.
 * React(SplashScreen)가 늦게 깨어나도 스크롤 잠금은 커튼이 걷히는 순간 풀린다.
 * 애니메이션이 아예 돌지 않으면(차단·숨은 탭) 타이머가 같은 정리를 대신한다.
 * 한 문서에서 두 번 돌아도(부트 태그가 중복 주입되는 경우) 두 번째는 아무것도 하지 않는다 — 그렇지 않으면
 * 첫 실행이 남긴 세션 플래그를 보고 재생 중인 스플래시를 스킵으로 바꿔 버린다.
 */
export const SPLASH_BOOT_SCRIPT = compact(`(function(){
  var d=document.documentElement,w=window,skip=false,done=false,timer=0;
  if(d.hasAttribute('data-splash'))return;
  if(location.pathname==='${STUDY_ROOM_PATH}'||location.pathname.indexOf('${STUDY_ROOM_PATH}/')===0){d.setAttribute('data-splash','skip');d.setAttribute('data-splash-done','1');return}
  try{skip=sessionStorage.getItem('${SPLASH_SESSION_KEY}')==='1'}catch(e){}
  try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)skip=true}catch(e){}
  if(skip){d.setAttribute('data-splash','skip');d.setAttribute('data-splash-done','1');return}
  try{sessionStorage.setItem('${SPLASH_SESSION_KEY}','1')}catch(e){}
  d.setAttribute('data-splash','play');
  function dismiss(){
    if(done)return;
    done=true;
    d.setAttribute('data-splash-done','1');
    try{w.dispatchEvent(new Event('${SPLASH_DISMISS_EVENT}'))}catch(e){}
  }
  function finish(){
    dismiss();
    clearTimeout(timer);
    w.removeEventListener('animationstart',onStart,true);
    w.removeEventListener('animationend',onEnd,true);
    d.setAttribute('data-splash','done');
  }
  function onStart(e){
    if(e.animationName==='${enterAnimation}'){clearTimeout(timer);timer=setTimeout(finish,${exitDelayMs + exitMs + 900})}
    else if(e.animationName==='${exitAnimation}')dismiss();
  }
  function onEnd(e){
    if(e.animationName==='${exitAnimation}')finish();
  }
  timer=setTimeout(finish,${failSafeMs});
  w.addEventListener('animationstart',onStart,true);
  w.addEventListener('animationend',onEnd,true);
})();`);

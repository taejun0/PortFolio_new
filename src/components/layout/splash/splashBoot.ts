/**
 * 서버 HTML의 첫 페인트부터 스플래시를 표시한다.
 * 실제 표시 시간 2초와 첫 화면 준비 신호를 모두 충족한 뒤 퇴장한다.
 * 문서 진입마다 실행하며, 클라이언트 라우트 이동에서는 다시 실행하지 않는다.
 * JS가 없으면 표시하지 않고, 실험용 서재는 자체 인트로를 사용한다.
 */
import { theme } from "@/styles/theme";
import { STUDY_ROOM_PATH } from "@/features/study-room/config";
import { SPLASH_READY_EVENT } from "./events";
import { SPLASH_DISMISS_EVENT, SPLASH_DOM, SPLASH_TIMING } from "./constants";

const { colors, fonts, motion, typography } = theme;
const EASE = `cubic-bezier(${motion.ease.out.join(",")})`;
const { rootId, markClass, wordClass, statusClass, enterAnimation, exitAnimation } = SPLASH_DOM;
const { enterMs, minVisibleMs, exitMs, failSafeMs } = SPLASH_TIMING;
const compact = (source: string) => source.replace(/\n\s*/g, "");

export const SPLASH_BOOT_CSS = compact(`
#${rootId}{
  position:fixed;inset:0;z-index:5000;display:none;place-items:center;
  overflow:hidden;background:${colors.background};color:${colors.text};
}
html[data-splash="play"] #${rootId},
html[data-splash="exiting"] #${rootId}{display:grid}
html[data-splash="exiting"] #${rootId}{
  will-change:transform;animation:${exitAnimation} ${exitMs}ms ${EASE} forwards;
}
#${rootId} .${markClass}{display:grid;justify-items:center;gap:1.5rem}
#${rootId} .${wordClass}{
  position:relative;display:block;font-family:${fonts.display};
  font-size:${typography.heroName.fontSize};font-weight:${fonts.weights.bold};
  line-height:${typography.heroName.lineHeight};letter-spacing:${typography.heroName.letterSpacing};
  text-transform:uppercase;white-space:nowrap;-webkit-user-select:none;user-select:none;
  animation:${enterAnimation} ${enterMs}ms ${EASE} both;
}
#${rootId} .${statusClass}{
  font-family:${fonts.body};font-size:${typography.bodySm.fontSize};line-height:1.5;
  color:${colors.textMuted};
}
#${rootId} .${wordClass}::before,
#${rootId} .${wordClass}::after{
  content:"";position:absolute;top:-0.3em;bottom:-0.3em;left:-0.12em;right:-0.12em;
}
#${rootId} .${wordClass}::after{
  background:${colors.background};animation:boot-splash-wipe ${enterMs}ms ${EASE} both;
}
#${rootId} .${wordClass}::before{
  z-index:1;border-left:2px solid ${colors.accent};
  animation:boot-splash-wipe ${enterMs}ms ${EASE} both,boot-splash-scan ${enterMs}ms linear both;
}
@keyframes ${enterAnimation}{from{transform:translateX(-0.42em)}to{transform:none}}
@keyframes boot-splash-wipe{from{transform:translateX(0)}to{transform:translateX(104%)}}
@keyframes boot-splash-scan{0%,38%{opacity:1}68%,100%{opacity:0}}
@keyframes ${exitAnimation}{from{transform:translateX(0)}to{transform:translateX(100%)}}
html:is([data-splash="play"],[data-splash="exiting"]){scrollbar-gutter:stable}
html:is([data-splash="play"],[data-splash="exiting"]) body{overflow:hidden}
html[data-splash="skip"] #${rootId},html[data-splash="done"] #${rootId}{display:none}
@media (prefers-reduced-motion:reduce){
  #${rootId},#${rootId} .${wordClass}{animation:none}
  #${rootId} .${wordClass}::before,#${rootId} .${wordClass}::after{display:none}
}
@media print{html[data-splash] #${rootId}{display:none}}
`);

/**
 * head에서 미리 실행해 본문이 나타났다 다시 덮이는 프레임을 없앤다.
 * 표시 시계는 실제 로고 등장 또는 렌더 프레임에서 시작하며, 숨은 탭에서는 멈춘다.
 * 준비 신호가 먼저 와도 2초를 채우고, 늦게 오면 도착한 시점까지 기다린다.
 * 오류로 준비 신호가 사라진 경우에만 별도의 안전 제한으로 본문을 해제한다.
 */
export const SPLASH_BOOT_SCRIPT = compact(`(function(){
  var d=document.documentElement,w=window,ready=false,shown=false,exiting=false,finished=false;
  var elapsed=0,since=null,minTimer=0,maxTimer=0,exitTimer=0,frame=0;
  if(d.hasAttribute('data-splash'))return;
  if(location.pathname==='${STUDY_ROOM_PATH}'||location.pathname.indexOf('${STUDY_ROOM_PATH}/')===0){
    d.setAttribute('data-splash','skip');d.setAttribute('data-splash-done','1');return;
  }
  d.setAttribute('data-splash','play');
  function now(){return w.performance.now()}
  function pause(){
    if(since!==null){elapsed+=now()-since;since=null}
    clearTimeout(minTimer);
  }
  function check(){
    if(finished||exiting||!shown||document.hidden)return;
    var visible=elapsed+(since===null?0:now()-since);
    if(ready&&visible>=${minVisibleMs})exit();
  }
  function resume(){
    if(finished||exiting||!shown||document.hidden)return;
    if(since===null)since=now();
    clearTimeout(minTimer);
    var remaining=${minVisibleMs}-elapsed-(now()-since);
    if(remaining>0)minTimer=setTimeout(check,remaining);
    check();
  }
  function show(){if(shown||finished)return;shown=true;resume()}
  function onReady(){ready=true;check()}
  function onVisibility(){if(document.hidden)pause();else resume()}
  function finish(){
    if(finished)return;
    finished=true;pause();clearTimeout(maxTimer);clearTimeout(exitTimer);
    w.cancelAnimationFrame(frame);
    w.removeEventListener('${SPLASH_READY_EVENT}',onReady);
    w.removeEventListener('animationstart',onStart,true);
    w.removeEventListener('animationend',onEnd,true);
    document.removeEventListener('visibilitychange',onVisibility);
    document.removeEventListener('DOMContentLoaded',onDomReady);
    d.setAttribute('data-splash','done');
  }
  function exit(){
    if(exiting||finished)return;
    exiting=true;pause();clearTimeout(maxTimer);
    d.setAttribute('data-splash','exiting');
    d.setAttribute('data-splash-done','1');
    try{w.dispatchEvent(new Event('${SPLASH_DISMISS_EVENT}'))}catch(e){}
    var reduced=false;
    try{reduced=w.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
    if(reduced){finish();return}
    exitTimer=setTimeout(finish,${exitMs + 150});
  }
  function onStart(e){
    if(e.animationName==='${enterAnimation}'&&e.target&&e.target.classList&&e.target.classList.contains('${wordClass}'))show();
  }
  function onEnd(e){
    if(exiting&&e.animationName==='${exitAnimation}'&&e.target&&e.target.id==='${rootId}')finish();
  }
  function onDomReady(){
    if(finished)return;
    frame=w.requestAnimationFrame(function(){frame=w.requestAnimationFrame(show)});
  }
  w.addEventListener('${SPLASH_READY_EVENT}',onReady);
  w.addEventListener('animationstart',onStart,true);
  w.addEventListener('animationend',onEnd,true);
  document.addEventListener('visibilitychange',onVisibility);
  maxTimer=setTimeout(function(){ready=true;resume()},${failSafeMs});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onDomReady,{once:true});
  else onDomReady();
})();`);

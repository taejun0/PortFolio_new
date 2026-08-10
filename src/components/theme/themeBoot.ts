/**
 * 생성 이유: 테마 부트 스크립트·키를 layout/Provider가 공유하게 한다.
 * 역할: 테마 모드 저장 키와 FOUC 방지 인라인 스크립트 상수다.
 * 책임: localStorage·cookie·html data-theme 동기화 부트 문자열만 소유한다.
 */
export const THEME_STORAGE_KEY = "portfolio-theme-mode";

/** SSR 스트림에 주입되어 paint 전에 data-theme을 맞춘다. */
export const THEME_BOOT_SCRIPT = `(function(){
  try {
    var k = '${THEME_STORAGE_KEY}';
    var m = localStorage.getItem(k);
    if (m !== 'light' && m !== 'dark') {
      m = document.documentElement.getAttribute('data-theme');
    }
    if (m !== 'light' && m !== 'dark') m = 'dark';
    document.documentElement.dataset.theme = m;
    document.documentElement.style.colorScheme = m;
    document.cookie = k + '=' + m + '; path=/; max-age=31536000; SameSite=Lax';
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
  }
})();`;

/** 첫 화면에 필요한 리소스와 렌더 프레임만 기다린다. 화면 밖의 지연 로딩 이미지는 제외한다. */

const settle = (promise: Promise<unknown>, signal: AbortSignal) => new Promise<void>((resolve) => {
  if (signal.aborted) return resolve();
  const finish = () => {
    signal.removeEventListener("abort", finish);
    resolve();
  };
  signal.addEventListener("abort", finish, { once: true });
  void promise.then(finish, finish);
});

const waitForDom = (signal: AbortSignal) => new Promise<void>((resolve) => {
  if (signal.aborted || document.readyState !== "loading") return resolve();
  const finish = () => {
    document.removeEventListener("DOMContentLoaded", finish);
    signal.removeEventListener("abort", finish);
    resolve();
  };
  document.addEventListener("DOMContentLoaded", finish, { once: true });
  signal.addEventListener("abort", finish, { once: true });
});

const nextFrame = (signal: AbortSignal) => new Promise<void>((resolve) => {
  if (signal.aborted) return resolve();
  let frame = 0;
  const finish = () => {
    window.cancelAnimationFrame(frame);
    signal.removeEventListener("abort", finish);
    resolve();
  };
  frame = window.requestAnimationFrame(finish);
  signal.addEventListener("abort", finish, { once: true });
});

const waitForImage = async (image: HTMLImageElement, signal: AbortSignal) => {
  if (!image.complete && !signal.aborted) {
    await new Promise<void>((resolve) => {
      const finish = () => {
        image.removeEventListener("load", finish);
        image.removeEventListener("error", finish);
        signal.removeEventListener("abort", finish);
        resolve();
      };
      image.addEventListener("load", finish, { once: true });
      image.addEventListener("error", finish, { once: true });
      signal.addEventListener("abort", finish, { once: true });
    });
  }
  if (!signal.aborted && image.naturalWidth > 0 && typeof image.decode === "function") {
    // 깨진 이미지·srcset 교체의 decode 실패가 페이지 진입을 막지 않게 한다.
    await settle(image.decode(), signal);
  }
};

export const waitForInitialView = async (signal: AbortSignal): Promise<boolean> => {
  await waitForDom(signal);
  if (signal.aborted) return false;
  if (document.fonts) await settle(document.fonts.ready, signal);
  if (signal.aborted) return false;

  // React 커밋과 폰트 적용 뒤 레이아웃이 반영된 프레임에서 첫 화면 이미지를 고른다.
  await nextFrame(signal);
  if (signal.aborted) return false;
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("main img")).filter((image) => {
    const rect = image.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 &&
      rect.top < window.innerHeight && rect.left < window.innerWidth;
  });
  await Promise.all(images.map((image) => waitForImage(image, signal)));
  if (signal.aborted) return false;
  // 이미지 디코딩 뒤 실제 화면에 반영될 기회를 주고 준비 완료를 알린다.
  await nextFrame(signal);
  await nextFrame(signal);
  return !signal.aborted;
};

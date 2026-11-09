/**
 * 생성 이유: Next.js 빌드와 런타임에 필요한 프로젝트 설정을 중앙화한다.
 * 역할: Next.js가 Emotion 스타일, 첫 페인트용 CSS 인라인, 원격·최적화 이미지,
 *       블로그 재생성(ISR)이 런타임에 읽는 파일의 트레이싱을 다루도록 구성한다.
 * 책임: 프레임워크 수준 설정만 포함하고 기능별 설정은 소유하지 않는다.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    emotion: true,
  },
  experimental: {
    /*
     * 빌드 CSS는 next/font의 @font-face(약 1KB)뿐이라 <link> 대신 head <style>로 넣는다.
     * 렌더 차단 왕복이 사라져 첫 페인트(=스플래시 LCP)가 한 RTT 빨라진다. 프로덕션 빌드에서만 동작한다.
     */
    inlineCss: true,
  },
  outputFileTracingIncludes: {
    /* ISR 재생성 때 마크다운 원문과 본문 이미지 머리(width·height, CLS 0)를 읽는 동적 경로라 트레이스에 명시한다. */
    "/blog/**": ["./content/blog/**/*", "./public/images/blog/**/*"],
  },
  images: {
    /* AVIF를 받는 브라우저에는 AVIF, 아니면 WebP — 같은 화질에서 사진은 절반 가까이 가볍다. */
    formats: ["image/avif", "image/webp"],
    /*
     * 기본값에서 480을 더하고 3840을 뺐다. 55vw 같은 중간 크기 이미지가 폰에서 640 대신 480을 고르고,
     * 4K 화면이 3840 원본을 받지 않는다. 블로그 마크다운 srcset이 쓰는 640·1080은 남겨 둔다.
     */
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "velog.velcdn.com",
      },
    ],
  },
};

export default nextConfig;

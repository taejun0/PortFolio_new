/**
 * 생성 이유: Next.js 빌드와 런타임에 필요한 프로젝트 설정을 중앙화한다.
 * 역할: Next.js가 Emotion 스타일과 원격 이미지를 다루도록 구성한다.
 * 책임: 프레임워크 수준 설정만 포함하고 기능별 설정은 소유하지 않는다.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    emotion: true,
  },
  outputFileTracingIncludes: {
    "/blog/**": ["./content/blog/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "velog.velcdn.com",
      },
    ],
  },
};

export default nextConfig;

/**
 * 생성 이유: 프로젝트 코드 품질 검사를 일관된 규칙으로 자동화한다.
 * 역할: Next.js Core Web Vitals와 TypeScript ESLint 설정을 조합한다.
 * 책임: 검사 규칙과 생성 산출물 제외 범위를 중앙에서 관리한다.
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

/**
 * 생성 이유: Thomas Eduardo식 하단 푸터를 사이트 공통으로 둔다.
 * 역할: 보조 내비·소셜·브랜드 푸터 컴포넌트다.
 * 책임: 작은 mailto·섹션 내비·소셜 아이콘·카피라이트만 렌더링한다. (주 CTA는 Contact)
 *       화면에 처음 들어올 때 두 줄(내비·연락 / 브랜드·카피라이트)이 차례로 왼쪽부터 쓸려 들어온다.
 *       레이아웃 셸이라 라우트가 바뀌어도 다시 재생하지 않는다.
 *       문구·내비 항목은 푸터 상수(./constants)만 쓴다 — 모든 라우트에 실리는 셸이 홈 화면 상수를 끌고 오지 않는다.
 */
"use client";

import Link from "next/link";

import * as S from "./Footer.styled";
import { FOOTER_NAV_ITEMS, FOOTER_SOCIALS, FOOTER_UI } from "./constants";
import { Reveal, RollText } from "@/components/common/motion";
import { SITE_CONFIG } from "@/lib/siteConfig";

/** GitHub 공식 마크(Octicons mark-github) */
const GitHubIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden focusable="false">
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
    />
  </svg>
);

/** Velog 마크: 둥근 사각형 안의 V (공식 단일 글리프가 없어 같은 무게의 knockout으로 그린다) */
const VelogIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden focusable="false">
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.5 1h11A5.5 5.5 0 0 1 23 6.5v11a5.5 5.5 0 0 1-5.5 5.5h-11A5.5 5.5 0 0 1 1 17.5v-11A5.5 5.5 0 0 1 6.5 1ZM6.2 6h2.9L12 14l2.9-8h2.9l-4.35 12h-2.9L6.2 6Z"
    />
  </svg>
);

const SOCIAL_ICONS = {
  github: GitHubIcon,
  velog: VelogIcon,
} as const;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <S.Footer>
      <Reveal as={S.Inner} variant="stagger">
        <S.Top>
          <S.Nav aria-label={FOOTER_UI.navLabel}>
            {FOOTER_NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}>
                <RollText>{item.label}</RollText>
              </Link>
            ))}
          </S.Nav>
          <S.TopRight>
            <S.Mail href={`mailto:${SITE_CONFIG.email}`}>
              {SITE_CONFIG.email}
            </S.Mail>
            <S.Socials>
              {FOOTER_SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.key];
                return (
                  <S.Social
                    key={social.key}
                    href={SITE_CONFIG[social.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    title={social.label}
                  >
                    <Icon />
                  </S.Social>
                );
              })}
            </S.Socials>
          </S.TopRight>
        </S.Top>
        <S.Bottom>
          <S.Brand>{FOOTER_UI.brand}</S.Brand>
          <S.Legal>
            © {year} {SITE_CONFIG.author}
          </S.Legal>
        </S.Bottom>
      </Reveal>
    </S.Footer>
  );
};

export default Footer;

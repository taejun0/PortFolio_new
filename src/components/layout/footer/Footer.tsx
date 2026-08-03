/**
 * 생성 이유: Thomas Eduardo식 하단 푸터를 사이트 공통으로 둔다.
 * 역할: 연락·내비·브랜드 푸터 컴포넌트다.
 * 책임: availability 이메일, 섹션 내비, 소셜, 카피라이트만 렌더링한다.
 */
"use client";

import Link from "next/link";

import * as S from "./Footer.styled";
import { MAIN_FOOTER_UI } from "@/features/main/constants";
import { SITE_CONFIG } from "@/lib/siteConfig";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <S.Footer>
      <S.Inner>
        <S.Top>
          <S.Contact>
            <S.Availability>{MAIN_FOOTER_UI.availability}</S.Availability>
            <S.Email href={`mailto:${SITE_CONFIG.email}`}>
              {SITE_CONFIG.email}
            </S.Email>
          </S.Contact>
          <S.TopRight>
            <S.Nav>
              {MAIN_FOOTER_UI.nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </S.Nav>
            <S.Socials>
              <S.Social
                href={SITE_CONFIG.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                GH
              </S.Social>
              <S.Social
                href={SITE_CONFIG.velog}
                target="_blank"
                rel="noreferrer"
                aria-label="Velog"
              >
                VL
              </S.Social>
            </S.Socials>
          </S.TopRight>
        </S.Top>
        <S.Bottom>
          <S.Brand>{MAIN_FOOTER_UI.brand}</S.Brand>
          <S.Legal>
            © {year} {SITE_CONFIG.author}
          </S.Legal>
        </S.Bottom>
      </S.Inner>
    </S.Footer>
  );
};

export default Footer;

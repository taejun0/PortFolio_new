/**
 * 생성 이유: 전역 네비게이션을 페이지 feature와 분리한다.
 * 역할: Thomas Eduardo식 좌측 로고 + 중앙 캡슐 네비 헤더다.
 * 책임: 활성 섹션/라우트 표시와 앵커·라우트 링크 렌더링만 담당한다.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import * as S from "./Header.styled";
import { HEADER_NAV_ITEMS, HEADER_UI } from "./constants";
import { ROUTES } from "@/constants/routes";

const SECTION_IDS = ["intro", "about", "projects", "close"] as const;

const Header = () => {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [activeSection, setActiveSection] = useState<string>("intro");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash.replace(/^#/, ""));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (pathname !== ROUTES.MAIN) return;

    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (item: (typeof HEADER_NAV_ITEMS)[number]) => {
    if (item.href === ROUTES.BLOG) {
      return pathname.startsWith(ROUTES.BLOG);
    }
    if (pathname !== ROUTES.MAIN) return false;
    if (hash && item.sectionId) return hash === item.sectionId;
    return Boolean(item.sectionId) && item.sectionId === activeSection;
  };

  return (
    <S.Wrapper>
      <S.Bar>
        <Link href={ROUTES.MAIN}>
          <S.Logo>{HEADER_UI.logo}</S.Logo>
        </Link>
        <S.Nav aria-label="Primary">
          {HEADER_NAV_ITEMS.map((item) => (
            <Link key={item.href + item.label} href={item.href}>
              <S.NavItem $active={isActive(item)}>{item.label}</S.NavItem>
            </Link>
          ))}
        </S.Nav>
      </S.Bar>
    </S.Wrapper>
  );
};

export default Header;

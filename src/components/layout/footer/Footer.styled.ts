/**
 * 생성 이유: 푸터 스타일을 렌더링 로직과 분리한다.
 * 역할: Footer 보조 띠 레이아웃 스타일을 정의한다.
 * 책임: 내비·작은 mailto·소셜 아이콘·브랜드·카피라이트 시각과 호버 반응(롤·밑줄 스윕·아이콘 넛지)만 소유한다.
 *       모바일에서는 좌(내비·메일·브랜드)/우(소셜·카피라이트) 두 축으로 정렬한다.
 */
import styled from "@emotion/styled";

import { motionTransition, underlineSweep } from "@/components/common/motion";

export const Footer = styled.footer`
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.layout.gutter}
    ${({ theme }) => theme.space[6]};
  background: ${({ theme }) => theme.colors.background};
  border-top: ${({ theme }) => theme.layout.borderWidth.divider} solid ${({ theme }) => theme.colors.border};
`;

export const Inner = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
`;

export const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};

  /* 내비 아래로 내려가는 폭에서는 한 줄 전체를 쓰고 메일은 왼쪽, 소셜은 오른쪽 축에 맞춘다 */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 100%;
    justify-content: space-between;
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  column-gap: ${({ theme }) => theme.space[4]};

  /* 라벨은 RollText — 호버·키보드 포커스에서 오른쪽으로 빠지고 같은 글자가 왼쪽에서 들어온다 */
  a {
    /* 작은 글자라도 탭 높이를 확보한다 */
    padding-block: ${({ theme }) => theme.space[1]};
    border-radius: 0.2rem;
    font-size: ${({ theme }) => theme.typography.small.fontSize};
    font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
    transition: ${motionTransition("color")};

    &:hover,
    &:focus-visible {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

/** 메일은 길어서 굴리지 않고 1px 선이 왼쪽부터 그어진다(떠날 때 오른쪽으로 빠진다). */
export const Mail = styled.a`
  ${underlineSweep({ offset: "0.12em" })}
  min-width: 0;
  border-radius: 0.2rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  line-height: ${({ theme }) => theme.typography.bodySm.lineHeight};
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition("color")};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Socials = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.space[2]};
`;

/**
 * 헤더 테마 토글과 같은 크기·테두리의 원형 아이콘 버튼.
 * 새 창 링크라 호버·포커스에서 아이콘이 HoverArrow(→ ↗)와 같은 거리·길이로 오른쪽 위로 살짝 밀린다.
 */
export const Social = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(2rem, 1.7rem + 0.6vw, 2.35rem);
  height: clamp(2rem, 1.7rem + 0.6vw, 2.35rem);
  border-radius: 999px;
  border: ${({ theme }) => theme.layout.borderWidth.control} solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: ${motionTransition(["color", "border-color", "background"])};

  svg {
    width: 0.95rem;
    height: 0.95rem;
    transition: ${motionTransition("transform")};
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.text};
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 30%,
      transparent
    );
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 8%,
      transparent
    );
  }

  /* 터치 기기에서는 탭 뒤에 호버가 남지 않도록 포인터 호버에서만 민다 */
  @media (hover: hover) {
    &:hover svg {
      transform: translate(2px, -2px);
    }
  }

  &:focus-visible svg {
    transform: translate(2px, -2px);
  }

  /* 동작 줄이기: 색·테두리 변화만 남긴다 */
  @media (prefers-reduced-motion: reduce) {
    &:hover svg,
    &:focus-visible svg {
      transform: none;
    }
  }
`;

export const Bottom = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Brand = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

export const Legal = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

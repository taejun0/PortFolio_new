/**
 * 생성 이유: 히어로 풀뷰포트 스타일을 본문 섹션과 분리한다.
 * 역할: IntroSection 레이아웃·타이포 스타일을 정의한다.
 * 책임: 그리드 배경·역할 라인·디스플레이 네임·스크롤 힌트 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Section = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  min-height: calc(100vh - ${({ theme }) => theme.layout.headerHeight});
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.layout.gutter}
    ${({ theme }) => theme.space[9]};
  background:
    radial-gradient(
      ellipse 55% 45% at 78% 18%,
      rgba(160, 236, 6, 0.08),
      transparent 60%
    ),
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    ${({ theme }) => theme.colors.background};
  background-size:
    auto,
    64px 64px,
    64px 64px,
    auto;
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  width: 100%;
`;

export const Roles = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[1]};
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Role = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

export const RoleDot = styled.span`
  opacity: 0.55;
`;

export const DisplayWrap = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const Title = styled.p`
  max-width: 34rem;
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ScrollHint = styled.a`
  position: absolute;
  left: 50%;
  bottom: ${({ theme }) => theme.space[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  transform: translateX(-50%);
  font-size: 0.6875rem;
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ScrollLine = styled.span`
  width: 1px;
  height: 2.5rem;
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.textMuted},
    transparent
  );
`;

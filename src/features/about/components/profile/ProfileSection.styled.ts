/**
 * 생성 이유: Thomas Sobre식 첫 화면 구도를 About 프로필에 맞춘다.
 * 역할: ProfileSection 스타일이다.
 * 책임: 여유로운 디스플레이 네임·카드·초상 간격만 소유한다.
 */
import styled from "@emotion/styled";

export const Chapter = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: clamp(5rem, 3rem + 8vw, 9rem)
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Eyebrow = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const DisplayName = styled.h1`
  display: grid;
  gap: 0.08em;
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const NameLine = styled.span`
  display: block;
  font-size: clamp(3rem, 1.4rem + 8vw, 6.5rem);
  font-weight: ${({ theme }) => theme.fonts.weights.extraBold};
  line-height: 0.92;
  letter-spacing: -0.045em;
  color: ${({ theme }) => theme.colors.text};
`;

export const Tagline = styled.p`
  margin-bottom: 0;
  max-width: min(36rem, 100%);
  font-size: clamp(1.05rem, 0.95rem + 0.55vw, 1.3rem);
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const MarqueeSlot = styled.div`
  width: 100%;
  margin-top: auto;
`;

export const Emphasis = styled.strong`
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.92fr);
  gap: clamp(2rem, 1.25rem + 4vw, 4rem);
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space[7]};
  }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
  padding: clamp(2rem, 1.4rem + 2.5vw, 3.25rem);
  border-radius: clamp(1.35rem, 1rem + 1.2vw, 2rem);
`;

export const CardLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CardTitle = styled.h2`
  max-width: 16ch;
  font-size: clamp(1.55rem, 1.15rem + 1.6vw, 2.15rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.025em;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.text};
`;

export const Body = styled.p`
  max-width: 38ch;
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[4]};
  padding-top: ${({ theme }) => theme.space[2]};
`;

export const PrimaryCta = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1rem 1.6rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) =>
    theme.mode === "light" ? theme.colors.accentContrast : "#000000"};
  background: ${({ theme }) => theme.colors.text};
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  a:hover & {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  a:active & {
    transform: translateY(0) scale(0.98);
  }
`;

export const SecondaryCta = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 1rem 1.6rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  transition:
    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  a:hover & {
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 30%,
      transparent
    );
    color: ${({ theme }) => theme.colors.text};
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 8%,
      transparent
    );
  }
`;

export const PortraitBlock = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  gap: ${({ theme }) => theme.space[4]};
  width: 90%;
  align-self: end;
  justify-self: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: min(16rem, 55vw);
    justify-self: start;
  }
`;

export const Portrait = styled.div`
  position: relative;
  width: 100%;
`;

export const Caption = styled.div`
  display: grid;
  gap: 0.45rem;
`;

export const Role = styled.p`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
`;

export const Meta = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

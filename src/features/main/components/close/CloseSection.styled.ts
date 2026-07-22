/**
 * 생성 이유: Contact 마무리 장면 시각을 로직과 분리한다.
 * 역할: CloseSection 레이아웃·채널 카드 스타일을 정의한다.
 * 책임: 히어로와 맞는 그리드 분위기·2열 카피/채널·CTA 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Section = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background:
    radial-gradient(
      ellipse 50% 42% at 18% 78%,
      ${({ theme }) => theme.colors.splashWash},
      transparent 62%
    ),
    linear-gradient(${({ theme }) => theme.colors.gridLine} 1px, transparent 1px),
    linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.gridLine} 1px,
      transparent 1px
    ),
    ${({ theme }) => theme.colors.surface};
  background-size:
    auto,
    clamp(40px, 5vw, 64px) clamp(40px, 5vw, 64px),
    clamp(40px, 5vw, 64px) clamp(40px, 5vw, 64px),
    auto;
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

export const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  display: grid;
  gap: ${({ theme }) => theme.space[8]};
  align-items: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: ${({ theme }) => theme.space[8]};
  }
`;

export const Intro = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  max-width: 34rem;
`;

export const Label = styled.p`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h2`
  font-size: clamp(2.4rem, 1.4rem + 4vw, 4.25rem);
  font-weight: ${({ theme }) => theme.fonts.weights.extraBold};
  letter-spacing: -0.04em;
  line-height: 0.98;
  color: ${({ theme }) => theme.colors.text};
`;

export const Body = styled.p`
  font-size: ${({ theme }) => theme.typography.bodyLg.fontSize};
  line-height: ${({ theme }) => theme.typography.bodyLg.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[1]};
`;

export const StatusDot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 0 4px
    color-mix(in srgb, ${({ theme }) => theme.colors.accent} 22%, transparent);
`;

export const Status = styled.span`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
`;

export const StatusSep = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.7;
`;

export const StatusMuted = styled.span`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Cta = styled.a`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  margin-top: ${({ theme }) => theme.space[3]};
  padding: clamp(0.85rem, 0.7rem + 0.5vw, 1.05rem)
    clamp(1.4rem, 1rem + 1.4vw, 2rem);
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) =>
    theme.mode === "light" ? theme.colors.accentContrast : "#000000"};
  background: ${({ theme }) => theme.colors.accent};
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.accentSecondary};
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

export const CtaHint = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Channels = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[3]};
`;

export const Channel = styled.a`
  position: relative;
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[5]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radius.md};
  background: transparent;
  transition:
    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 12%,
      transparent
    );
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 4%,
      transparent
    );
  }
`;

export const ChannelTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
`;

export const ChannelLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const ChannelHint = styled.span`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  ${Channel}:hover & {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ChannelValue = styled.span`
  padding-right: 1.5rem;
  font-size: clamp(1.05rem, 0.95rem + 0.6vw, 1.35rem);
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: -0.02em;
  word-break: break-all;
  color: ${({ theme }) => theme.colors.text};
`;

export const ChannelArrow = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.space[5]};
  bottom: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.55;
  transition:
    color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  ${Channel}:hover & {
    color: ${({ theme }) => theme.colors.text};
    opacity: 1;
    transform: translateX(2px);
  }
`;

/**
 * 생성 이유: 메인 About 티저를 균형 잡힌 2열로 보여 준다.
 * 역할: AboutSection 레이아웃 스타일을 정의한다.
 * 책임: 능력 지표·초상·본문·팩트 배치만 소유한다. (상세 구도는 AboutPage)
 */
import styled from "@emotion/styled";

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[5]};
  margin: 0 0 ${({ theme }) => theme.space[7]};
  padding: ${({ theme }) => theme.space[5]} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const Stat = styled.article`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  min-width: 0;
`;

export const StatValue = styled.p`
  font-size: clamp(1.85rem, 1.2rem + 2vw, 2.75rem);
  font-weight: ${({ theme }) => theme.fonts.weights.extraBold};
  letter-spacing: -0.045em;
  line-height: 0.95;
  color: ${({ theme }) => theme.colors.text};
`;

export const StatUnit = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const StatDetail = styled.p`
  max-width: 16ch;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.layout.portraitCol} minmax(0, 1fr);
  gap: ${({ theme }) => theme.space[7]};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    max-width: min(36rem, 100%);
  }
`;

export const Portrait = styled.div`
  position: relative;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: min(16rem, 55vw);
  }
`;

export const Copy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  min-width: 0;
  padding-top: 0.15rem;
`;

export const Quote = styled.p`
  font-size: ${({ theme }) => theme.typography.quote.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: ${({ theme }) => theme.typography.quote.lineHeight};
  letter-spacing: ${({ theme }) => theme.typography.quote.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const QuoteLead = styled.p`
  margin-top: -0.35rem;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Body = styled.p`
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  line-height: ${({ theme }) => theme.typography.body.lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Facts = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  margin-top: ${({ theme }) => theme.space[2]};
  padding-top: ${({ theme }) => theme.space[5]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const Fact = styled.div`
  display: grid;
  gap: 0.2rem;
  min-width: 0;
`;

export const FactLabel = styled.dt`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const FactValue = styled.dd`
  min-width: 0;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.45;
  word-break: keep-all;
  color: ${({ theme }) => theme.colors.text};
`;

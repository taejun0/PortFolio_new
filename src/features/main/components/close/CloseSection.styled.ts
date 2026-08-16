/**
 * 생성 이유: Contact 마무리 장면 시각을 로직과 분리한다.
 * 역할: 세로형 앞·뒷면 명함 목업 스타일을 정의한다.
 * 책임: 아치 초상, 뒷면 정보 위계, 용지 질감과 그림자만 소유한다.
 */
import styled from "@emotion/styled";

const paper = "#f6f6f6";
const paperLit = "#fcfcfc";
const ink = "#111111";
const mute = "#6a6a6a";
const hair = "#d4d4d4";

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[6]};
  min-height: 100vh;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.layout.sectionPaddingY}
    ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
  scroll-margin-top: ${({ theme }) => theme.layout.headerHeight};
`;

export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[6]};
  width: fit-content;
  max-width: 100%;
`;

export const Kicker = styled.p`
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Deck = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: center;
  gap: clamp(1.4rem, 3vw, 2.4rem);
  padding: 0.5rem 0 1.75rem;
  overflow: visible;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
  }
`;

export const Card = styled.article`
  width: min(18.5rem, calc(100vw - 2.5rem));
  aspect-ratio: 50 / 90;
  border-radius: 0;
  background: linear-gradient(210deg, ${paperLit} 0%, ${paper} 72%, #eeeeee 100%);
  box-shadow:
    inset -1px 1px 0 rgb(255 255 255 / 80%),
    inset 1px -1px 0 rgb(0 0 0 / 5%),
    -2px 3px 0 #d0d0d2,
    -10px 14px 22px rgb(0 0 0 / 40%),
    -20px 26px 38px rgb(0 0 0 / 26%);
`;

export const Front = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1.85rem 1.35rem 1.4rem;
`;

export const FrontStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
`;

export const Arch = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-top-left-radius: 50% 32%;
  border-top-right-radius: 50% 32%;
  border-bottom-left-radius: 0.12rem;
  border-bottom-right-radius: 0.12rem;
  background: ${paperLit};

  img {
    object-fit: cover;
    object-position: center 36%;
    filter: grayscale(1) contrast(1.04);
    transform: scale(1.08);
    transform-origin: center 20%;
  }
`;

export const Quote = styled.p`
  display: grid;
  justify-items: center;
  gap: 0.08rem;
  width: 100%;
  margin-top: 1.35rem;
  font-family: ${({ theme }) => theme.fonts.script};
  font-size: 1.42rem;
  font-weight: 400;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: 0.01em;
  text-align: center;
  color: ${ink};

  span {
    display: block;
    width: 100%;
    text-align: center;
  }
`;

export const Back = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 2.1rem 1.7rem 1.75rem;
`;

export const Identity = styled.div`
  display: grid;
  gap: 0.4rem;
`;

export const Name = styled.p`
  font-size: 2.35rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: -0.04em;
  line-height: 1;
  color: ${ink};
`;

export const Role = styled.p`
  font-size: 0.92rem;
  line-height: 1.4;
  color: ${mute};
`;

export const Contacts = styled.div`
  display: grid;
  gap: 0.48rem;
`;

export const RowLabel = styled.span`
  width: 5.5rem;
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${ink};
`;

export const RowValue = styled.span`
  min-width: 0;
  font-size: 0.8rem;
  letter-spacing: -0.01em;
  color: ${ink};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const Row = styled.a`
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  align-items: baseline;
  column-gap: 0.65rem;

  &:hover ${RowValue} {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Body = styled.div`
  display: grid;
  gap: 0.95rem;
  margin-top: auto;
`;

export const Note = styled.p`
  font-size: 0.75rem;
  line-height: 1.55;
  color: ${mute};
`;

export const Rule = styled.span`
  display: block;
  width: 100%;
  height: 1px;
  background: ${hair};
`;

export const Works = styled.div`
  display: grid;
  gap: 0.5rem;
`;

export const WorksSep = styled.span`
  font-weight: ${({ theme }) => theme.fonts.weights.regular};
`;

export const WorksHead = styled.p`
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${ink};
`;

export const WorksList = styled.ul`
  display: grid;
  gap: 0.3rem;
  font-size: 0.82rem;
  line-height: 1.45;
  color: ${ink};
`;

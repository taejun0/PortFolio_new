/**
 * 생성 이유: 메인 블로그 티저 스타일을 분리한다.
 * 역할: Articles 헤더·행 리스트 스타일을 정의한다.
 * 책임: 날짜·제목·화살표 행 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

export const Aside = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Stats = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const PostList = styled.ul`
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Arrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1em;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
  opacity: 0.55;
  transition:
    color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: "→";
  }
`;

export const PostTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const PostCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[1]};
  min-width: 0;
`;

export const PostNote = styled.p`
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PostItem = styled.li`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  a {
    display: grid;
    gap: ${({ theme }) => theme.space[2]};
    padding: ${({ theme }) => theme.space[5]} 0;

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
      grid-template-columns: clamp(5.5rem, 12vw, 7.5rem) 1fr auto;
      align-items: baseline;
      gap: ${({ theme }) => theme.space[5]};
    }
  }

  &:hover ${PostTitle} {
    color: ${({ theme }) => theme.colors.text};
    opacity: 1;
  }

  &:hover ${Arrow} {
    color: ${({ theme }) => theme.colors.text};
    opacity: 1;
    transform: translate(2px, -2px);

    &::before {
      content: "↗";
    }
  }
`;

export const PostMeta = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LinkArrow = styled.span`
  display: inline-block;
  margin-left: 0.35em;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: "→";
  }
`;

export const CtaWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[6]};

  a span {
    margin-top: 0;
  }

  a:hover ${LinkArrow} {
    transform: translate(2px, -2px);

    &::before {
      content: "↗";
    }
  }
`;

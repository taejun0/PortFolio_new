/**
 * 생성 이유: Featured 가로 아코디언 책장 섹션 스타일을 분리한다.
 * 역할: ProjectsSection 헤더·책장 트랙 셸 스타일을 정의한다.
 * 책임: 섹션 헤더와 가로 shelf 컨테이너만 소유한다.
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

export const TitleBlock = styled.div`
  max-width: 36rem;
`;

export const Aside = styled.p`
  margin-top: ${({ theme }) => theme.space[2]};
  max-width: 32ch;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ArchiveLink = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Shelf = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    align-items: stretch;
    height: clamp(22rem, 56vh, 34rem);
  }
`;

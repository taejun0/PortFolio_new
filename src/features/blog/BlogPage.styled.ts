/**
 * 생성 이유: 블로그 목록 스타일을 분리한다.
 * 역할: BlogPage 레이아웃·리스트·우측 썸네일 스타일을 정의한다.
 * 책임: 다크 톤 목록과 호버 시 확대되는 미리보기 썸네일 시각만 소유한다.
 */
import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100%;
  padding-top: ${({ theme }) => theme.layout.sectionPaddingY};
  padding-bottom: ${({ theme }) => theme.space[6]};
  padding-inline: ${({ theme }) => theme.layout.gutter};
  background: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
`;

export const Label = styled.p`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.label.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: ${({ theme }) => theme.typography.label.letterSpacing};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.title.letterSpacing};
  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.p`
  margin-bottom: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Hint = styled.p`
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: 1px dashed ${({ theme }) => theme.colors.borderStrong};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Empty = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const List = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
`;

export const Thumb = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: clamp(10rem, 22vw, 13.5rem);
  aspect-ratio: 16 / 10;
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  opacity: 0.62;
  transform: scale(0.96);
  transform-origin: center right;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1);
    transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

export const ThumbWrap = styled.div`
  display: none;
  justify-content: flex-end;
  align-self: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

export const Item = styled.li`
  position: relative;
  padding: ${({ theme }) => theme.space[5]};
  border-radius: ${({ theme }) => theme.layout.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.colors.text} 2%,
    transparent
  );
  transition:
    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  a {
    display: block;
  }

  &:hover {
    z-index: 2;
    border-color: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 12%,
      transparent
    );
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.colors.text} 4.5%,
      transparent
    );

    ${Thumb} {
      opacity: 1;
      transform: scale(1.14);
      border-color: color-mix(
        in srgb,
        ${({ theme }) => theme.colors.text} 18%,
        transparent
      );
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.38);

      img {
        transform: scale(1.1);
      }
    }
  }
`;

export const Row = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[5]};
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr) minmax(10rem, 13.5rem);
  }
`;

export const Copy = styled.div`
  min-width: 0;
`;

export const Index = styled.p`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.accent};
`;

export const ItemTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
`;

export const ItemDescription = styled.p`
  margin-bottom: ${({ theme }) => theme.space[3]};
  max-width: ${({ theme }) => theme.layout.measure};
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Meta = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.textMuted};
`;

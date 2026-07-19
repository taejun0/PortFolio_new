/**
 * 생성 이유: 플립 카드 앞/뒷면 시각을 ProjectsSection과 분리한다.
 * 역할: ProjectFlipCard 고정 크기·3D 뒤집기 스타일을 정의한다.
 * 책임: 카드 치수·앞면 미디어·뒷면 정보 레이아웃만 소유한다.
 */
import styled from "@emotion/styled";

export const Scene = styled.div`
  width: ${({ theme }) => theme.layout.cardWidth};
  flex-shrink: 0;
  perspective: 1400px;
`;

export const Card = styled.div<{ $flipped: boolean }>`
  position: relative;
  width: 100%;
  height: ${({ theme }) => theme.layout.cardHeight};
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  transform: ${({ $flipped }) =>
    $flipped ? "rotateY(180deg)" : "rotateY(0deg)"};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 4px;
  }
`;

export const Face = styled.div<{ $front?: boolean; $back?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.layout.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  overflow: hidden;
  transform: ${({ $back }) => ($back ? "rotateY(180deg)" : "rotateY(0deg)")};
`;

export const Badge = styled.span`
  align-self: flex-start;
  max-width: 100%;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Media = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-height: clamp(8rem, 22vh, 12rem);
  overflow: hidden;
  border-radius: ${({ theme }) => theme.layout.radius.md};
  background: ${({ theme }) => theme.colors.surface};
`;

export const FrontCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  flex-shrink: 0;
`;

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.heading.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.text};
`;

export const Summary = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const BackScroll = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
`;

export const BackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  flex-shrink: 0;
`;

export const TitleMark = styled.span`
  flex-shrink: 0;
  width: clamp(1.25rem, 1rem + 0.5vw, 1.5rem);
  height: clamp(1.25rem, 1rem + 0.5vw, 1.5rem);
  border-radius: ${({ theme }) => theme.layout.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(
    135deg,
    rgba(160, 236, 6, 0.4),
    transparent 70%
  );
`;

export const Overview = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const Tag = styled.li`
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.text};
`;

export const Meta = styled.div`
  display: grid;
  gap: 0.2rem;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const RoleTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const RoleList = styled.ul`
  display: grid;
  gap: 0.35rem;
  padding-left: 1rem;
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.textMuted};
  list-style: disc;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.space[2]};
`;

export const TextLink = styled.span`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s ease;

  a:hover & {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

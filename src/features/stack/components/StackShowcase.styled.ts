import styled from "@emotion/styled";

export const Showcase = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
`;

export const Viewport = styled.div<{ $dragging: boolean }>`
  overflow: hidden;
  cursor: ${({ $dragging }) => ($dragging ? "grabbing" : "grab")};
  touch-action: pan-y;
  user-select: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: -2px;
  }
`;

export const Track = styled.div<{ $dragging: boolean }>`
  display: flex;
  transition: ${({ $dragging }) =>
    $dragging
      ? "none"
      : "transform 0.52s cubic-bezier(0.16, 1, 0.3, 1)"};
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Slide = styled.article`
  display: grid;
  grid-template-columns: minmax(12rem, 0.72fr) minmax(0, 1.6fr);
  gap: clamp(2rem, 3.6vw, 4rem);
  align-items: center;
  min-width: 100%;
  min-height: clamp(17rem, 25vw, 21rem);
  padding: clamp(1.5rem, 1.05rem + 1.6vw, 2.5rem);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space[6]};
    min-height: 23rem;
  }
`;

export const SlideCopy = styled.div`
  min-width: 0;
`;

export const Index = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[3]};
  font-size: 0.55rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.colors.accent};
`;

export const Title = styled.h3`
  font-size: clamp(2rem, 1.35rem + 2.7vw, 4rem);
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 0.9;
  letter-spacing: -0.065em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  max-width: 22rem;
  margin-top: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Tools = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
  gap: clamp(1.1rem, 0.9rem + 0.7vw, 1.5rem);
  align-content: center;
`;

export const Tool = styled.li`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 0;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[2]};
`;

export const Icon = styled.span`
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;

  img {
    width: 1.7rem;
    height: 1.7rem;
    object-fit: contain;
    pointer-events: none;
  }
`;

export const Monogram = styled.span`
  display: grid;
  place-items: end;
  width: 1.7rem;
  height: 1.7rem;
  padding: 0.2rem;
  background: #3178c6;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.48rem;
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  line-height: 1;
  color: #ffffff;
`;

export const ToolName = styled.span`
  max-width: 100%;
  font-size: clamp(0.74rem, 0.7rem + 0.15vw, 0.82rem);
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  overflow-wrap: anywhere;
`;

export const Controls = styled.div`
  display: flex;
  align-items: stretch;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Pagination = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PageButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex: 0 0 auto;
  padding: 0.75rem clamp(0.65rem, 0.5rem + 0.5vw, 0.95rem);
  border: 0;
  background: transparent;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  opacity: ${({ $active }) => ($active ? 1 : 0.46)};
  transform: ${({ $active }) => ($active ? "translateY(-2px)" : "none")};
  cursor: pointer;
  transition:
    color 0.3s ease,
    opacity 0.3s ease,
    transform 0.42s cubic-bezier(0.16, 1, 0.3, 1);

  span {
    font-size: 0.5rem;
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.accent : theme.colors.textMuted};
  }

  strong {
    font-size: 0.58rem;
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    text-transform: uppercase;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: -2px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    opacity: 1;
    transform: translateY(-2px);
  }

  @media (max-width: 560px) {
    strong {
      display: none;
    }
  }
`;

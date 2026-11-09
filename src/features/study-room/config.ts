/** Route, copy and timing stay independent from the replaceable artwork. */
export const STUDY_ROOM_PATH = "/test/mainpage";
export const isStudyRoomPath = (path: string) =>
  path === STUDY_ROOM_PATH || path.startsWith(`${STUDY_ROOM_PATH}/`);

export const ROOM_COPY = {
  illustration: "늦은 오후 햇살이 들어오는 서재. 책과 식물이 놓인 방에서 한 사람이 책상 앞에 앉아 코드를 작성하고 있습니다.",
} as const;

export const ROOM_ASSETS = {
  background: "/images/study-room/room-afternoon-v2.webp",
  backgroundAvif: "/images/study-room/room-afternoon-v2.avif",
  portrait: "/images/study-room/room-afternoon-portrait-v2.webp",
  portraitAvif: "/images/study-room/room-afternoon-portrait-v2.avif",
  preview: "/images/study-room/room-preview-desktop.webp",
  portraitPreview: "/images/study-room/room-preview-portrait.webp",
  character: "/images/study-room/character-poses-v2.webp",
  width: 1600,
  height: 1000,
  spritePanelSize: 724,
} as const;

export const ROOM_TIMING = {
  introMs: 2600,
  typingMinMs: 14000,
  typingMaxMs: 22000,
  idleMs: 3200,
  prepareMs: 650,
  returnMs: 900,
  poseBlendMs: 220,
  thinkingMs: 6200,
  stretchingMs: 6800,
} as const;

export const INTRO_SESSION_KEY = "study-room:entered:v1";
export type CharacterState = "idle" | "typing" | "stretching" | "drinking" | "thinking";
export type CharacterPhase = "working" | "preparing" | "holding" | "returning";
export type CharacterAnimation = { state: CharacterState; phase: CharacterPhase };

/** Stable artwork IDs; interactive targets live in interactions.ts. */
export const ROOM_OBJECTS = {
  monitor: "room-monitor",
  books: "room-books",
  character: "room-character",
  notebook: "room-notebook",
  mug: "room-mug",
} as const;

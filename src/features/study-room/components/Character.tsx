import { ROOM_ASSETS, ROOM_OBJECTS, type CharacterAnimation } from "../config";
import styles from "../StudyRoom.module.css";

// Foreground chair and lower body remain on the same pixels in every pose.
const CHAIR_FRONT = "M192 305Q192 294 213 295L353 299Q376 301 384 323L419 451Q430 480 401 496L309 517Q250 524 226 492Q201 452 192 323Z";
const HANDS = "M487 287H610V356H489Z";
const POSE_OFFSETS = { typing: 0, thinking: 700, stretching: 1431 } as const;

/** Only the upper body and wrists animate; chair, legs and contact shadows stay fixed. */
export default function Character({ animation, variant }: { animation: CharacterAnimation; variant: "desktop" | "portrait" }) {
  const prefix = `sr-${variant}`;
  const panel = ROOM_ASSETS.spritePanelSize;
  const sprite = (offset = 0, mask?: string) => (
    <image href={ROOM_ASSETS.character} x={-offset} width={panel * 3} height={panel} mask={mask ? `url(#${prefix}-${mask})` : undefined}/>
  );
  return (
    <g id={`${ROOM_OBJECTS.character}-${variant}`} data-room-object="character" data-character-state={animation.state} data-character-phase={animation.phase} className={styles.character}>
      <g data-character-part="contact-shadows">
        <ellipse cx="927" cy="828" rx="180" ry="28" fill={`url(#${prefix}-chair-shadow)`}/>
        <ellipse cx="1041" cy="766" rx="42" ry="12" fill={`url(#${prefix}-chair-shadow)`}/>
        <ellipse cx="1112" cy="784" rx="46" ry="13" fill={`url(#${prefix}-chair-shadow)`}/>
      </g>
      <svg x="610" y="245" width="610" height="610" viewBox={`0 0 ${panel} ${panel}`} overflow="hidden">
        <defs>
          <clipPath id={`${prefix}-typing-hands`}><path d={HANDS}/></clipPath>
          <mask id={`${prefix}-rest-of-character`} maskUnits="userSpaceOnUse" x="0" y="0" width={panel} height={panel}><rect width={panel} height={panel} fill="white"/><path d={HANDS} fill="black"/></mask>
          <mask id={`${prefix}-upper-body`} maskUnits="userSpaceOnUse" x="0" y="0" width={panel} height={panel}><rect width={panel} height="428" fill="white"/><path d={CHAIR_FRONT} fill="black"/></mask>
          <mask id={`${prefix}-seated-base`} maskUnits="userSpaceOnUse" x="0" y="0" width={panel} height={panel}><rect y="425" width={panel} height={panel - 425} fill="white"/><path d={CHAIR_FRONT} fill="white"/></mask>
        </defs>
        <g className={styles.characterUpper} data-character-part="upper-body" mask={`url(#${prefix}-upper-body)`}>
          <g className={`${styles.pose} ${styles.poseTyping}`}>
            {sprite(POSE_OFFSETS.typing, "rest-of-character")}
            <g className={styles.typingHands} data-character-part="wrists" clipPath={`url(#${prefix}-typing-hands)`}>{sprite()}</g>
          </g>
          <g className={`${styles.pose} ${styles.poseThinking}`}>{sprite(POSE_OFFSETS.thinking)}</g>
          <g className={`${styles.pose} ${styles.poseStretching}`}>{sprite(POSE_OFFSETS.stretching)}</g>
        </g>
        <g data-character-part="seated-base">{sprite(0, "seated-base")}</g>
        <rect data-character-part="seat-anchor" x="260" y="350" width="70" height="70" fill="transparent" pointerEvents="none"/>
        <rect data-character-part="head-bounds" x="287" y="40" width="200" height="205" fill="transparent" pointerEvents="none"/>
      </svg>
    </g>
  );
}

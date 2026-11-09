import type { CharacterAnimation } from "../config";
import RoomArtwork from "./RoomArtwork";
import styles from "../StudyRoom.module.css";
import RoomInteractions from "./RoomInteractions";
import type { RoomNoteContent } from "../interactions";
import { useRoomObjects } from "../hooks/useRoomObjects";

export default function StudyRoomScene({ animation, entering, onReady, interactive, content, onRest, showHints }: { animation: CharacterAnimation; entering: boolean; onReady: () => void; interactive: boolean; content: RoomNoteContent; onRest: () => void; showHints: boolean }) {
  const { objects, interact } = useRoomObjects(content.projects.length, onRest);
  const preview = content.projects[objects.screen];
  return (
    <div className={styles.scene} data-scene={entering ? "entering" : "living"} data-typing-burst={objects.typing} data-lamp-on={objects.lampOn}>
      <div className={styles.camera}>
        <RoomArtwork animation={animation} onReady={onReady} objects={objects} preview={preview}/>
        <RoomInteractions enabled={interactive} content={content} objects={objects} onAction={interact} showHints={showHints}/>
        <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{preview ? `모니터: ${preview.title}` : ""}</span>
      </div>
      <div className={styles.sceneShade} aria-hidden="true" />
    </div>
  );
}

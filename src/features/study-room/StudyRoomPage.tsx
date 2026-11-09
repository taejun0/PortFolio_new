"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { ROOM_TIMING } from "./config";
import { useRoomMotion } from "./hooks/useRoomMotion";
import { useRoomIntro } from "./hooks/useRoomIntro";
import { useCharacterAnimation } from "./hooks/useCharacterAnimation";
import IntroScene from "./components/IntroScene";
import StudyRoomScene from "./components/StudyRoomScene";
import styles from "./StudyRoom.module.css";
import type { RoomNoteContent } from "./interactions";

export default function StudyRoomPage({ content }: { content: RoomNoteContent }) {
  const { reduced, hidden, limited } = useRoomMotion();
  const [paused, setPaused] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [artReady, setArtReady] = useState(false);
  const [restRequest, setRestRequest] = useState(0);
  const onRest = useCallback(() => setRestRequest(value => value + 1), []);
  const onArtReady = useCallback(() => setArtReady(true), []);
  const { entering, finish } = useRoomIntro(reduced, hidden || paused || !artReady);
  const active = !reduced && !hidden && !paused;
  const characterAnimation = useCharacterAnimation(active && !entering && artReady, restRequest);
  const motion = !active ? "paused" : limited ? "limited" : "full";

  return (
    <main id="main" tabIndex={-1} className={styles.page} data-study-page="" data-motion={motion} data-art-ready={artReady} style={{
      "--room-intro-duration": `${ROOM_TIMING.introMs}ms`,
      "--character-prepare-duration": `${ROOM_TIMING.prepareMs}ms`,
      "--character-return-duration": `${ROOM_TIMING.returnMs}ms`,
      "--character-blend-duration": `${ROOM_TIMING.poseBlendMs}ms`,
    } as CSSProperties}>
      <h1 className={styles.srOnly}>작업실</h1>
      <section className={styles.room} aria-label="햇살이 들어오는 작은 작업실">
        <StudyRoomScene animation={characterAnimation} entering={entering} onReady={onArtReady} interactive={artReady && !entering} content={content} onRest={onRest} showHints={showHints}/>
        {entering && <IntroScene onSkip={finish} />}
      </section>
      <div className={styles.controls}>
        <button className={styles.hintsButton} onClick={() => setShowHints(value => !value)} aria-pressed={showHints} aria-label="클릭 가능한 사물 표시" aria-controls="room-interactions" disabled={!artReady || entering}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="4.5" stroke="currentColor"/><path d="M8 1v3m0 8v3M1 8h3m8 0h3" stroke="currentColor" strokeLinecap="round"/><circle cx="8" cy="8" r="1" fill="currentColor"/></svg>
          <span>클릭 표시</span>
        </button>
        {reduced ? <span className={styles.srOnly}>모션 감소 설정 적용 중</span> : (
          <button className={styles.pauseButton} onClick={() => setPaused(value => !value)} aria-pressed={paused}>
            <svg width="15" height="15" viewBox="0 0 12 12" fill="none" aria-hidden="true">{paused ? <path d="m4 2 6 4-6 4V2Z" fill="currentColor"/> : <path d="M4 2v8m4-8v8" stroke="currentColor" strokeWidth="1.5"/>}</svg>
            <span className={styles.srOnly}>{paused ? "움직임 재생" : "움직임 잠시 멈추기"}</span>
          </button>
        )}
      </div>
    </main>
  );
}

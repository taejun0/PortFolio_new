import styles from "../StudyRoom.module.css";

export default function IntroScene({ onSkip }: { onSkip: () => void }) {
  return (
    <div className={styles.introControls}>
      <button className={styles.skipButton} onClick={onSkip}>인트로 건너뛰기 <span aria-hidden="true">↗</span></button>
    </div>
  );
}

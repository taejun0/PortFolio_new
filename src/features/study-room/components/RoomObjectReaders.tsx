import Image from "next/image";
import { useState } from "react";
import { ROOM_ASSETS } from "../config";
import type { RoomNoteContent, RoomView } from "../interactions";
import styles from "../StudyRoom.module.css";

export function TimelineReader({ content }: { content: RoomNoteContent }) {
  return <ol className={styles.experienceTimeline}>{content.profile.experiences.map(item => (
    <li key={`${item.period}-${item.title}`}>
      <time>{item.period}</time><h3>{item.title}</h3>
      <ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
    </li>
  ))}</ol>;
}

export function ToolsReader({ content }: { content: RoomNoteContent }) {
  return <div className={styles.toolsReading}>{content.tools.map(group => (
    <section key={group.title}>
      <h3>{group.title}</h3>
      <ul>{group.items.map(item => <li key={item.name}>
        <span className={styles.toolIcon}>{item.image
          ? <Image src={item.image} alt="" width={36} height={36} unoptimized/>
          : <span style={{ background: item.markColor }}>{item.mark}</span>}</span>
        <span>{item.name}</span>
      </li>)}</ul>
    </section>
  ))}</div>;
}

export function PhotoReader({ content }: { content: RoomNoteContent }) {
  const [index, setIndex] = useState(0);
  return <div className={styles.photoReading}>
    <div className={styles.photoMount}>
      <Image key={index} src={content.photos[index]} alt={`${content.profile.name} 사진 ${index + 1}`} width={600} height={600} sizes="(max-width: 640px) calc(100vw - 100px), 560px"/>
    </div>
    <div className={styles.photoNavigation}>
      <button onClick={() => setIndex(value => (value - 1 + content.photos.length) % content.photos.length)} aria-label="이전 사진">←</button>
      <span aria-live="polite">{index + 1} / {content.photos.length}</span>
      <button onClick={() => setIndex(value => (value + 1) % content.photos.length)} aria-label="다음 사진">→</button>
    </div>
  </div>;
}

/** Inspect the actual picture on the wall, using the same painting and crop. */
export function ArtReader({ view }: { view: RoomView }) {
  const portrait = view === "portrait";
  const crop = portrait ? { x: 771, y: 363, width: 162, height: 242, sourceWidth: 1000, sourceHeight: 1600 }
    : { x: 1296, y: 27, width: 193, height: 259, sourceWidth: 1600, sourceHeight: 1000 };
  return <div className={styles.artReading}>
    <div className={styles.artCrop} style={{ aspectRatio: `${crop.width} / ${crop.height}` }}>
      <picture>
        <source type="image/avif" srcSet={portrait ? ROOM_ASSETS.portraitAvif : ROOM_ASSETS.backgroundAvif}/>
        {/* This crop must retain the exact background texture and framing. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={portrait ? ROOM_ASSETS.portrait : ROOM_ASSETS.background} alt="벽에 걸린 식물 그림" style={{
          width: `${crop.sourceWidth / crop.width * 100}%`, height: `${crop.sourceHeight / crop.height * 100}%`,
          left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%`,
        }}/>
      </picture>
    </div>
  </div>;
}

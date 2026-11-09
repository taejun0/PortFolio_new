import { ROOM_NOTE_LABELS, type RoomNoteContent, type RoomNoteId, type RoomView } from "../interactions";
import { BlogReader, ProfileReader, ProjectReader } from "./RoomReaders";
import { ArtReader, PhotoReader, TimelineReader, ToolsReader } from "./RoomObjectReaders";
import styles from "../StudyRoom.module.css";

export default function RoomNote({ note, view, content, entry, onSelect, onBack, onClose }: {
  note: RoomNoteId; view: RoomView; content: RoomNoteContent; entry: string | null;
  onSelect: (id: string) => void; onBack: () => void; onClose: () => void;
}) {
  return (
    <>
      {note === "about" && <span className={styles.noteTape} aria-hidden="true"/>}
      <div className={styles.noteHeader}>
        <div className={styles.readerNavigation}>
          {entry && <button className={styles.readerBack} onClick={onBack} aria-label={`${ROOM_NOTE_LABELS[note]} 목록으로`}><span aria-hidden="true">←</span> 목록</button>}
          <h2 id="room-note-title">{ROOM_NOTE_LABELS[note]}</h2>
        </div>
        <button className={styles.noteClose} onClick={onClose} aria-label={`${ROOM_NOTE_LABELS[note]} 닫기`}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className={styles.readerBody} data-room-reader-body="" key={entry ?? "index"} tabIndex={0} aria-label={`${ROOM_NOTE_LABELS[note]} 내용`}>
        {note === "about" && <ProfileReader content={content}/>}
        {note === "projects" && <ProjectReader content={content} entry={entry} onSelect={onSelect}/>}
        {note === "blog" && <BlogReader content={content} entry={entry} onSelect={onSelect}/>}
        {note === "timeline" && <TimelineReader content={content}/>}
        {note === "photos" && <PhotoReader content={content}/>}
        {note === "art" && <ArtReader view={view}/>}
        {note === "tools" && <ToolsReader content={content}/>}
      </div>
    </>
  );
}

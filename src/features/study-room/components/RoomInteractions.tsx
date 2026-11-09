"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ROOM_SPOTS, type RoomAction, type RoomNoteContent, type RoomNoteId, type RoomObjectState, type RoomView } from "../interactions";
import RoomNote from "./RoomNote";
import styles from "../StudyRoom.module.css";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
const READER_SIZES: Record<RoomNoteId, { width: number; height: number }> = {
  about: { width: 460, height: 660 }, projects: { width: 760, height: 660 },
  blog: { width: 760, height: 720 }, timeline: { width: 580, height: 680 },
  photos: { width: 540, height: 640 }, art: { width: 440, height: 600 },
  tools: { width: 600, height: 660 },
};

/** Source polygons define both the cursor shape and the outline; cropping never stretches them. */
export default function RoomInteractions({ enabled, content, objects, onAction, showHints }: {
  enabled: boolean; content: RoomNoteContent; objects: RoomObjectState; onAction: (action: RoomAction) => void; showHints: boolean;
}) {
  const layer = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const indexScroll = useRef(0);
  const lastEntry = useRef<string | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const [entry, setEntry] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  useLayoutEffect(() => {
    const element = layer.current;
    if (!element) return;
    const measure = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      setViewport(previous => previous.width === width && previous.height === height ? previous : { width, height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const close = useCallback((restoreFocus = false) => {
    setSelected(null);
    setEntry(null);
    indexScroll.current = 0;
    lastEntry.current = null;
    if (restoreFocus && trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const pointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || paper.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-room-hotspot]")) return;
      close();
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      if (entry) setEntry(null);
      else close(true);
    };
    document.addEventListener("pointerdown", pointerDown);
    document.addEventListener("keydown", keyDown);
    return () => {
      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("keydown", keyDown);
    };
  }, [selected, entry, close]);

  useLayoutEffect(() => {
    const body = paper.current?.querySelector<HTMLElement>("[data-room-reader-body]");
    if (!body) return;
    body.scrollTop = entry ? 0 : indexScroll.current;
    const previous = !entry && lastEntry.current
      ? [...body.querySelectorAll<HTMLButtonElement>("[data-room-open-entry]")].find(button => button.dataset.roomOpenEntry === lastEntry.current)
      : null;
    (previous ?? (entry ? body : paper.current))?.focus({ preventScroll: true });
  }, [selected, entry]);

  const { width, height } = viewport;
  const view: RoomView = width / height <= 4 / 3 ? "portrait" : "desktop";
  const source = view === "portrait" ? { width: 1000, height: 1600 } : { width: 1600, height: 1000 };
  const scale = Math.max(width / source.width, height / source.height);
  const offsetX = (width - source.width * scale) / 2;
  const offsetY = (height - source.height * scale) / 2;
  const spots = ROOM_SPOTS.map(spot => {
    const points = spot.points[view].map(([x, y]) => [x * scale + offsetX, y * scale + offsetY] as const);
    const minX = Math.min(...points.map(([x]) => x));
    const maxX = Math.max(...points.map(([x]) => x));
    const minY = Math.min(...points.map(([, y]) => y));
    const maxY = Math.max(...points.map(([, y]) => y));
    const targetWidth = Math.max(44, maxX - minX);
    const targetHeight = Math.max(44, maxY - minY);
    const x = Math.max(0, (minX + maxX - targetWidth) / 2);
    const y = Math.max(0, (minY + maxY - targetHeight) / 2);
    const right = Math.min(width, (minX + maxX + targetWidth) / 2);
    const bottom = Math.min(height, (minY + maxY + targetHeight) / 2);
    const area = { x, y, width: right - x, height: bottom - y };
    const local = points.map(([px, py]) => [px - x, py - y]);
    const clip = local.map(([px, py]) => `${px / area.width * 100}% ${py / area.height * 100}%`).join(", ");
    // A 44px circle pads the object without the rectangular corners stealing nearby taps.
    // Match the polygon's winding so the circle and physical shape form a union.
    const winding = local.reduce((sum, [px, py], index) => {
      const [nx, ny] = local[(index + 1) % local.length];
      return sum + px * ny - nx * py;
    }, 0) >= 0 ? 1 : 0;
    const cx = area.width / 2;
    const cy = area.height / 2;
    const touchClip = `path("M${local.map(point => point.join(" ")).join("L")}Z M${cx + 22} ${cy}a22 22 0 1 ${winding} -44 0a22 22 0 1 ${winding} 44 0Z")`;
    const paintedWidth = Math.min(width, maxX) - Math.max(0, minX);
    const paintedHeight = Math.min(height, maxY) - Math.max(0, minY);
    const hint = spot.action === "lamp" && objects.lampOn ? "조명 끄기" : spot.hint;
    return { ...spot, hint, area, visible: paintedWidth > 12 && paintedHeight > 12, outline: local.map(point => point.join(",")).join(" "), clip, touchClip };
  });
  const active = spots.find(spot => spot.key === selected && spot.note);
  const activeNote = active?.note;
  const preferredSize = activeNote ? READER_SIZES[activeNote] : READER_SIZES.about;
  const margin = width <= 640 ? 16 : 24;
  const noteWidth = Math.min(preferredSize.width, width - margin * 2);
  const noteHeight = Math.min(preferredSize.height, Math.max(220, height - (width <= 640 ? 112 : 80)));
  const anchor = active?.area;
  const noteLeft = anchor ? clamp(anchor.x + anchor.width / 2 - noteWidth / 2, margin, width - noteWidth - margin) : margin;
  const noteTop = anchor ? clamp(anchor.y + anchor.height / 2 - noteHeight * .4, 32, height - noteHeight - 32) : 32;
  const pointed = !active ? spots.find(spot => spot.visible && spot.key === (hovered ?? focused)) : undefined;
  const hintLeft = pointed ? clamp(pointed.area.x + pointed.area.width / 2, 92, width - 92) : 0;
  const hintTop = pointed ? clamp(pointed.area.y + pointed.area.height / 2 + 22, 16, height - 58) : 0;

  return (
    <div ref={layer} id="room-interactions" className={styles.interactions} data-room-interactions="" data-hints={showHints} data-reader-open={Boolean(active)} inert={!enabled}>
      <div className={styles.readerVeil} data-open={Boolean(active)} data-compact={activeNote === "art" || activeNote === "photos"} aria-hidden="true"/>
      {enabled && width > 0 && spots.filter(spot => spot.visible).map(spot => {
        const pressed = spot.action === "lamp" ? objects.lampOn : undefined;
        const label = spot.action === "lamp" && objects.lampOn ? "스탠드 끄기" : spot.label;
        return (
        <Fragment key={spot.key}>
        <button
          type="button"
          data-room-hotspot={spot.key}
          data-note={spot.note}
          data-selected={active?.key === spot.key}
          data-primary={Boolean(spot.primary)}
          className={styles.hotspot}
          aria-label={label}
          aria-haspopup={spot.note ? "dialog" : undefined}
          aria-expanded={spot.note ? active?.key === spot.key : undefined}
          aria-pressed={pressed}
          aria-controls={spot.note && active?.key === spot.key ? "room-note" : undefined}
          aria-describedby={pointed?.key === spot.key ? "room-object-hint" : undefined}
          onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(spot.key); }}
          onPointerLeave={() => setHovered(null)}
          onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setFocused(spot.key); }}
          onBlur={() => setFocused(null)}
          style={{ left: spot.area.x, top: spot.area.y, width: spot.area.width, height: spot.area.height, "--object-clip": `polygon(${spot.clip})`, "--touch-clip": spot.touchClip } as CSSProperties}
          onClick={event => {
            if (spot.action) {
              close();
              onAction(spot.action);
              return;
            }
            trigger.current = event.currentTarget;
            indexScroll.current = 0;
            lastEntry.current = null;
            setEntry(spot.note === "projects" ? content.projects[objects.screen]?.id ?? null : null);
            setSelected(previous => previous === spot.key ? null : spot.key);
          }}
        >
          <svg className={styles.objectContour} viewBox={`0 0 ${spot.area.width} ${spot.area.height}`} aria-hidden="true">
            <polygon points={spot.outline} vectorEffect="non-scaling-stroke"/>
          </svg>
        </button>
        {showHints && !active && <span className={styles.objectMarker} data-room-marker={spot.key} data-primary={Boolean(spot.primary)} data-pointed={pointed?.key === spot.key} style={{ left: spot.area.x + spot.area.width / 2, top: spot.area.y + spot.area.height / 2 }} aria-hidden="true">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </span>}
        </Fragment>
      );})}
      {enabled && pointed && <span id="room-object-hint" role="tooltip" className={styles.objectHint} style={{ left: hintLeft, top: hintTop }}>
        {pointed.hint}
      </span>}
      {enabled && active && activeNote && (
        <div
          ref={paper}
          key={active.key}
          id="room-note"
          role="dialog"
          aria-labelledby="room-note-title"
          tabIndex={-1}
          className={styles.roomNote}
          data-room-note={active.note}
          style={{ left: noteLeft, top: noteTop, width: noteWidth, height: noteHeight }}
        >
          <RoomNote note={activeNote} view={view} content={content} entry={entry} onSelect={id => {
            indexScroll.current = paper.current?.querySelector<HTMLElement>("[data-room-reader-body]")?.scrollTop ?? 0;
            lastEntry.current = id;
            setEntry(id);
          }} onBack={() => setEntry(null)} onClose={() => close(true)}/>
        </div>
      )}
    </div>
  );
}

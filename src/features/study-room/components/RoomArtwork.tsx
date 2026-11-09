import { useEffect, useRef, useState } from "react";
import { ROOM_ASSETS, ROOM_COPY, type CharacterAnimation } from "../config";
import EnvironmentLayers from "./EnvironmentLayers";
import Character from "./Character";
import styles from "../StudyRoom.module.css";
import type { RoomObjectState, RoomProject } from "../interactions";

function SceneDefinitions({ variant }: { variant: "desktop" | "portrait" }) {
  return (
    <defs>
      <radialGradient id={`sr-${variant}-chair-shadow`}><stop stopColor="#31291d" stopOpacity=".3"/><stop offset="1" stopColor="#31291d" stopOpacity="0"/></radialGradient>
      <linearGradient id={`sr-${variant}-daylight`} x1="150" y1="200" x2="1100" y2="1000" gradientUnits="userSpaceOnUse"><stop stopColor="#ffe3a0" stopOpacity=".055"/><stop offset="1" stopColor="#ffe3a0" stopOpacity="0"/></linearGradient>
      <radialGradient id={`sr-${variant}-lamp-pool`}><stop stopColor="#ffdb87" stopOpacity=".45"/><stop offset=".45" stopColor="#ffd886" stopOpacity=".2"/><stop offset="1" stopColor="#ffd886" stopOpacity="0"/></radialGradient>
      <linearGradient id={`sr-${variant}-lamp-beam`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe5a4" stopOpacity=".17"/><stop offset="1" stopColor="#ffda82" stopOpacity="0"/></linearGradient>
    </defs>
  );
}

/** Picture chooses one background; the matching SVG registers the animated layers. */
export default function RoomArtwork({ animation, onReady, objects, preview }: {
  animation: CharacterAnimation; onReady: () => void; objects: RoomObjectState; preview?: RoomProject;
}) {
  const background = useRef<HTMLImageElement>(null);
  const [backgroundSrc, setBackgroundSrc] = useState("");
  useEffect(() => {
    let cancelled = false;
    const character = new Image();
    character.src = ROOM_ASSETS.character;
    const images = [background.current?.decode(), character.decode()];
    // Cached SVG images may load before hydration, so explicitly await decoded assets.
    Promise.allSettled(images).then(() => {
      if (cancelled) return;
      // Cached SSR images can finish loading before React attaches onLoad.
      setBackgroundSrc(background.current?.currentSrc ?? "");
      onReady();
    });
    return () => { cancelled = true; };
  }, [onReady]);

  return (
    <div className={styles.artwork} role="img" aria-label={ROOM_COPY.illustration}>
      <picture className={styles.background} aria-hidden="true">
        <source media="(max-aspect-ratio: 4/3)" srcSet={ROOM_ASSETS.portraitPreview}/>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ROOM_ASSETS.preview} alt="" fetchPriority="high" decoding="async"/>
      </picture>
      <picture className={styles.background} data-room-background="" aria-hidden="true">
        <source type="image/avif" media="(max-aspect-ratio: 4/3)" srcSet={ROOM_ASSETS.portraitAvif}/>
        <source media="(max-aspect-ratio: 4/3)" srcSet={ROOM_ASSETS.portrait}/>
        <source type="image/avif" srcSet={ROOM_ASSETS.backgroundAvif}/>
        {/* Optimized AVIF/WebP; picture selects a separately composed portrait. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={background} src={ROOM_ASSETS.background} alt="" fetchPriority="high" decoding="async" onLoad={event => setBackgroundSrc(event.currentTarget.currentSrc)}/>
      </picture>
      <svg className={`${styles.layerCanvas} ${styles.desktopArt}`} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
        <SceneDefinitions variant="desktop"/>
        <EnvironmentLayers layer="back" variant="desktop" objects={objects} backgroundSrc={backgroundSrc} preview={preview}/>
        <Character animation={animation} variant="desktop"/>
        <EnvironmentLayers layer="front" variant="desktop" objects={objects} backgroundSrc={backgroundSrc}/>
      </svg>
      <svg className={`${styles.layerCanvas} ${styles.portraitArt}`} viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
        <SceneDefinitions variant="portrait"/>
        <EnvironmentLayers layer="back" variant="portrait" objects={objects} backgroundSrc={backgroundSrc} preview={preview}/>
        <g transform="translate(-500 300)"><Character animation={animation} variant="portrait"/></g>
        <EnvironmentLayers layer="front" variant="portrait" objects={objects} backgroundSrc={backgroundSrc}/>
      </svg>
    </div>
  );
}

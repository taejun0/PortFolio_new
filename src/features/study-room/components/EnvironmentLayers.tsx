import { getImageProps } from "next/image";
import { ROOM_OBJECTS } from "../config";
import type { RoomObjectState, RoomProject, RoomView } from "../interactions";
import styles from "../StudyRoom.module.css";

/** Small cutouts reuse the painting so a touched object keeps its original texture. */
export default function EnvironmentLayers({ layer, variant, objects, backgroundSrc, preview }: {
  layer: "back" | "front"; variant: RoomView; objects: RoomObjectState; backgroundSrc: string; preview?: RoomProject;
}) {
  const portrait = variant === "portrait";
  const width = portrait ? 1000 : 1600;
  const height = portrait ? 1600 : 1000;
  const screen = portrait ? "m626 644 188-4-3 123-190-9z" : "m1006 315 230-4-4 136-228-10z";
  const steam = portrait ? "M912 802q-7-10 0-22m9 22q6-11 0-19" : "M1405 478q-7-10 0-22m9 22q6-11 0-19";
  if (layer === "back") {
    const screenImage = preview ? getImageProps({ src: preview.image, alt: "", width: 480, height: 270 }).props.src : undefined;
    return <g data-layer="environment" pointerEvents="none">
      <defs>
        <clipPath id={`sr-${variant}-screen-clip`}><path d={screen}/></clipPath>
      </defs>
      <path className={styles.sunlight} d={portrait ? "M110 340 410 350 1000 1600H270Z" : "M180 140 602 180 1450 1000H395Z"} fill={`url(#sr-${variant}-daylight)`}/>
      <g className={styles.lampLight} data-on={objects.lampOn}>
        <ellipse cx={portrait ? 755 : 1300} cy={portrait ? 859 : 553} rx={portrait ? 220 : 295} ry={portrait ? 74 : 92} fill={`url(#sr-${variant}-lamp-pool)`}/>
        <path d={portrait ? "M844 658 890 678 945 876 650 848Z" : "M1357 320 1431 347 1465 576 1140 558Z"} fill={`url(#sr-${variant}-lamp-beam)`}/>
        <path d={portrait ? "m837 654 54 23" : "m1356 319 74 26"} stroke="#ffe6a3" strokeWidth="3" strokeLinecap="round"/>
      </g>
      <g id={`${ROOM_OBJECTS.monitor}-${variant}`} data-room-object="monitor">
        <path className={styles.monitorGlow} d={screen} fill="#a4c4c0"/>
        {screenImage ? <image data-screen-preview={preview?.id} href={screenImage} x={portrait ? 621 : 1003} y={portrait ? 640 : 310} width={portrait ? 196 : 235} height={portrait ? 125 : 140} preserveAspectRatio="xMidYMid meet" clipPath={`url(#sr-${variant}-screen-clip)`} className={styles.screenPreview}/>
          : <path className={styles.screenCursor} d={portrait ? "M651 746v5" : "M1056 422v5"} stroke="#c0d1be" strokeWidth="1.4"/>}
        {objects.typing && <g key={objects.typingTick} className={styles.typingFeedback} clipPath={`url(#sr-${variant}-screen-clip)`}>
          <path d={screen} fill="#a6d7c5" opacity=".07"/>
          <path d={portrait ? "M650 690h48m-42 6h72m-68 6h34m-38 6h54m-50 6h83" : "M1040 358h48m-42 6h72m-68 6h34m-38 6h54m-50 6h83"} stroke="#b6d4bb" strokeWidth="1.5" strokeLinecap="round" opacity=".65"/>
        </g>}
      </g>
      <g id={`${ROOM_OBJECTS.books}-${variant}`} data-room-object="books"/>
      <g id={`${ROOM_OBJECTS.notebook}-${variant}`} data-room-object="notebook"/>
    </g>;
  }
  return <g data-layer="foreground" pointerEvents="none">
    <g id={`${ROOM_OBJECTS.mug}-${variant}`} data-room-object="mug">
      <path className={styles.coffeeSteam} d={steam} stroke="#e5decd" strokeOpacity=".35" strokeWidth="1.5" strokeLinecap="round"/>
      {objects.coffeeTick > 0 && <g key={objects.coffeeTick} className={styles.coffeePuff} data-coffee-response={objects.coffeeTick}>
        <path d={steam} stroke="#fff1d1" strokeWidth="2.5" strokeLinecap="round"/>
        <ellipse cx={portrait ? 916 : 1411} cy={portrait ? 810 : 489} rx="17" ry="4" fill="none" stroke="#fae9b7" strokeWidth="1"/>
      </g>}
    </g>
    {objects.leafTick > 0 && backgroundSrc && <g key={objects.leafTick} className={styles.leafBrush} style={{ transformOrigin: portrait ? "90px 1480px" : "100px 990px" }} data-leaf-response={objects.leafTick}>
      <defs><clipPath id={`sr-${variant}-leaf-clip`}><path d={portrait
        ? "M39 1182Q120 1105 181 1202Q232 1242 207 1342L177 1328Q197 1413 145 1471L86 1445 38 1330Z"
        : "M61 735Q121 666 204 695Q290 708 330 792L310 833 270 813Q291 874 237 919L185 906 158 958 95 920 63 813Z"}/></clipPath></defs>
      <image href={backgroundSrc} width={width} height={height} preserveAspectRatio="none" clipPath={`url(#sr-${variant}-leaf-clip)`}/>
    </g>}
  </g>;
}

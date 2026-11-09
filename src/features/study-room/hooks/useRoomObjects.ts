import { useCallback, useEffect, useRef, useState } from "react";
import type { RoomAction, RoomObjectState } from "../interactions";

export function useRoomObjects(projectCount: number, onRest: () => void) {
  const [objects, setObjects] = useState<RoomObjectState>({
    lampOn: false, coffeeTick: 0, leafTick: 0,
    typing: false, typingTick: 0, screen: -1,
  });
  const typingTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(typingTimer.current), []);

  const interact = useCallback((action: RoomAction) => {
    if (action === "coffee") onRest();
    if (action === "typing") {
      window.clearTimeout(typingTimer.current);
      typingTimer.current = window.setTimeout(() => setObjects(value => ({ ...value, typing: false })), 2600);
    }
    setObjects(value => {
      switch (action) {
        case "lamp": return { ...value, lampOn: !value.lampOn };
        case "coffee": return { ...value, coffeeTick: value.coffeeTick + 1 };
        case "leaves": return { ...value, leafTick: value.leafTick + 1 };
        case "typing": return { ...value, typing: true, typingTick: value.typingTick + 1, screen: -1 };
        case "screen": return { ...value, screen: value.screen + 1 >= projectCount ? -1 : value.screen + 1 };
      }
    });
  }, [projectCount, onRest]);
  return { objects, interact };
}

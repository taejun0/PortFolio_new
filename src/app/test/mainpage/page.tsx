import type { Metadata } from "next";
import StudyRoomPage from "@/features/study-room/StudyRoomPage";
import { getRoomNoteContent } from "@/features/study-room/data";

export const metadata: Metadata = {
  title: { absolute: "작업실" },
  description: "책상 앞에서 공부하는 사람이 있는 작은 작업실.",
  robots: { index: false, follow: false },
};

export default async function Page() {
  return <StudyRoomPage content={await getRoomNoteContent()} />;
}

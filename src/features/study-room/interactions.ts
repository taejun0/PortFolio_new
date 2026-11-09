export type RoomNoteId = "about" | "projects" | "blog" | "timeline" | "photos" | "art" | "tools";
export type RoomAction = "lamp" | "coffee" | "leaves" | "typing" | "screen";
export type RoomObjectState = {
  lampOn: boolean; coffeeTick: number; leafTick: number;
  typing: boolean; typingTick: number; screen: number;
};
export type RoomView = "desktop" | "portrait";
export type RoomBounds = { x: number; y: number; width: number; height: number };
export type RoomPoint = readonly [number, number];

export type RoomProject = {
  id: string; title: string; summary: string; image: string; period: string; role: string;
  tags: string[]; overview: string; roles: string[]; decisions: string[]; github?: string;
};
export type RoomPost = { id: string; title: string; date: string; description: string; html: string };
export type RoomNoteContent = {
  profile: {
    name: string; role: string; education: string; image: string; email: string; github: string;
    paragraphs: string[]; experiences: { period: string; title: string; points: string[] }[];
  };
  projects: RoomProject[];
  posts: RoomPost[];
  photos: string[];
  tools: { title: string; items: { name: string; image?: string; mark?: string; markColor?: string }[] }[];
};

type RoomSpot = {
  key: string;
  label: string;
  hint: string;
  primary?: boolean;
  points: Record<RoomView, readonly RoomPoint[]>;
} & ({ note: RoomNoteId; action?: never } | { action: RoomAction; note?: never });

export const ROOM_NOTE_LABELS: Record<RoomNoteId, string> = {
  about: "소개", projects: "프로젝트", blog: "기록",
  timeline: "경험", photos: "사진", art: "액자", tools: "사용하는 도구",
};

/** Absolute painting coordinates keep outlines accurate even when the object is cropped. */
export const ROOM_SPOTS: readonly RoomSpot[] = [
  {
    key: "books", note: "blog", label: "책장에서 기록 보기", hint: "기록 읽기",
    points: {
      desktop: [[650,182],[755,180],[759,288],[648,292]],
      portrait: [[445,330],[548,327],[551,425],[443,429]],
    },
  },
  {
    key: "wall-note", note: "about", label: "벽 메모에서 소개 보기", hint: "소개 보기",
    points: {
      desktop: [[895,212],[932,208],[935,275],[893,278]],
      portrait: [[684,553],[728,549],[732,625],[681,627]],
    },
  },
  {
    key: "monitor", note: "projects", label: "모니터에서 프로젝트 보기", hint: "프로젝트 보기", primary: true,
    points: {
      desktop: [[997,304],[1247,298],[1243,468],[991,454]],
      portrait: [[621,634],[820,630],[826,781],[612,772]],
    },
  },
  {
    key: "notebook", note: "blog", label: "공책에서 기록 보기", hint: "기록 읽기", primary: true,
    points: {
      desktop: [[1160,538],[1229,507],[1376,517],[1345,562],[1254,553],[1161,547]],
      portrait: [[751,855],[798,826],[939,843],[924,887],[808,879],[751,866]],
    },
  },
  {
    key: "person", note: "about", label: "책상 앞의 사람 소개 보기", hint: "소개 보기", primary: true,
    points: {
      desktop: [[884,302],[901,292],[929,289],[954,295],[978,309],[989,332],[984,353],[973,366],[972,389],[956,402],[938,403],[924,413],[904,398],[892,382],[881,363],[875,343],[877,319]],
      portrait: [[384,602],[401,592],[429,589],[454,595],[478,609],[489,632],[484,653],[473,666],[472,689],[456,702],[438,703],[424,713],[404,698],[392,682],[381,663],[375,643],[377,619]],
    },
  },
  {
    key: "lamp", action: "lamp", label: "스탠드 켜기", hint: "조명 켜기",
    points: {
      desktop: [[1345,299],[1391,251],[1420,238],[1441,267],[1442,307],[1431,347],[1357,320]],
      portrait: [[821,645],[849,608],[877,587],[898,599],[903,639],[894,680],[831,656]],
    },
  },
  {
    key: "mug", action: "coffee", label: "커피 잔을 누르고 잠깐 쉬기", hint: "잠깐 쉬기",
    points: {
      desktop: [[1384,482],[1414,480],[1441,487],[1454,499],[1448,525],[1430,537],[1423,550],[1392,548],[1385,532]],
      portrait: [[893,800],[925,797],[941,809],[954,811],[956,838],[939,849],[932,865],[900,861]],
    },
  },
  {
    key: "keyboard", action: "typing", label: "키보드 두드리기", hint: "타이핑하기",
    points: {
      desktop: [[980,477],[1117,477],[1151,493],[1126,515],[966,499]],
      portrait: [[598,794],[716,794],[751,813],[727,831],[578,816]],
    },
  },
  {
    key: "mouse", action: "screen", label: "마우스로 다음 프로젝트 미리 보기", hint: "다음 프로젝트",
    points: {
      desktop: [[1160,504],[1178,500],[1194,505],[1201,515],[1185,524],[1160,522]],
      portrait: [[752,819],[768,813],[784,818],[788,830],[773,838],[751,835]],
    },
  },
  {
    key: "desk-plant", note: "timeline", label: "책상 화분에서 경험 보기", hint: "경험 보기",
    points: {
      desktop: [[809,347],[851,331],[886,351],[908,385],[890,424],[888,472],[864,487],[815,472],[784,451],[791,399]],
      portrait: [[501,655],[542,641],[577,667],[590,711],[575,755],[578,786],[541,798],[495,779],[474,744],[487,692]],
    },
  },
  {
    key: "leaves", action: "leaves", label: "앞쪽 식물 잎 건드리기", hint: "잎 건드리기",
    points: {
      desktop: [[44,702],[121,671],[177,660],[237,689],[288,730],[342,797],[326,878],[286,920],[291,997],[52,997]],
      portrait: [[31,1147],[91,1130],[153,1157],[202,1203],[228,1273],[209,1353],[210,1477],[147,1596],[29,1596]],
    },
  },
  {
    key: "photo", note: "photos", label: "벽 사진 살펴보기", hint: "사진 보기",
    points: {
      desktop: [[981,235],[1020,232],[1025,284],[982,285]],
      portrait: [[659,442],[695,438],[698,509],[659,510]],
    },
  },
  {
    key: "frame", note: "art", label: "식물 액자 가까이 보기", hint: "액자 확대",
    points: {
      desktop: [[1296,49],[1482,29],[1486,278],[1298,284]],
      portrait: [[769,383],[930,361],[933,600],[768,603]],
    },
  },
  {
    key: "pencils", note: "tools", label: "연필꽂이에서 사용하는 도구 보기", hint: "도구 보기",
    points: {
      desktop: [[1348,401],[1381,398],[1388,454],[1379,500],[1342,500],[1338,451]],
      portrait: [[869,720],[894,719],[898,771],[891,819],[862,816],[859,767]],
    },
  },
  {
    key: "reference-books", note: "tools", label: "창가 책에서 기술 스택 보기", hint: "기술 스택 보기",
    points: {
      desktop: [[283,505],[448,500],[447,579],[297,598]],
      portrait: [[165,826],[279,802],[279,906],[170,930]],
    },
  },
];

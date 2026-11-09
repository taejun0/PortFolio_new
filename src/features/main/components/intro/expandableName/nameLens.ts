/**
 * 생성 이유: 히어로 네임의 인트로 웨이브(CSS)와 마우스·터치 렌즈(JS)가 같은 숫자·같은 모양을 쓰게 한다.
 * 역할: 쉬는 비율, 렌즈 반응값, 인트로 웨이브 일정과 세기 함수를 모은 렌즈 모델이다.
 * 책임: 상수와 순수 계산만 소유한다. 그리기는 ExpandableName(JS 렌즈)과 ExpandableName.styled(CSS 웨이브)가 맡는다.
 *
 * 인트로 웨이브 = 렌즈가 이름 위를 왼쪽에서 오른쪽으로 일정한 속도로 한 번 지나가는 것.
 * - 글자마다 "렌즈가 닿는 순간"을 지연으로, "지나가는 시간"을 길이로 갖는 같은 키프레임이라 CSS만으로 그린다.
 *   (SweepText의 일정 속도 스윕선과 같은 문법 — 위치에 비례한 지연, 같은 모양의 등장)
 * - 렌즈를 쥐면 JS가 같은 함수로 남은 웨이브를 이어 그려 끊김이 없다(waveAmount = 키프레임 모양).
 */
import { CURTAIN_START_S } from "@/components/common/motion/constants";
import { motionTokens } from "@/styles/theme";

/** 쉬는 상태 — 압축 디스플레이 페이스로 읽히는 비율 */
export const REST_SCALE_X = 0.56;
export const REST_SCALE_Y = 1;

/** 렌즈 중심 글자 — 가로가 주인공이고 세로·리프트는 살짝만(색은 바꾸지 않는다) */
export const LENS_SCALE_X = 1.08;
export const LENS_SCALE_Y = 1.05;
export const LENS_LIFT_EM = -0.04;

/** 인트로 웨이브 중심 글자 — 높이는 그대로 두고 가로로만 자연 폭까지 펴진다 */
export const WAVE_SCALE_X = 1;

/** 공백 슬롯 비율 — S.Space의 flex-grow로도 쓰여 슬롯 배치와 웨이브 일정이 같은 단위를 쓴다 */
export const SPACE_SLOT = 0.35;

/** 인트로 웨이브 렌즈 반경(슬롯) — 두세 글자가 함께 펴졌다 접힌다 */
export const WAVE_RADIUS_SLOTS = 1.8;
/** 웨이브 시작 — 첫 화면 커튼(라벨·소개 문장)과 같은 순간에 출발한다 */
export const WAVE_START_S = CURTAIN_START_S;
/** 렌즈가 첫 글자에 닿아 끝 글자를 떠날 때까지 — 큰 제목 토큰(1.4s 이하) */
export const WAVE_TOTAL_S = motionTokens.duration.title;

/** 3p² − 2p³ — CSS cubic-bezier(1/3, 0, 2/3, 1)과 같은 곡선이라 키프레임과 JS가 같은 값을 낸다 */
export const smoothstep = (p: number) => p * p * (3 - 2 * p);
export const SMOOTHSTEP_CURVE = "cubic-bezier(0.333, 0, 0.667, 1)";

/** 마우스·터치 렌즈 세기 — 근접도(0~1)를 부드럽게 올리고 가장자리를 조금 더 넓힌다 */
export const lensAmount = (proximity: number) =>
  Math.pow(smoothstep(proximity), 0.85);

/** 인트로 웨이브 세기 — 글자 하나의 진행도(0~1)에서 0 → 1(가운데) → 0. CSS 키프레임과 같은 모양이다. */
export const waveAmount = (progress: number) =>
  progress <= 0 || progress >= 1
    ? 0
    : smoothstep(1 - Math.abs(2 * progress - 1));

export type WaveSchedule = {
  /** 글자별 시작 지연(s) — 공백은 null */
  delays: Array<number | null>;
  /** 글자 하나가 펴졌다 접히는 길이(s) */
  duration: number;
  /** 마지막 글자가 쉬는 상태로 돌아오는 시점(s) */
  end: number;
};

/**
 * 렌즈가 첫 글자의 반경 바깥에서 끝 글자의 반경 바깥까지 일정한 속도로 지나간다고 보고
 * 글자마다 시작 지연을 정한다. 슬롯 단위라 화면 폭과 무관하고, 서버·클라이언트가 같은 값을 낸다.
 */
export const buildWaveSchedule = (chars: readonly string[]): WaveSchedule => {
  let cursor = 0;
  const centers = chars.map((char) => {
    const width = char === " " ? SPACE_SLOT : 1;
    const center = cursor + width / 2;
    cursor += width;
    return char === " " ? null : center;
  });
  const letters = centers.filter((center): center is number => center !== null);
  const first = letters[0] ?? 0;
  const last = letters[letters.length - 1] ?? first;
  const speed = (last - first + WAVE_RADIUS_SLOTS * 2) / WAVE_TOTAL_S;

  return {
    delays: centers.map((center) =>
      center === null ? null : WAVE_START_S + (center - first) / speed
    ),
    duration: (WAVE_RADIUS_SLOTS * 2) / speed,
    end: WAVE_START_S + WAVE_TOTAL_S,
  };
};

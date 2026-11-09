/**
 * 생성 이유: 마크다운 본문 이미지에 원본 크기(width·height)를 넣어 로드 전에 비율 자리를 잡기 위함이다(CLS 0).
 * 역할: PNG·JPEG·GIF·WebP 파일 머리에서 픽셀 크기를 읽는 서버 전용 유틸리티다.
 * 책임: 바이트 헤더 해석만 맡는다. 어떤 파일을 읽을지(경로 검증)는 markdown 변환이 정한다.
 *       새 의존성 없이 형식별 고정 위치만 읽고, 모르는 형식·깨진 파일은 null로 돌려 호출부가 크기 없이 그리게 한다.
 *       JPEG EXIF 회전(가로·세로 뒤바뀜)은 보지 않는다 — 현재 본문 이미지는 PNG다.
 */

export type ImageSize = { width: number; height: number };

const isPng = (bytes: Buffer) =>
  bytes.length >= 24 &&
  bytes.readUInt32BE(0) === 0x89504e47 &&
  bytes.toString("ascii", 12, 16) === "IHDR";

const isGif = (bytes: Buffer) =>
  bytes.length >= 10 && bytes.toString("ascii", 0, 3) === "GIF";

const isWebp = (bytes: Buffer) =>
  bytes.length >= 30 &&
  bytes.toString("ascii", 0, 4) === "RIFF" &&
  bytes.toString("ascii", 8, 12) === "WEBP";

const isJpeg = (bytes: Buffer) =>
  bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8;

/** WebP: 손실(VP8)·무손실(VP8L)·확장(VP8X) 청크마다 크기 위치가 다르다. */
const readWebp = (bytes: Buffer): ImageSize | null => {
  const chunk = bytes.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    const bits = bytes.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return {
      width: bytes.readUIntLE(24, 3) + 1,
      height: bytes.readUIntLE(27, 3) + 1,
    };
  }
  return null;
};

/** JPEG: 세그먼트를 건너뛰며 첫 SOF(프레임 시작) 마커의 높이·너비를 읽는다. */
const readJpeg = (bytes: Buffer): ImageSize | null => {
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    // 채움 바이트(0xFF 연속)는 한 칸씩 넘긴다.
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    const isFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isFrame) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  return null;
};

/** 파일 머리 바이트에서 픽셀 크기를 읽는다. 모르는 형식·깨진 헤더는 null. */
export const readImageSize = (bytes: Buffer): ImageSize | null => {
  try {
    let size: ImageSize | null = null;
    if (isPng(bytes)) {
      size = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    } else if (isGif(bytes)) {
      size = { width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8) };
    } else if (isWebp(bytes)) {
      size = readWebp(bytes);
    } else if (isJpeg(bytes)) {
      size = readJpeg(bytes);
    }
    return size && size.width > 0 && size.height > 0 ? size : null;
  } catch {
    // 잘린 파일 등으로 범위를 벗어나면 크기 없이 그린다.
    return null;
  }
};

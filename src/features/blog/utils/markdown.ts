/**
 * 생성 이유: 마크다운 변환 정책을 로컬 글과 Discussions 글에 동일하게 적용한다.
 * 역할: 블로그 feature의 공통 Markdown→HTML 변환 유틸리티다.
 * 책임: GFM 변환과 본문 제목 단계·본문 이미지의 크기·반응형 소스·로딩 우선순위 속성을 관리한다(서버 전용).
 *       - 본문 제목은 한 단계씩 내린다(# → h2) — 상세 페이지의 h1은 글 제목 하나다(스타일은 상세 Content가 맞춘다).
 *       - 로컬 이미지(/images/blog/…)는 public 파일 머리에서 원본 크기를 읽어 width·height를 넣는다
 *         → 로드 전에 비율 자리가 잡혀 본문이 밀리지 않는다(CLS 0). 읽지 못하면 크기 없이 그린다.
 *         ISR 재생성에서도 읽히도록 next.config의 outputFileTracingIncludes가 public/images/blog를 트레이스에 넣고,
 *         읽는 경로도 그 폴더로 좁혀 public의 다른 파일은 블로그 서버 함수에 실리지 않는다.
 *       - srcset의 URL·허용 폭은 next/image의 getImageProps가 만든다(next.config의 images 설정과 항상 같다).
 *         그중 원본보다 작은 폭과 원본 크기 하나만 남겨, 원본보다 큰 이름표로 같은 그림을 다시 받지 않는다.
 *       - sizes는 상세 본문 열의 실제 표시 폭을 따른다(넓게 적으면 폰이 한 단계 큰 변환본을 받는다).
 *       - 첫 화면에 걸릴 만큼 앞(앞선 본문 글자 수)에 있는 이미지(최대 2장)만 바로·높은 우선순위로 받고
 *         나머지는 지연 로딩한다 — 본문 깊숙한 첫 이미지가 제목·글꼴과 대역폭을 다투지 않는다.
 */
import { readFile } from "fs/promises";
import path from "path";
import { getImageProps } from "next/image";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import { readImageSize, type ImageSize } from "./imageSize";

/** next/image 최적화로 보내는 이미지 출처 — 원격은 next.config remotePatterns에 있는 호스트만 */
const VELOG_ORIGIN = "https://velog.velcdn.com/";
const LOCAL_PREFIX = "/images/blog/";

/** 로컬 이미지 경로 — 상위 폴더 이동 없이 public/images/blog 안의 래스터 파일만 읽는다. */
const LOCAL_IMAGE_PATH = /^\/images\/blog\/[\w.-]+\.(?:png|jpe?g|gif|webp)$/i;

/**
 * 본문 로컬 이미지 폴더(public/images/blog). 경로를 public이 아니라 이 폴더까지 적어 둔다 —
 * 파일 트레이스(webpack nft)가 public 전체(스택·프로젝트 이미지 등 약 12MB)를 블로그 함수에 싣지 않고 이 폴더만 따라간다.
 */
const BLOG_IMAGE_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "public",
  "images",
  "blog"
);

/** 이보다 작은 변환 폭은 본문 이미지에 쓰지 않는다(아이콘용 imageSizes 제외). */
const MIN_CANDIDATE_WIDTH = 384;

/**
 * 이미지 앞 본문이 이 글자 수보다 짧으면 첫 화면(폰 기준 대략 6~7줄) 안일 수 있다고 보고
 * 지연 로딩 없이 높은 우선순위로 받는다(LCP 후보). 더 뒤에 있으면 지연 로딩한다.
 */
const LEAD_TEXT_CHARS = 300;

/** 첫 화면 후보로 우선 받는 이미지 수 상한 — 사진이 줄지어 나와도 대역폭을 독점하지 않게 한다. */
const LEAD_IMAGE_LIMIT = 2;

/**
 * 상세 본문 열(BlogDetailPage Inner: min(40rem, 100%), 좌우 거터)의 실제 폭.
 * 루트 글자 크기 clamp(14px, 0.28vw + 13.1px, 17px)·거터 clamp(1rem, 0.4rem + 3.2vw, 3rem)에서 풀었다.
 * - 650px 미만: 뷰포트 − 좌우 거터 ≈ 93.4vw − 10.5px
 * - 650~1392px: 40rem ≈ 11.2vw + 524px
 * - 1393px 이상: 40rem × 17px = 680px
 */
const COLUMN = {
  narrow: { slope: 0.934, offset: -10.5 },
  mid: { slope: 0.112, offset: 524, from: 650 },
  max: { width: 680, from: 1393 },
} as const;

const calcPx = ({ slope, offset }: { slope: number; offset: number }) =>
  `calc(${(slope * 100).toFixed(1)}vw ${offset < 0 ? "-" : "+"} ${Math.abs(offset)}px)`;

const COLUMN_SIZES = [
  `(min-width: ${COLUMN.max.from}px) ${COLUMN.max.width}px`,
  `(min-width: ${COLUMN.mid.from}px) ${calcPx(COLUMN.mid)}`,
  calcPx(COLUMN.narrow),
].join(", ");

/** 원본이 열보다 좁으면 열이 원본 폭을 넘는 지점부터는 원본 폭 그대로 그려진다. */
const sizesFor = (width?: number) => {
  if (!width || width >= COLUMN.max.width) return COLUMN_SIZES;
  const midStartWidth = COLUMN.mid.slope * COLUMN.mid.from + COLUMN.mid.offset;
  const fitsFrom =
    width <= midStartWidth
      ? (width - COLUMN.narrow.offset) / COLUMN.narrow.slope
      : (width - COLUMN.mid.offset) / COLUMN.mid.slope;
  return `(min-width: ${Math.ceil(fitsFrom)}px) ${width}px, ${COLUMN_SIZES}`;
};

const sizeCache = new Map<string, Promise<ImageSize | null>>();

/** public 안 로컬 이미지의 원본 크기 — 빌드·재생성 때 한 번만 읽는다. 파일이 없으면(서버리스 번들 등) null. */
const localImageSize = (src: string) => {
  if (!LOCAL_IMAGE_PATH.test(src)) return Promise.resolve(null);
  const cached = sizeCache.get(src);
  if (cached) return cached;

  // LOCAL_IMAGE_PATH가 /images/blog/<파일명>만 통과시키므로 파일명만 붙인다(상위 폴더로 나갈 수 없다).
  const filePath = path.join(
    /*turbopackIgnore: true*/ BLOG_IMAGE_DIR,
    path.basename(src)
  );
  const pending = readFile(/* turbopackIgnore: true */ filePath)
    .then((bytes) => readImageSize(bytes))
    .catch(() => null);
  sizeCache.set(src, pending);
  return pending;
};

type Candidate = { url: string; width: number };

/** getImageProps의 srcSet("url 640w, …")을 후보 목록으로 푼다 — URL의 쉼표는 인코딩돼 있다. */
const parseSrcSet = (srcSet = ""): Candidate[] =>
  srcSet
    .split(", ")
    .map((entry) => {
      const [url, descriptor = ""] = entry.trim().split(" ");
      return { url, width: Number.parseInt(descriptor, 10) };
    })
    .filter((candidate) => candidate.url && Number.isFinite(candidate.width));

/**
 * 원본보다 작은 허용 폭 + 원본 크기 하나 — 최적화기는 원본보다 크게 늘리지 않으므로
 * 원본 이상을 요청한 첫 후보는 실제로 원본 폭이고, 이름표도 원본 폭으로 고친다.
 */
const fitCandidates = (all: Candidate[], width?: number) => {
  const usable = all.filter((candidate) => candidate.width >= MIN_CANDIDATE_WIDTH);
  if (!width) return usable;
  const smaller = usable.filter((candidate) => candidate.width < width);
  const covering = all.find((candidate) => candidate.width >= width);
  return covering ? [...smaller, { url: covering.url, width }] : smaller;
};

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const unescapeAttr = (value: string) =>
  value.replace(/&quot;/g, '"').replace(/&amp;/g, "&");

const textLength = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim().length;

type ImageTag = { tag: string; src: string; rest: string; index: number };

const IMAGE_TAG = /<img src="([^"]+)"([^>]*)>/g;

const buildImageTag = async (
  { src: escapedSrc, rest }: ImageTag,
  isLead: boolean
) => {
  const src = unescapeAttr(escapedSrc);
  const loading = isLead ? 'fetchpriority="high"' : 'loading="lazy"';
  const optimizable =
    src.startsWith(VELOG_ORIGIN) || src.startsWith(LOCAL_PREFIX);

  if (!optimizable) {
    return `<img ${loading} decoding="async" src="${escapedSrc}"${rest}>`;
  }

  const size = await localImageSize(src);
  const sizes = sizesFor(size?.width);
  const { props } = size
    ? getImageProps({ src, alt: "", width: size.width, height: size.height, sizes })
    : getImageProps({ src, alt: "", fill: true, sizes });
  const candidates = fitCandidates(parseSrcSet(props.srcSet), size?.width);
  const fallback = candidates[candidates.length - 1]?.url ?? props.src;
  const srcSet = candidates
    .map((candidate) => `${candidate.url} ${candidate.width}w`)
    .join(", ");
  const dimensions = size
    ? ` width="${size.width}" height="${size.height}"`
    : "";

  return `<img ${loading} decoding="async" src="${escapeAttr(fallback)}" srcset="${escapeAttr(
    srcSet
  )}" sizes="${sizes}"${dimensions}${rest}>`;
};

const optimizeImages = async (html: string) => {
  const tags: ImageTag[] = Array.from(html.matchAll(IMAGE_TAG), (match) => ({
    tag: match[0],
    src: match[1],
    rest: match[2],
    index: match.index ?? 0,
  }));
  if (tags.length === 0) return html;

  const replacements = await Promise.all(
    tags.map((tag, order) =>
      buildImageTag(
        tag,
        order < LEAD_IMAGE_LIMIT &&
          textLength(html.slice(0, tag.index)) < LEAD_TEXT_CHARS
      )
    )
  );

  let cursor = 0;
  let result = "";
  tags.forEach((tag, order) => {
    result += html.slice(cursor, tag.index) + replacements[order];
    cursor = tag.index + tag.tag.length;
  });
  return result + html.slice(cursor);
};

/** remark-html이 만든 제목 태그(<h1>…</h5>, 여는·닫는 태그 모두). 코드 블록 속 글자는 &lt;로 이스케이프돼 걸리지 않는다. */
const HEADING_TAG = /<(\/?)h([1-5])(?=[\s>])/g;

/**
 * 본문 제목을 한 단계씩 내린다(# → h2 … ##### → h6) — 페이지 h1은 글 제목 하나뿐이고 본문 개요가 그 아래로 이어진다.
 * 한 번의 치환에서 각 태그를 정확히 한 번만 바꾸므로 두 번 밀리지 않는다. h6은 그대로 둔다.
 */
const demoteHeadings = (html: string) =>
  html.replace(
    HEADING_TAG,
    (_tag, slash: string, level: string) => `<${slash}h${Number(level) + 1}`
  );

export const markdownToHtml = async (markdown: string) => {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return optimizeImages(demoteHeadings(String(result)));
};

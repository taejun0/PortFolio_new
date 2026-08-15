/**
 * 생성 이유: 마크다운 변환 정책을 로컬 글과 Discussions 글에 동일하게 적용한다.
 * 역할: 블로그 feature의 공통 Markdown→HTML 변환 유틸리티다.
 * 책임: GFM 변환과 본문 이미지의 지연 로딩 속성을 관리한다.
 */
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const NEXT_IMAGE_WIDTHS = [640, 1080] as const;

const nextImageUrl = (src: string, width: number) =>
  `/_next/image?url=${encodeURIComponent(src)}&amp;w=${width}&amp;q=75`;

const optimizeImages = (html: string) => {
  let imageIndex = 0;

  return html.replace(/<img src="([^"]+)"([^>]*)>/g, (tag, src, rest) => {
    const loading =
      imageIndex === 0
        ? 'fetchpriority="high"'
        : 'loading="lazy"';
    imageIndex += 1;

    const canUseNextImage =
      src.startsWith("https://velog.velcdn.com/") ||
      src.startsWith("/images/blog/");

    if (!canUseNextImage) {
      return `<img ${loading} decoding="async" src="${src}"${rest}>`;
    }

    const srcSet = NEXT_IMAGE_WIDTHS.map(
      (width) => `${nextImageUrl(src, width)} ${width}w`
    ).join(", ");

    return `<img ${loading} decoding="async" src="${nextImageUrl(
      src,
      NEXT_IMAGE_WIDTHS[1]
    )}" srcset="${srcSet}" sizes="(max-width: 768px) 100vw, 768px"${rest}>`;
  });
};

export const markdownToHtml = async (markdown: string) => {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return optimizeImages(String(result));
};

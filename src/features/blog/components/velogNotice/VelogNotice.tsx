/**
 * 생성 이유: Velog에서 이전한 글 안내를 목록 페이지에 고정으로 보여 준다.
 * 역할: 블로그 목록 하단 Velog 마이그레이션 안내 배너다.
 * 책임: cutoff 날짜·Velog 프로필 링크 문구 렌더링만 담당한다.
 *       목록 카드와 같은 블록 스윕으로 등장한다(감싸는 요소 없이 useReveal).
 */
"use client";

import { HoverArrow } from "@/components/common/hoverArrow/HoverArrow.styled";
import { useReveal } from "@/components/common/motion";
import * as S from "./VelogNotice.styled";
import { BLOG_VELOG_NOTICE_UI } from "../../constants";
import { SITE_CONFIG } from "@/lib/siteConfig";

const formatCutoff = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

type VelogNoticeProps = {
  cutoffDate?: string;
  velogUrl?: string;
};

const VelogNotice = ({
  cutoffDate = BLOG_VELOG_NOTICE_UI.cutoffDate,
  velogUrl = SITE_CONFIG.velog,
}: VelogNoticeProps) => {
  const formattedDate = formatCutoff(cutoffDate);
  const reveal = useReveal<HTMLDivElement>();

  return (
    <S.Wrapper {...reveal}>
      <S.Text>
        {formattedDate
          ? `${formattedDate}${BLOG_VELOG_NOTICE_UI.withCutoff}`
          : BLOG_VELOG_NOTICE_UI.legacy}
        <S.Link href={velogUrl} target="_blank" rel="noopener noreferrer">
          {BLOG_VELOG_NOTICE_UI.link}
          <HoverArrow aria-hidden />
        </S.Link>
      </S.Text>
    </S.Wrapper>
  );
};

export default VelogNotice;

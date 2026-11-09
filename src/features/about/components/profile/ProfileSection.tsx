/**
 * 생성 이유: About 상세의 첫 화면을 Thomas Sobre 구도로 맞춘다.
 * 역할: AboutPage 프로필 챕터다.
 * 책임: 디스플레이 네임·태그라인·초상과 기술 마퀴를 한 챕터로 렌더링하고, 첫 화면 등장 순서를 정한다.
 *
 * 등장 순서(가로 스윕 한 줄기)
 * - 이름 두 줄과 초상은 커튼이다: 첫 페인트부터 칠해진 내용 위를 캔버스색 덮개가 왼쪽부터 걷는다.
 *   초상은 /about의 LCP 요소라 가리지 않고 덮기만 하며, 지연 로딩 없이 높은 우선순위로 받는다.
 * - 라벨·태그라인·마퀴는 sweep이다: 새로고침 첫 화면에서는 그대로 보이고, 다른 페이지에서 이동해 오면 쓸려 들어온다.
 * - 커튼은 hydration 전에 CSS가 시작하므로 줄·초상 간격은 delay로 준다(컨트롤러 배치 스태거가 닿지 않는 경로).
 */
"use client";

import { Reveal, SweepText } from "@/components/common/motion";
import PortraitFrame from "@/components/common/portraitFrame/PortraitFrame";
import { motionTokens } from "@/styles/theme";
import MarqueeSection from "../marquee/MarqueeSection";
import * as S from "./ProfileSection.styled";
import { ABOUT_PAGE_UI } from "../../constants";

const ui = ABOUT_PAGE_UI.profile;

/** 이름 둘째 줄이 첫 줄을 뒤따르는 간격(s) — 위아래 두 줄이 한 줄기 스윕으로 이어진다. */
const NAME_LINE_LAG = 0.08;

/** 초상 커튼 지연(s) — 읽는 방향대로 왼쪽 이름이 먼저, 오른쪽 초상이 뒤따라 걷힌다. */
const PORTRAIT_LAG = 0.18;

/**
 * 렌더 폭과 맞춘 sizes — 모바일 min(13rem, 52vw)(≤ 200px), 태블릿 이상 clamp(13rem, 24vw, 21rem)(≤ 360px).
 * 24vw가 13rem 하한(≈200px)보다 작은 833px까지는 200px로 둔다.
 */
const PORTRAIT_SIZES = "(max-width: 833px) 200px, (max-width: 1499px) 24vw, 360px";

const ProfileSection = () => (
  <S.Chapter>
    <S.Inner>
      <S.Layout>
        <S.Intro>
          <SweepText as={S.Eyebrow}>{ui.eyebrow}</SweepText>
          <S.DisplayName>
            {ui.nameLines.map((line, index) => (
              <SweepText
                key={line}
                as={S.NameLine}
                variant="curtain"
                duration={motionTokens.duration.title}
                delay={index * NAME_LINE_LAG}
              >
                {line}
              </SweepText>
            ))}
          </S.DisplayName>
          <Reveal as={S.Tagline}>
            {ui.taglineBefore}
            <S.Emphasis>{ui.taglineEmphasis}</S.Emphasis>
          </Reveal>
        </S.Intro>
        <Reveal
          as={S.Portrait}
          variant="curtain"
          duration={motionTokens.duration.title}
          delay={PORTRAIT_LAG}
        >
          <PortraitFrame
            src={ui.photo}
            alt={ui.photoAlt}
            sizes={PORTRAIT_SIZES}
            aspectRatio="4 / 5"
            loading="eager"
            fetchPriority="high"
            settle
          />
        </Reveal>
      </S.Layout>
    </S.Inner>
    <Reveal as={S.MarqueeSlot}>
      <MarqueeSection embedded />
    </Reveal>
  </S.Chapter>
);

export default ProfileSection;

/**
 * 생성 이유: About 상세의 첫 화면을 Thomas Sobre 구도로 맞춘다.
 * 역할: AboutPage 프로필 챕터다.
 * 책임: 디스플레이 네임·태그라인·기술 마퀴를 한 챕터로 렌더링한다.
 */
"use client";

import MarqueeSection from "../marquee/MarqueeSection";
import * as S from "./ProfileSection.styled";
import { ABOUT_PAGE_UI } from "../../constants";

const ui = ABOUT_PAGE_UI.profile;

const ProfileSection = () => (
  <S.Chapter>
    <S.Inner>
      <S.Eyebrow>{ui.eyebrow}</S.Eyebrow>
      <S.DisplayName>
        {ui.nameLines.map((line) => (
          <S.NameLine key={line}>{line}</S.NameLine>
        ))}
      </S.DisplayName>
      <S.Tagline>
        {ui.taglineBefore}
        <S.Emphasis>{ui.taglineEmphasis}</S.Emphasis>
      </S.Tagline>
    </S.Inner>
    <S.MarqueeSlot>
      <MarqueeSection embedded />
    </S.MarqueeSlot>
  </S.Chapter>
);

export default ProfileSection;

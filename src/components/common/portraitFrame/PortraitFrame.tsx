/**
 * 생성 이유: 프로필 사진의 반전·배경 처리를 한곳에서 관리한다.
 * 역할: 메인·About 공통 초상 프레임 컴포넌트다.
 * 책임: mirror·loading·fetchPriority·settle 옵션과 은은한 배경·이미지 렌더링을 담당한다.
 *       등장 판정은 감싼 리빌(Reveal)이 하고, 프레임은 settle일 때 그 재생에 맞춰 사진을 가라앉히기만 한다.
 */
"use client";

import Image from "next/image";

import * as S from "./PortraitFrame.styled";

type PortraitFrameProps = {
  src: string;
  alt: string;
  sizes: string;
  aspectRatio?: string;
  mirror?: boolean;
  /** 첫 화면(LCP) 초상은 "eager"로 지연 로딩을 끈다. 생략하면 Next 기본(lazy)이다. */
  loading?: "eager" | "lazy";
  /**
   * LCP 초상은 "high" — img와 React가 head에 넣는 이미지 preload 둘 다 높은 우선순위가 된다.
   * (Next 16에서 priority는 폐기됐고, 문서는 preload 대신 loading="eager" + fetchPriority를 권한다.)
   */
  fetchPriority?: "high" | "low" | "auto";
  /**
   * 감싼 리빌(curtain·sweep)이 재생될 때 사진이 1.03배에서 제자리로 가라앉는다.
   * 리빌 밖·JS 없음·동작 줄이기에서는 아무 변화가 없다.
   */
  settle?: boolean;
};

const PortraitFrame = ({
  src,
  alt,
  sizes,
  aspectRatio = "3 / 4",
  mirror = false,
  loading,
  fetchPriority,
  settle = false,
}: PortraitFrameProps) => (
  <S.Frame $aspectRatio={aspectRatio}>
    <S.Backdrop aria-hidden />
    <S.ImageWrap $mirror={mirror} $settle={settle}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={loading}
        fetchPriority={fetchPriority}
        style={{ objectFit: "cover", objectPosition: "center 14%" }}
      />
    </S.ImageWrap>
  </S.Frame>
);

export default PortraitFrame;

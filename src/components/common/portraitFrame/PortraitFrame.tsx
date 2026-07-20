/**
 * 생성 이유: 프로필 사진의 반전·배경 처리를 한곳에서 관리한다.
 * 역할: 메인·About 공통 초상 프레임 컴포넌트다.
 * 책임: mirror 옵션과 은은한 배경·이미지 렌더링을 담당한다.
 */
"use client";

import Image from "next/image";

import * as S from "./PortraitFrame.styled";

type PortraitFrameProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  aspectRatio?: string;
  mirror?: boolean;
};

const PortraitFrame = ({
  src,
  alt,
  sizes,
  priority = false,
  aspectRatio = "3 / 4",
  mirror = false,
}: PortraitFrameProps) => (
  <S.Frame $aspectRatio={aspectRatio}>
    <S.Backdrop aria-hidden />
    <S.ImageWrap $mirror={mirror}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover", objectPosition: "center 14%" }}
      />
    </S.ImageWrap>
  </S.Frame>
);

export default PortraitFrame;

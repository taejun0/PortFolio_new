/**
 * 생성 이유: 네비·CTA·텍스트 링크 라벨이 호버에서 같은 가로 롤로 반응하게 한다.
 * 역할: 글자가 오른쪽으로 빠지고 같은 글자가 왼쪽에서 들어오는 CSS 전용 롤 라벨이다.
 * 책임: 앞면(읽히는 원문) 마크업과 복사본 문자열(data-roll-label)만 맡는다. 시각은 RollText.styled가 소유한다.
 *
 * - 가장 가까운 a·button의 호버·키보드 포커스에 반응한다. 다른 부모(li·카드)로 굴리려면 부모에 rollTextParent를 쓴다.
 * - 들어오는 복사본은 DOM 글자가 아니라 ::after 생성 콘텐츠다(대체 텍스트 ""). 그래서 textContent·innerText·
 *   복사·페이지 내 찾기·번역·읽기 모드·접근 가능한 이름에는 앞면 한 번만 나온다.
 * - 감싼 링크에 aria-label을 주지 않는다 — 보이는 글자와 이름이 어긋나면 검사 도구가
 *   label-content-name-mismatch로 잡는다. 설명이 더 필요하면 VisuallyHidden 글자를 라벨 뒤에 붙인다.
 * - 동작 줄이기에서는 움직이지 않고 부모의 색 변화만 남는다.
 */
"use client";

import * as S from "./RollText.styled";

type RollTextProps = {
  /** 라벨 — 짧은 문자열(복사본이 속성 값으로 그려지므로 문자열만 받는다) */
  children: string;
  className?: string;
};

const RollText = ({ children, className }: RollTextProps) => (
  <S.Root data-roll="" data-roll-label={children} className={className}>
    <span data-roll-face="">{children}</span>
  </S.Root>
);

export default RollText;

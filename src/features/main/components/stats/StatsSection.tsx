/**
 * 생성 이유: 메인 히어로 직후에 핵심 지표로 관심을 끈다.
 * 역할: 메인 페이지 후킹용 지표 스트립이다.
 * 책임: 숫자·단위·한 줄 설명 그리드만 렌더링한다.
 */
"use client";

import * as S from "./StatsSection.styled";
import { MAIN_STATS_UI } from "../../constants";

const StatsSection = () => (
  <S.Strip aria-label="핵심 지표">
    <S.Inner>
      <S.Grid>
        {MAIN_STATS_UI.items.map((item) => (
          <S.Item key={`${item.value}-${item.unit}`}>
            <S.Value>{item.value}</S.Value>
            <S.Unit>{item.unit}</S.Unit>
            <S.Detail>{item.detail}</S.Detail>
          </S.Item>
        ))}
      </S.Grid>
    </S.Inner>
  </S.Strip>
);

export default StatsSection;

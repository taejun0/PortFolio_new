/**
 * 생성 이유: App Router의 서버 렌더링 과정에서 Emotion 스타일 누락을 방지한다.
 * 역할: 서버에서 생성된 Emotion 스타일을 문서 head에 주입하는 캐시 레지스트리다.
 * 책임: 요청별 스타일 수집과 flush를 관리하고 hydration 전 스타일 적용을 보장한다.
 *       자동 벤더 접두사(stylis prefixer)는 쓰지 않는다 — 필요한 접두사는 스타일 파일이 직접 쓴다.
 *       전역 스타일(<Global>)은 컴포넌트 스타일과 따로, Emotion이 클라이언트에서 찾는 형식
 *       (data-emotion="css-global <이름>")으로 내보낸다 — 그래야 클라이언트 <Global>이 그 태그를 넘겨받고(rehydrate)
 *       같은 전역 규칙을 한 벌 더 넣지 않는다.
 */
"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState, type ReactNode } from "react";

type InsertedStyle = { name: string; isGlobal: boolean };

/**
 * 서버 <Global>은 선택자 없이("") 넣는다. 컴포넌트 스타일은 ".css-<이름>" 선택자로 넣고,
 * 같은 빈 선택자로 함께 넣는 키프레임은 이름이 "animation-"으로 시작한다(Emotion keyframes 규칙).
 */
const isGlobalInsert = (selector: string, name: string) =>
  selector === "" && !name.startsWith("animation-");

/**
 * App Router SSR 스트리밍 시점에 Emotion 스타일을 <head>로 주입하는 레지스트리.
 * 서버에서 렌더된 스타일이 클라이언트 hydration 전에 적용되도록 보장한다.
 */
export default function EmotionRegistry({ children }: { children: ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    /*
     * stylisPlugins: [] — stylis 기본 prefixer(-webkit-·-moz-·-ms- 복제, 옛 flexbox, @-webkit-keyframes)를 끈다.
     * 지원 브라우저에서 아직 접두사가 필요한 속성(backdrop-filter·user-select 등)은 각 스타일 파일에 직접 쓴다.
     * SSR 시트가 3분의 1 이상 줄어 HTML이 가벼워지고 스타일 재계산 비용도 준다.
     */
    const cache = createCache({ key: "css", stylisPlugins: [] });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: InsertedStyle[] = [];
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({
          name: serialized.name,
          isGlobal: isGlobalInsert(selector, serialized.name),
        });
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const entries = flush();
    if (entries.length === 0) return null;

    const globals: { name: string; rules: string }[] = [];
    const names: string[] = [];
    let styles = "";
    for (const { name, isGlobal } of entries) {
      const rules = cache.inserted[name];
      if (typeof rules !== "string") continue;
      if (isGlobal) {
        globals.push({ name, rules });
      } else {
        names.push(name);
        styles += rules;
      }
    }

    return (
      <>
        {globals.map(({ name, rules }) => (
          <style
            key={name}
            data-emotion={`${cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: rules }}
          />
        ))}
        {names.length > 0 && (
          <style
            data-emotion={`${cache.key} ${names.join(" ")}`}
            dangerouslySetInnerHTML={{ __html: styles }}
          />
        )}
      </>
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

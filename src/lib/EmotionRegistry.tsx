/**
 * 생성 이유: App Router의 서버 렌더링 과정에서 Emotion 스타일 누락을 방지한다.
 * 역할: 서버에서 생성된 Emotion 스타일을 문서 head에 주입하는 캐시 레지스트리다.
 * 책임: 요청별 스타일 수집과 flush를 관리하고 hydration 전 스타일 적용을 보장한다.
 */
"use client";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState, type ReactNode } from "react";

/**
 * App Router SSR 스트리밍 시점에 Emotion 스타일을 <head>로 주입하는 레지스트리.
 * 서버에서 렌더된 스타일이 클라이언트 hydration 전에 적용되도록 보장한다.
 */
export default function EmotionRegistry({ children }: { children: ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
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
    const names = flush();
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

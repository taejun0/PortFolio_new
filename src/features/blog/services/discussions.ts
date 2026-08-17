/**
 * 생성 이유: Discussions를 신규 블로그 본문 소스로 쓰기 위함이다.
 * 역할: GitHub Discussions(Blog 카테고리)를 읽어 블로그 글로 변환한다.
 * 책임: 캐시·페이지네이션 GraphQL 조회, 마크다운→HTML, slug(d-{number}) 매핑, 실패 관측.
 */
import { unstable_cache } from "next/cache";

import type { BlogPost, BlogPostMeta } from "../types";
import { markdownToHtml } from "../utils/markdown";
import { BLOG_DISCUSSIONS_CONFIG } from "@/lib/siteConfig";

type DiscussionNode = {
  number: number;
  title: string;
  body: string;
  createdAt: string;
  url: string;
  category?: { name: string } | null;
};

type DiscussionPage = {
  nodes: DiscussionNode[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};

const toDate = (iso: string) => iso.slice(0, 10);

const toDescription = (body: string) => {
  const plain = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return "";
  return plain.length > 140 ? `${plain.slice(0, 140)}…` : plain;
};

const discussionSlug = (number: number) =>
  `${BLOG_DISCUSSIONS_CONFIG.slugPrefix}${number}`;

const parseRepo = () => {
  const [owner, name] = BLOG_DISCUSSIONS_CONFIG.repo.split("/");
  return { owner, name };
};

const fetchDiscussionNodesUncached = async (): Promise<DiscussionNode[]> => {
  const token = process.env.GITHUB_TOKEN ?? process.env.GITHUB_DISCUSSIONS_TOKEN;
  const { owner, name } = parseRepo();
  if (!owner || !name) return [];

  if (!token) {
    console.warn(
      "[blog] GitHub Discussions token is missing; discussion posts are skipped."
    );
    return [];
  }

  const query = `
    query ($owner: String!, $name: String!, $after: String) {
      repository(owner: $owner, name: $name) {
        discussions(
          first: 50
          after: $after
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          nodes {
            number
            title
            body
            createdAt
            url
            category { name }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;

  try {
    const nodes: DiscussionNode[] = [];
    let after: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "User-Agent": "taejun0-portfolio",
        },
        body: JSON.stringify({ query, variables: { owner, name, after } }),
      });

      if (!res.ok) {
        throw new Error(`GitHub GraphQL HTTP ${res.status}`);
      }

      const json = (await res.json()) as {
        data?: { repository?: { discussions?: DiscussionPage } };
        errors?: unknown[];
      };
      if (json.errors?.length) {
        throw new Error("GitHub GraphQL returned errors");
      }

      const page = json.data?.repository?.discussions;
      if (!page) break;
      nodes.push(...page.nodes);
      hasNextPage = page.pageInfo.hasNextPage;
      after = page.pageInfo.endCursor;
      if (hasNextPage && !after) break;
    }

    return nodes.filter(
      (node) => node.category?.name === BLOG_DISCUSSIONS_CONFIG.category
    );
  } catch (error) {
    console.error("[blog] Failed to load GitHub Discussions.", error);
    return [];
  }
};

const fetchDiscussionNodes = unstable_cache(
  fetchDiscussionNodesUncached,
  ["blog-discussion-nodes"],
  { revalidate: 60, tags: ["blog-discussions"] }
);

const fetchDiscussionNodeByNumberUncached = async (
  number: number
): Promise<DiscussionNode | null> => {
  const token = process.env.GITHUB_TOKEN ?? process.env.GITHUB_DISCUSSIONS_TOKEN;
  const { owner, name } = parseRepo();
  if (!owner || !name || !token) return null;

  const query = `
    query ($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        discussion(number: $number) {
          number
          title
          body
          createdAt
          url
          category { name }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "User-Agent": "taejun0-portfolio",
      },
      body: JSON.stringify({
        query,
        variables: { owner, name, number },
      }),
    });

    if (!res.ok) throw new Error(`GitHub GraphQL HTTP ${res.status}`);

    const json = (await res.json()) as {
      data?: { repository?: { discussion?: DiscussionNode | null } };
      errors?: unknown[];
    };
    if (json.errors?.length) {
      throw new Error("GitHub GraphQL returned errors");
    }

    return json.data?.repository?.discussion ?? null;
  } catch (error) {
    console.error(`[blog] Failed to load GitHub Discussion #${number}.`, error);
    return null;
  }
};

const fetchDiscussionNodeByNumber = unstable_cache(
  fetchDiscussionNodeByNumberUncached,
  ["blog-discussion-node"],
  { revalidate: 60, tags: ["blog-discussions"] }
);

const toMeta = (node: DiscussionNode): BlogPostMeta => ({
  slug: discussionSlug(node.number),
  title: node.title,
  date: toDate(node.createdAt),
  description: toDescription(node.body ?? ""),
  tags: [],
  source: "discussion",
  discussionNumber: node.number,
  discussionUrl: node.url,
});

export const isDiscussionSlug = (slug: string) =>
  slug.startsWith(BLOG_DISCUSSIONS_CONFIG.slugPrefix) &&
  /^[1-9]\d*$/.test(slug.slice(BLOG_DISCUSSIONS_CONFIG.slugPrefix.length));

export const getDiscussionPostsMeta = async (): Promise<BlogPostMeta[]> => {
  const nodes = await fetchDiscussionNodes();
  return nodes.map(toMeta);
};

export const getDiscussionPostBySlug = async (
  slug: string
): Promise<BlogPost | null> => {
  if (!isDiscussionSlug(slug)) return null;
  const number = Number(slug.slice(BLOG_DISCUSSIONS_CONFIG.slugPrefix.length));
  if (!Number.isSafeInteger(number)) return null;

  const node = await fetchDiscussionNodeByNumber(number);
  if (!node || node.category?.name !== BLOG_DISCUSSIONS_CONFIG.category) {
    return null;
  }

  return {
    ...toMeta(node),
    contentHtml: await markdownToHtml(node.body || ""),
  };
};

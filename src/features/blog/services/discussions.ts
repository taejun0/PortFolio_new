/**
 * 생성 이유: Discussions를 신규 블로그 본문 소스로 쓰기 위함이다.
 * 역할: GitHub Discussions(Blog 카테고리)를 읽어 블로그 글로 변환한다.
 * 책임: GraphQL 조회, 마크다운→HTML, slug(d-{number}) 매핑, 토큰 부재 시 빈 목록 반환.
 */
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import type { BlogPost, BlogPostMeta } from "../types";
import { BLOG_DISCUSSIONS_CONFIG } from "@/lib/siteConfig";

type DiscussionNode = {
  number: number;
  title: string;
  body: string;
  createdAt: string;
  url: string;
  category?: { name: string } | null;
};

const markdownToHtml = async (markdown: string) => {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(markdown);
  return String(result);
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

const fetchDiscussionNodes = async (): Promise<DiscussionNode[]> => {
  const token = process.env.GITHUB_TOKEN ?? process.env.GITHUB_DISCUSSIONS_TOKEN;
  const { owner, name } = parseRepo();
  if (!owner || !name) return [];

  const query = `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 50, orderBy: { field: CREATED_AT, direction: DESC }) {
          nodes {
            number
            title
            body
            createdAt
            url
            category { name }
          }
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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "User-Agent": "taejun0-portfolio",
      },
      body: JSON.stringify({ query, variables: { owner, name } }),
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const json = (await res.json()) as {
      data?: {
        repository?: { discussions?: { nodes?: DiscussionNode[] } };
      };
      errors?: unknown[];
    };

    if (json.errors?.length) return [];

    const nodes = json.data?.repository?.discussions?.nodes ?? [];
    return nodes.filter(
      (node) => node.category?.name === BLOG_DISCUSSIONS_CONFIG.category
    );
  } catch {
    return [];
  }
};

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
  slug.startsWith(BLOG_DISCUSSIONS_CONFIG.slugPrefix);

export const getDiscussionPostsMeta = async (): Promise<BlogPostMeta[]> => {
  const nodes = await fetchDiscussionNodes();
  return nodes.map(toMeta);
};

export const getDiscussionPostBySlug = async (
  slug: string
): Promise<BlogPost | null> => {
  if (!isDiscussionSlug(slug)) return null;
  const number = Number(slug.slice(BLOG_DISCUSSIONS_CONFIG.slugPrefix.length));
  if (!Number.isFinite(number)) return null;

  const nodes = await fetchDiscussionNodes();
  const node = nodes.find((item) => item.number === number);
  if (!node) return null;

  return {
    ...toMeta(node),
    contentHtml: await markdownToHtml(node.body || ""),
  };
};

export const getDiscussionSlugs = async () => {
  const metas = await getDiscussionPostsMeta();
  return metas.map((post) => post.slug);
};

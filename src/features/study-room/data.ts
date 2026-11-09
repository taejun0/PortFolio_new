import { MAIN_ABOUT_UI, MAIN_BLOG_FEATURED, MAIN_CLOSE_UI, MAIN_HERO_UI } from "@/features/main/constants";
import { STACK_GROUPS } from "@/features/stack/constants";
import { ABOUT_PAGE_UI } from "@/features/about/constants";
import { PROJECTS } from "@/features/projects/constants/projects";
import { getBlogPostBySlug } from "@/features/blog/services/blog";
import { SITE_CONFIG } from "@/lib/siteConfig";
import type { RoomNoteContent } from "./interactions";

/** Existing public content is rendered in-room; legacy page layouts are not embedded. */
export async function getRoomNoteContent(): Promise<RoomNoteContent> {
  const posts = await Promise.all(MAIN_BLOG_FEATURED.flatMap(post => post.external ? [] : [getBlogPostBySlug(post.slug)]));
  return {
    profile: {
      name: SITE_CONFIG.author,
      role: MAIN_HERO_UI.roles[0],
      education: MAIN_ABOUT_UI.facts.find(fact => fact.label === "학력")?.value ?? "",
      image: MAIN_ABOUT_UI.photo,
      email: SITE_CONFIG.email,
      github: SITE_CONFIG.github,
      paragraphs: [...ABOUT_PAGE_UI.profile.paragraphs],
      experiences: ABOUT_PAGE_UI.trajectory.items.map(item => ({ period: item.period, title: item.title, points: [...item.points] })),
    },
    projects: PROJECTS.map(project => ({
      id: project.slug, title: project.title, summary: project.summary, image: project.image,
      period: project.periodShort ?? project.period, role: project.role,
      tags: project.tags, overview: project.overview, roles: project.roles,
      decisions: project.decisions, github: project.github,
    })),
    posts: posts.flatMap(post => post ? [{
      id: post.slug, title: post.title, date: post.date, description: post.description, html: post.contentHtml,
    }] : []),
    photos: [MAIN_ABOUT_UI.photo, MAIN_CLOSE_UI.photo],
    tools: STACK_GROUPS.map(group => ({ title: group.title, items: group.items })),
  };
}

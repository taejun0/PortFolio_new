import Image from "next/image";
import type { MouseEvent } from "react";
import type { RoomNoteContent } from "../interactions";
import styles from "../StudyRoom.module.css";

type ReaderProps = { content: RoomNoteContent; entry: string | null; onSelect: (id: string) => void };

export function ProjectReader({ content, entry, onSelect }: ReaderProps) {
  const project = content.projects.find(item => item.id === entry);
  if (!project) return (
    <ul className={styles.projectGrid}>
      {content.projects.map(item => <li key={item.id}>
        <button className={styles.projectTile} data-room-open-entry={item.id} onClick={() => onSelect(item.id)} aria-label={`${item.title} 보기`}>
          <span className={styles.projectTileImage}><Image src={item.image} alt="" width={320} height={180} sizes="(max-width: 640px) calc(100vw - 80px), 330px"/></span>
          <span className={styles.projectTileText}><strong>{item.title}</strong><span>{item.summary}</span></span>
        </button>
      </li>)}
    </ul>
  );
  return (
    <article className={styles.projectReading} data-room-entry={project.id}>
      <div className={styles.projectHero}><Image src={project.image} alt={project.title} width={720} height={405} sizes="(max-width: 640px) calc(100vw - 80px), 690px"/></div>
      <header className={styles.readingHeading}><p>{project.period} · {project.role}</p><h3>{project.title}</h3></header>
      <p className={styles.projectOverview}>{project.overview}</p>
      <ul className={styles.projectTags}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <section className={styles.projectSection}><h4>담당한 일</h4><ul>{project.roles.map(role => <li key={role}>{role}</li>)}</ul></section>
      <section className={styles.projectSection}><h4>주요 선택</h4><ul>{project.decisions.map(decision => <li key={decision}>{decision}</li>)}</ul></section>
      {project.github && <a className={styles.readerExternal} href={project.github} target="_blank" rel="noopener noreferrer">코드 보기 ↗<span className={styles.srOnly}> (새 창)</span></a>}
    </article>
  );
}

export function BlogReader({ content, entry, onSelect }: ReaderProps) {
  const post = content.posts.find(item => item.id === entry);
  if (!post) return (
    <ul className={styles.journalIndex}>
      {content.posts.map(item => <li key={item.id}>
        <button data-room-open-entry={item.id} onClick={() => onSelect(item.id)} aria-label={`${item.title} 읽기`}>
          <time dateTime={item.date}>{item.date.replaceAll("-", ".")}</time>
          <strong>{item.title}</strong>
          <span>{item.description}</span>
          <span className={styles.journalOpen} aria-hidden="true">읽기 →</span>
        </button>
      </li>)}
    </ul>
  );
  const openReference = (event: MouseEvent<HTMLDivElement>) => {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!link || link.getAttribute("href")?.startsWith("#")) return;
    // Article references open separately; the reading room remains in place.
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  };
  return (
    <article className={styles.journalReading} data-room-entry={post.id}>
      <header className={styles.readingHeading}><time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time><h3>{post.title}</h3><p>{post.description}</p></header>
      <div className={styles.readingProse} onClick={openReference} dangerouslySetInnerHTML={{ __html: post.html }}/>
    </article>
  );
}

export function ProfileReader({ content }: { content: RoomNoteContent }) {
  const profile = content.profile;
  return (
    <div className={styles.profileReading}>
      <div className={styles.noteProfile}>
        <span className={styles.notePortrait}><Image src={profile.image} alt={profile.name} width={80} height={96} sizes="80px"/></span>
        <div><h3>{profile.name}</h3><p>{profile.role}</p></div>
      </div>
      <p className={styles.noteEducation}>{profile.education}</p>
      <div className={styles.profileParagraphs}>{profile.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      <section className={styles.profileHistory}><h4>경험</h4><ol>{profile.experiences.slice(-4).map(experience => <li key={`${experience.period}-${experience.title}`}>
        <span>{experience.period}</span><h5>{experience.title}</h5><ul>{experience.points.map(point => <li key={point}>{point}</li>)}</ul>
      </li>)}</ol></section>
      <div className={styles.noteContact}><a href={`mailto:${profile.email}`}>{profile.email}</a><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗<span className={styles.srOnly}> (새 창)</span></a></div>
    </div>
  );
}

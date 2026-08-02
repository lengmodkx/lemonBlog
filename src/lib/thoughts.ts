import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { Thought, PaginatedThoughts } from '@/types/thought';

export type { Thought, PaginatedThoughts } from '@/types/thought';

const thoughtsDirectory = path.join(process.cwd(), 'content/thoughts');

/** Default number of thoughts per list page. */
export const THOUGHTS_PER_PAGE = 10;

/** Reading speed for Chinese (chars per minute). */
const READING_SPEED = 200;

/** Build a short plain-text excerpt from the markdown content. */
function buildExcerpt(content: string, maxLen = 150): string {
  const plain = content
    .replace(/^---[\s\S]*?---/, '') // strip frontmatter if any
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // remove image syntax
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // unwrap links
    .replace(/[#>*_`~]/g, '') // remove common markdown markers
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLen) return plain;
  return plain.substring(0, maxLen).trimEnd() + '...';
}

function readingTimeOf(content: string): number {
  return Math.max(1, Math.ceil(content.length / READING_SPEED));
}

function parseSlugFromFilename(fileName: string): string {
  return fileName.replace(/\.md$/, '');
}

/**
 * Read all thought .md files and return them sorted by date (newest first).
 * Each Thought has slug, title, date, content (markdown), tags, excerpt, readingTime.
 */
export function getAllThoughts(): Thought[] {
  if (!fs.existsSync(thoughtsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(thoughtsDirectory);
  const all: Thought[] = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = parseSlugFromFilename(fileName);
      const fullPath = path.join(thoughtsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Normalize date to YYYY-MM-DD; fall back to a far-past date so the
      // thought sinks to the bottom instead of breaking the sort.
      // gray-matter / YAML may parse `date: 2026-02-27` as a Date object
      // instead of a string, so handle both.
      let date: string;
      if (typeof data.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        date = data.date;
      } else if (data.date instanceof Date && !isNaN(data.date.getTime())) {
        date = data.date.toISOString().split('T')[0];
      } else {
        date = '1970-01-01';
      }

      const title = typeof data.title === 'string' && data.title.trim() ? data.title.trim() : undefined;
      const tags = Array.isArray(data.tags)
        ? data.tags.filter((t): t is string => typeof t === 'string' && !t.startsWith('format/'))
        : [];

      return {
        slug,
        title,
        date,
        content,
        tags,
        excerpt: buildExcerpt(content),
        readingTime: readingTimeOf(content),
      };
    });

  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** All thought slugs in date-descending order. */
export function getThoughtSlugs(): string[] {
  return getAllThoughts().map((t) => t.slug);
}

/**
 * Read a single thought by slug, with markdown rendered to HTML.
 * Returns null if the file does not exist or fails to parse.
 */
export async function getThoughtBySlug(slug: string): Promise<Thought | null> {
  try {
    const fullPath = path.join(thoughtsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    let date: string;
    if (typeof data.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      date = data.date;
    } else if (data.date instanceof Date && !isNaN(data.date.getTime())) {
      date = data.date.toISOString().split('T')[0];
    } else {
      date = '1970-01-01';
    }

    const title = typeof data.title === 'string' && data.title.trim() ? data.title.trim() : undefined;
    const tags = Array.isArray(data.tags)
      ? data.tags.filter((t): t is string => typeof t === 'string' && !t.startsWith('format/'))
      : [];

    const processed = await remark()
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);
    const contentHtml = processed.toString();

    return {
      slug,
      title,
      date,
      content,
      contentHtml,
      tags,
      excerpt: buildExcerpt(content),
      readingTime: readingTimeOf(content),
    };
  } catch (error) {
    console.error(`Error reading thought ${slug}:`, error);
    return null;
  }
}

/**
 * Paginate thoughts. `page` is 1-indexed and is clamped to [1, totalPages].
 */
export function getThoughtsPaginated(page: number = 1, perPage: number = THOUGHTS_PER_PAGE): PaginatedThoughts {
  const all = getAllThoughts();
  const totalThoughts = all.length;
  const totalPages = Math.max(1, Math.ceil(totalThoughts / perPage));
  const currentPage = Math.max(1, Math.min(Math.floor(page) || 1, totalPages));
  const start = (currentPage - 1) * perPage;
  const thoughts = all.slice(start, start + perPage);

  return {
    thoughts,
    currentPage,
    totalPages,
    totalThoughts,
    perPage,
  };
}

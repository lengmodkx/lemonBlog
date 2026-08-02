export interface Thought {
  slug: string;
  title?: string;
  date: string;
  /** Raw markdown source. */
  content: string;
  /** Rendered HTML (only populated for single-thought detail page). */
  contentHtml?: string;
  /** Auto-generated plain-text preview, capped at 150 chars. */
  excerpt?: string;
  tags?: string[];
  /** Estimated reading time in minutes (Chinese reading speed). */
  readingTime?: number;
}

export interface PaginatedThoughts {
  thoughts: Thought[];
  currentPage: number;
  totalPages: number;
  totalThoughts: number;
  perPage: number;
}

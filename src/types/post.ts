// Type definitions that can be safely imported by client components

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  author: string;
  tags: string[];
  content?: string;
  excerpt?: string;
  coverImage?: string;
  readingTime?: number;
}
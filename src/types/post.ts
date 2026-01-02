// Type definitions that can be safely imported by client components

export const VALID_CATEGORIES = ['技术学习', '读书笔记', '日常记录'] as const;
export type Category = typeof VALID_CATEGORIES[number];

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  author: string;
  tags: string[];
  category?: Category;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  readingTime?: number;
}
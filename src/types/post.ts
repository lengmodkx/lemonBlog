// Type definitions that can be safely imported by client components

export const VALID_CATEGORIES = ['Tech', 'Reading', 'Life'] as const;
export type Category = typeof VALID_CATEGORIES[number];

export type PostLayout = 'default' | 'review';

export interface ReviewBlock {
  type: 'gallery' | 'video' | 'list' | 'insights';
  layout?: 'full' | 'pair' | 'trio';
  src?: string;
  caption?: string;
  aspectRatio?: string;
  images?: { src: string; alt?: string }[];
  items?: { num?: string; title: string; em?: string; tag?: string }[];
  insights?: { num?: string; lines: string[]; highlights?: number[] }[];
}

export interface ReviewSection {
  title: string;
  em?: string;
  description?: string;
  blocks?: ReviewBlock[];
}

export interface ReviewData {
  hero: {
    number: string;
    unit: string;
    label: string;
    intro: string;
  };
  stats: { number: string; label: string }[];
  sections: ReviewSection[];
}

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
  layout?: PostLayout;
  review?: ReviewData;
}
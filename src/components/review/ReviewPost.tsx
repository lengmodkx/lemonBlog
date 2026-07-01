'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar } from '@phosphor-icons/react';
import type { Post } from '@/types/post';
import GiscusComments from '@/components/GiscusComments';
import ReadingProgress from '@/components/ReadingProgress';
import {
  ReviewHero,
  StatGrid,
  ReviewSection,
  PhotoGrid,
  VideoStage,
  ReadingList,
  InsightList,
} from './';

interface ReviewPostProps {
  post: Post;
}

export default function ReviewPost({ post }: ReviewPostProps) {
  const review = post.review;

  if (!review) return null;

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="min-w-0">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft size={14} weight="bold" />
            Back to posts
          </Link>

          <header className="mb-6">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
              <Calendar size={14} weight="regular" />
              <time dateTime={post.date}>{formattedDate}</time>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-foreground leading-tight tracking-tight">
              {post.title}
            </h1>

            {post.description && (
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                {post.description}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-accent text-xs px-2 py-0.5 rounded-full bg-accent/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <ReviewHero
            number={review.hero.number}
            unit={review.hero.unit}
            label={review.hero.label}
            intro={review.hero.intro}
            period="2026 H1"
          />

          <StatGrid stats={review.stats} />

          {review.sections.map((section, sectionIndex) => (
            <ReviewSection
              key={sectionIndex}
              title={section.title}
              em={section.em}
              description={section.description}
            >
              {section.blocks?.map((block, blockIndex) => {
                if (block.type === 'gallery') {
                  return (
                    <PhotoGrid
                      key={blockIndex}
                      layout={block.layout || 'full'}
                      src={block.src}
                      alt={block.caption}
                      images={block.images}
                      caption={block.caption}
                      aspectRatio={block.aspectRatio}
                      priority={sectionIndex === 0 && blockIndex === 0}
                    />
                  );
                }

                if (block.type === 'video') {
                  return (
                    <VideoStage
                      key={blockIndex}
                      src={block.src || ''}
                      caption={block.caption}
                    />
                  );
                }

                if (block.type === 'list') {
                  return <ReadingList key={blockIndex} items={block.items || []} />;
                }

                if (block.type === 'insights') {
                  return (
                    <InsightList
                      key={blockIndex}
                      insights={block.insights || []}
                    />
                  );
                }

                return null;
              })}
            </ReviewSection>
          ))}

          <footer className="mt-20 pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm text-center">
              Thanks for reading
            </p>
          </footer>

          <GiscusComments />
        </article>
      </div>
    </div>
  );
}

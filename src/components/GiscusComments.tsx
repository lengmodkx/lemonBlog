'use client';

import Giscus from '@giscus/react';
import { useState, useEffect } from 'react';
import { ChatCircle, Info, Spinner } from '@phosphor-icons/react';
import { useIsDarkTheme } from '@/lib/use-theme';

export default function GiscusComments() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const isDark = useIsDarkTheme();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || 'lengmodkx/lemonBlog';
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || '';
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || 'Announcements';
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || '';

  if (!repoId || !categoryId) {
    return (
      <div className="mt-16">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ChatCircle size={20} weight="regular" />
            <span>Comments</span>
          </h3>
        </div>
        <div className="bg-muted rounded-xl p-6 border border-border text-center">
          <p className="text-muted-foreground text-sm">
            Comments are not available. Please configure the Giscus environment variables.
          </p>
        </div>
      </div>
    );
  }

  const themeUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/giscus-${isDark ? 'dark' : 'light'}.css`
      : '';

  return (
    <div className="mt-16">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ChatCircle size={20} weight="regular" />
          <span>Comments</span>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Log in with GitHub to join the discussion
        </p>
      </div>

      <div className="relative bg-card rounded-xl border border-border overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/90 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-3">
              <Spinner size={24} weight="bold" className="animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">Loading comments…</p>
            </div>
          </div>
        )}

        {mounted && (
          <Giscus
            key={themeUrl}
            id="comments"
            repo={repo as `${string}/${string}`}
            repoId={repoId}
            category={category}
            categoryId={categoryId}
            mapping="title"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={themeUrl}
            lang="en"
            loading="lazy"
          />
        )}
      </div>

      <div className="mt-4 flex items-start gap-3 text-sm text-muted-foreground">
        <Info size={18} weight="regular" className="shrink-0 mt-0.5" />
        <p>
          Comments are powered by GitHub Discussions and stored in the{' '}
          <code className="px-1.5 py-0.5 rounded bg-muted text-xs">lengmodkx/lemonBlog</code>{' '}
          repository. Markdown and replies are supported.
        </p>
      </div>
    </div>
  );
}

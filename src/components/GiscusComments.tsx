'use client';

import Giscus from '@giscus/react';
import { useState, useEffect } from 'react';
import { ChatCircle, Info, Spinner } from '@phosphor-icons/react';

export default function GiscusComments() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
            <span>文章评论</span>
          </h3>
        </div>
        <div className="bg-muted rounded-xl p-6 border border-border text-center">
          <p className="text-muted-foreground text-sm">
            评论功能暂不可用，请配置环境变量
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ChatCircle size={20} weight="regular" />
          <span>文章评论</span>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          使用 GitHub 账号登录参与讨论
        </p>
      </div>

      <div className="relative bg-card rounded-xl p-6 shadow-sm border border-border">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-xl z-10">
            <div className="flex flex-col items-center gap-3">
              <Spinner size={24} weight="bold" className="animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">加载评论中...</p>
            </div>
          </div>
        )}

        <Giscus
          id="comments"
          repo={repo as `${string}/${string}`}
          repoId={repoId}
          category={category}
          categoryId={categoryId}
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="zh-CN"
          loading="lazy"
        />
      </div>

      <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
        <div className="flex items-start gap-3">
          <Info size={18} weight="regular" className="text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p>评论基于 GitHub Discussions，数据存储在 <code className="px-1.5 py-0.5 rounded bg-background text-xs">lengmodkx/lemonBlog</code> 仓库</p>
            <p>支持 Markdown 语法，可以回复他人评论</p>
            <p>切换主题时会自动适配评论样式</p>
          </div>
        </div>
      </div>
    </div>
  );
}

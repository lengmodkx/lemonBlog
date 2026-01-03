'use client';

import Giscus from '@giscus/react';
import { useState, useEffect } from 'react';

export default function GiscusComments() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载完成
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-12">
      {/* 标题区域 */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-ink dark:text-text-primary mb-2 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span>文章评论</span>
        </h3>
        <p className="text-sm text-text-muted">
          使用 GitHub 账号登录参与讨论
        </p>
      </div>

      {/* 评论容器 */}
      <div className="relative bg-card dark:bg-card/50 rounded-2xl p-6 shadow-sm border border-lavender-200 dark:border-lavender-800">
        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 dark:bg-card/80 rounded-2xl z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-text-muted">加载评论中...</p>
            </div>
          </div>
        )}

        {/* Giscus 组件 */}
        <Giscus
          id="comments"
          repo={process.env.NEXT_PUBLIC_GISCUS_REPO}
          repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID}
          category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY}
          categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID}
          mapping="title"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="zh-CN"
          loading="lazy"
          className="rounded-xl"
        />
      </div>

      {/* 提示信息 */}
      <div className="mt-4 p-4 bg-lavender-50 dark:bg-lavender-900/20 rounded-xl border border-lavender-200 dark:border-lavender-800">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm text-text-muted space-y-1">
            <p>• 评论基于 GitHub Discussions，数据存储在 <code className="px-1.5 py-0.5 rounded bg-lavender-100 dark:bg-lavender-800 text-xs">lengmodkx/lemonBlog</code> 仓库</p>
            <p>• 支持 Markdown 语法，可以回复他人评论</p>
            <p>• 切换主题时会自动适配评论样式</p>
          </div>
        </div>
      </div>
    </div>
  );
}

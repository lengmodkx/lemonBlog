'use client';

import { VideoCamera } from '@phosphor-icons/react';
import { photoUrl } from '@/lib/photo-url';
import type { TravelVideo } from '@/types/travel';

export interface TripVideosProps {
  videos: TravelVideo[];
}

/** 章节内的航拍视频卡片区（preload=metadata 显示首帧，点击才加载数据） */
export default function TripVideos({ videos }: TripVideosProps) {
  if (videos.length === 0) return null;

  return (
    <section className="mt-6">
      <h4 className="flex items-center gap-1.5 text-sm font-medium text-foreground mb-3">
        <VideoCamera size={16} className="text-accent" />
        航拍视频
        <span className="text-xs font-normal text-muted-foreground">{videos.length} 个</span>
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {videos.map((video) => (
          <figure
            key={video.id}
            className="rounded-xl overflow-hidden border border-border bg-black"
          >
            <video
              src={photoUrl(video.src)}
              controls
              preload="metadata"
              playsInline
              className="w-full aspect-video object-cover"
            />
            <figcaption className="flex items-baseline justify-between gap-2 px-3 py-2 bg-card">
              <span className="text-xs text-foreground truncate">{video.title || video.city}</span>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {video.date}
                {video.size ? ` · ${video.size}` : ''}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

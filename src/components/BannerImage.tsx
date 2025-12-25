'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { imageService, ImageAsset, ImageSource } from '@/lib/images';

interface BannerImageProps {
  tags: string[];
  title: string;
  preferredSource?: ImageSource;
  width?: number;
  height?: number;
  className?: string;
  showAttribution?: boolean;
  customImage?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
}

export default function BannerImage({
  tags,
  title,
  preferredSource = 'unsplash',
  width = 1080,
  height = 400,
  className = '',
  showAttribution = true,
  customImage,
  objectFit = 'cover'
}: BannerImageProps) {
  const [imageAsset, setImageAsset] = useState<ImageAsset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImage();
  }, [tags, title, preferredSource, customImage]);

  const loadImage = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 如果有自定义图片，直接使用
      if (customImage) {
        setImageAsset({
          type: 'photo',
          source: 'custom',
          url: customImage,
          alt: `${title} - Cover image`,
          title: title
        });
        setIsLoading(false);
        return;
      }

      const image = await imageService.getArticleImage(
        tags,
        title,
        preferredSource,
        { width, height }
      );

      if (image) {
        setImageAsset(image);
      } else {
        // 如果没有找到图片，使用占位符
        setImageAsset({
          type: 'photo',
          source: 'placeholder',
          url: imageService.getPlaceholder(width, height, title),
          alt: `${title} - Placeholder image`,
          title: title
        });
      }
    } catch (err) {
      console.error('Error loading banner image:', err);
      setError('Failed to load image');
      setImageAsset({
        type: 'photo',
        source: 'placeholder',
        url: imageService.getPlaceholder(width, height, title),
        alt: `${title} - Placeholder image`,
        title: title
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    // 图片加载失败时，使用占位符
    setImageAsset({
      type: 'photo',
      source: 'placeholder',
      url: imageService.getPlaceholder(width, height, title),
      alt: `${title} - Placeholder image`,
      title: title
    });
    setError('Image failed to load');
  };

  // 处理图片源的回退逻辑
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (retryCount > 0 && retryCount <= 3) {
      const timer = setTimeout(() => {
        loadImage();
      }, 1000 * retryCount); // 指数退避
      return () => clearTimeout(timer);
    }
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div
        className={`relative bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden ${className}`}
        style={{ width, height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 dark:text-gray-500 text-sm">
            Loading image...
          </div>
        </div>
        <div className="animate-pulse absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
      </div>
    );
  }

  if (!imageAsset) {
    return (
      <div
        className={`relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-gray-400 dark:text-gray-500 text-sm text-center">
          No image available
        </div>
      </div>
    );
  }

  // 如果是 GIF，使用嵌入代码
  if (imageAsset.type === 'gif' && imageAsset.embedCode) {
    return (
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        <div dangerouslySetInnerHTML={{ __html: imageAsset.embedCode }} />
        {showAttribution && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            GIF by GIPHY
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div style={{ width, height }} className="relative">
        {imageAsset.source === 'placeholder' ? (
          // 占位符图片，使用原生 img 标签
          <img
            src={imageAsset.url}
            alt={imageAsset.alt}
            title={imageAsset.title}
            className={`w-full h-full object-${objectFit}`}
            onError={handleImageError}
          />
        ) : (
          // 优化的图片，使用 Next.js Image 组件
          <Image
            src={imageAsset.url}
            alt={imageAsset.alt}
            title={imageAsset.title}
            fill
            className={`object-${objectFit}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1080px"
            priority={true}
            onError={handleImageError}
          />
        )}

        {/* 加载错误提示 */}
        {error && (
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              {error}
            </div>
            {retryCount < 3 && (
              <button
                onClick={handleRetry}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors"
              >
                Retry ({3 - retryCount})
              </button>
            )}
          </div>
        )}

        {/* 图片来源 attribution */}
        {showAttribution && imageAsset.source !== 'placeholder' && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            {imageAsset.source === 'unsplash' && (
              <span>
                Photo by {imageAsset.author?.name}
              </span>
            )}
            {imageAsset.source === 'storyset' && (
              <span>
                Illustration by Storyset
              </span>
            )}
            {imageAsset.source === 'giphy' && (
              <span>
                GIF by GIPHY
              </span>
            )}
          </div>
        )}

        {/* 图片类型标签 - 自定义图片不显示 */}
        {imageAsset.source !== 'custom' && (
          <div className="absolute top-2 left-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded backdrop-blur-sm ${
              imageAsset.type === 'photo'
                ? 'bg-blue-500 bg-opacity-80 text-white'
                : imageAsset.type === 'gif'
                ? 'bg-purple-500 bg-opacity-80 text-white'
                : 'bg-green-500 bg-opacity-80 text-white'
            }`}>
              {imageAsset.type === 'photo' && 'Photo'}
              {imageAsset.type === 'gif' && 'GIF'}
              {imageAsset.type === 'illustration' && 'Illustration'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
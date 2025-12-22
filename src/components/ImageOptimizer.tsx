'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ImageOptimizer({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1080px',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: ImageOptimizerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // 生成模糊占位符
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;

    // 生成简单的模糊占位符
    return `data:image/svg+xml;base64,${btoa(
      `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect width="100%" height="100%" fill="#e5e7eb" opacity="0.5"/>
      </svg>`
    )}`;
  };

  // 检查是否是外部图片
  const isExternalImage = src.startsWith('http');

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg">
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Failed to load image
            </p>
          </div>
        </div>
      ) : (
        <>
          {isExternalImage ? (
            // 外部图片使用普通 img 标签
            <img
              src={imageSrc}
              alt={alt}
              width={width}
              height={height}
              className={`w-full h-full object-cover rounded-lg ${className}`}
              onLoad={handleLoad}
              onError={handleError}
              loading={priority ? 'eager' : 'lazy'}
            />
          ) : (
            // 内部图片使用 Next.js Image 组件
            <Image
              src={imageSrc}
              alt={alt}
              width={width || 400}
              height={height || 300}
              className={`w-full h-full object-cover rounded-lg ${className}`}
              sizes={sizes}
              quality={quality}
              priority={priority}
              placeholder={placeholder}
              blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
              onLoad={handleLoad}
              onError={handleError}
              style={{
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}
            />
          )}
        </>
      )}

      {/* 图片状态指示器 */}
      {!priority && (
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
            {isLoading && 'Loading...'}
            {!isLoading && !hasError && '✓'}
            {hasError && '✗'}
          </div>
        </div>
      )}
    </div>
  );
}

// 预定义的图片尺寸配置
export const ImageSizes = {
  banner: {
    width: 1080,
    height: 400,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1080px'
  },
  thumbnail: {
    width: 400,
    height: 300,
    sizes: '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px'
  },
  card: {
    width: 800,
    height: 400,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px'
  },
  avatar: {
    width: 64,
    height: 64,
    sizes: '64px'
  }
};
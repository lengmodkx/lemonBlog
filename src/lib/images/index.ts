// 图片服务统一入口
// 整合 Unsplash、GIPHY 和 Storyset 图片服务

import { unsplashService, type UnsplashPhoto } from './unsplash';
import { giphyService, type GiphyGif } from './giphy';
import { storysetService, type StorysetIllustration } from './storyset';

export type ImageSource = 'unsplash' | 'giphy' | 'storyset' | 'placeholder';

export interface ImageAsset {
  type: 'photo' | 'gif' | 'illustration';
  source: ImageSource;
  url: string;
  alt: string;
  title?: string;
  author?: {
    name: string;
    url: string;
  };
  embedCode?: string;
}

export interface ImageOptions {
  width?: number;
  height?: number;
  format?: string;
  color?: string;
  mode?: 'light' | 'dark' | 'colored';
}

class ImageService {
  private cache = new Map<string, ImageAsset>();

  /**
   * 根据文章内容和标签获取最合适的图片
   */
  async getArticleImage(
    tags: string[],
    title: string,
    preferredSource: ImageSource = 'unsplash',
    options: ImageOptions = {}
  ): Promise<ImageAsset | null> {
    const cacheKey = `${tags.join(',')}-${title}-${preferredSource}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let imageAsset: ImageAsset | null = null;

    try {
      switch (preferredSource) {
        case 'unsplash':
          imageAsset = await this.getUnsplashImage(tags, title, options);
          break;
        case 'giphy':
          imageAsset = await this.getGiphyImage(tags, title);
          break;
        case 'storyset':
          imageAsset = await this.getStorysetImage(tags, title, options);
          break;
      }

      if (imageAsset) {
        this.cache.set(cacheKey, imageAsset);
      }

      return imageAsset;
    } catch (error) {
      console.error('Error getting article image:', error);
      return null;
    }
  }

  /**
   * 获取 Unsplash 图片
   */
  private async getUnsplashImage(
    tags: string[],
    title: string,
    options: ImageOptions
  ): Promise<ImageAsset | null> {
    const photo = await unsplashService.getPhotoForTags(tags);

    if (!photo) {
      return null;
    }

    const { width = 1080, height } = options;
    const optimizedUrl = unsplashService.getOptimizedUrl(photo, width, height);

    return {
      type: 'photo',
      source: 'unsplash',
      url: optimizedUrl,
      alt: photo.alt_description || `${title} - Photo by ${photo.user.name}`,
      title: photo.description || title,
      author: {
        name: photo.user.name,
        url: `https://unsplash.com/@${photo.user.username}`
      }
    };
  }

  /**
   * 获取 GIPHY 图片
   */
  private async getGiphyImage(
    tags: string[],
    title: string
  ): Promise<ImageAsset | null> {
    const gif = await giphyService.getGifForTags(tags);

    if (!gif) {
      return null;
    }

    const embedCode = giphyService.getEmbedCode(gif);
    const optimizedUrl = giphyService.getOptimizedUrl(gif);

    return {
      type: 'gif',
      source: 'giphy',
      url: optimizedUrl,
      alt: `${title} - GIF from GIPHY`,
      title: gif.title || title,
      embedCode
    };
  }

  /**
   * 获取 Storyset 插画
   */
  private async getStorysetImage(
    tags: string[],
    title: string,
    options: ImageOptions
  ): Promise<ImageAsset | null> {
    const illustration = storysetService.getIllustrationForTags(tags, options);

    if (!illustration) {
      return null;
    }

    const { width = 400, height = 300 } = options;
    const embedCode = storysetService.generateEmbedCode(illustration, width, height);

    return {
      type: 'illustration',
      source: 'storyset',
      url: illustration.url,
      alt: `${title} - Illustration by Storyset`,
      title: illustration.title,
      embedCode
    };
  }

  /**
   * 搜索图片
   */
  async searchImages(
    query: string,
    source: ImageSource = 'unsplash',
    limit: number = 10
  ): Promise<ImageAsset[]> {
    try {
      switch (source) {
        case 'unsplash':
          const photos = await unsplashService.searchPhotos(query, 1, 'landscape');
          return photos.slice(0, limit).map(photo => ({
            type: 'photo' as const,
            source: 'unsplash' as const,
            url: photo.urls.regular,
            alt: photo.alt_description || query,
            title: photo.description,
            author: {
              name: photo.user.name,
              url: `https://unsplash.com/@${photo.user.username}`
            }
          }));

        case 'giphy':
          const gifs = await giphyService.searchGifs(query, limit);
          return gifs.map(gif => ({
            type: 'gif' as const,
            source: 'giphy' as const,
            url: gif.images.original.url,
            alt: `${query} - GIF`,
            title: gif.title,
            embedCode: giphyService.getEmbedCode(gif)
          }));

        case 'storyset':
          // Storyset 主要通过 URL 搜索，返回相关插画
          const illustration = storysetService.getIllustrationForTags([query]);
          return illustration ? [{
            type: 'illustration' as const,
            source: 'storyset' as const,
            url: illustration.url,
            alt: `${query} - Illustration`,
            title: illustration.title,
            embedCode: storysetService.generateEmbedCode(illustration)
          }] : [];

        default:
          return [];
      }
    } catch (error) {
      console.error('Error searching images:', error);
      return [];
    }
  }

  /**
   * 获取随机图片
   */
  async getRandomImage(
    query: string = 'technology',
    source: ImageSource = 'unsplash',
    options: ImageOptions = {}
  ): Promise<ImageAsset | null> {
    try {
      switch (source) {
        case 'unsplash':
          const photo = await unsplashService.getRandomPhoto(query, 'landscape');
          if (photo) {
            const { width = 1080, height } = options;
            const optimizedUrl = unsplashService.getOptimizedUrl(photo, width, height);
            return {
              type: 'photo',
              source: 'unsplash',
              url: optimizedUrl,
              alt: photo.alt_description || query,
              title: photo.description,
              author: {
                name: photo.user.name,
                url: `https://unsplash.com/@${photo.user.username}`
              }
            };
          }
          break;

        case 'giphy':
          const gif = await giphyService.getRandomGif(query);
          if (gif) {
            return {
              type: 'gif',
              source: 'giphy',
              url: giphyService.getOptimizedUrl(gif),
              alt: `${query} - Random GIF`,
              title: gif.title,
              embedCode: giphyService.getEmbedCode(gif)
            };
          }
          break;

        case 'storyset':
          const illustration = storysetService.getIllustrationForTags([query], options);
          if (illustration) {
            const { width = 400, height = 300 } = options;
            return {
              type: 'illustration',
              source: 'storyset',
              url: illustration.url,
              alt: `${query} - Random Illustration`,
              title: illustration.title,
              embedCode: storysetService.generateEmbedCode(illustration, width, height)
            };
          }
          break;
      }
    } catch (error) {
      console.error('Error getting random image:', error);
    }

    return null;
  }

  /**
   * 获取图片占位符
   */
  getPlaceholder(width: number = 800, height: number = 400, text: string = 'Image'): string {
    return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodeURIComponent(text)}`;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const imageService = new ImageService();
export { UnsplashPhoto, GiphyGif, StorysetIllustration };
export { unsplashService, giphyService, storysetService };
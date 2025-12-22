// Unsplash API 集成
// 获取高质量免费图片

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  description?: string;
  alt_description?: string;
  user: {
    name: string;
    username: string;
  };
}

interface UnsplashConfig {
  clientId?: string;
  baseUrl: string;
  perPage: number;
}

class UnsplashService {
  private config: UnsplashConfig;

  constructor() {
    // 使用演示密钥，生产环境需要申请自己的 Access Key
    this.config = {
      clientId: process.env.UNSPLASH_ACCESS_KEY || 'demo',
      baseUrl: 'https://api.unsplash.com',
      perPage: 30
    };
  }

  /**
   * 根据关键词搜索图片
   * @param query 搜索关键词
   * @param page 页码，默认为1
   * @param orientation 图片方向 (landscape, portrait, squarish)
   */
  async searchPhotos(
    query: string,
    page: number = 1,
    orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
  ): Promise<UnsplashPhoto[]> {
    if (this.config.clientId === 'demo') {
      // 返回一些预设的示例图片URL
      return this.getPlaceholderImages(query, orientation);
    }

    try {
      const params = new URLSearchParams({
        query,
        page: page.toString(),
        per_page: this.config.perPage.toString(),
        orientation,
        content_filter: 'high', // 只显示安全内容
      });

      const response = await fetch(
        `${this.config.baseUrl}/search/photos?${params}`,
        {
          headers: {
            'Authorization': `Client-ID ${this.config.clientId}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Unsplash API error:', error);
      return this.getPlaceholderImages(query, orientation);
    }
  }

  /**
   * 获取随机图片
   * @param query 搜索关键词
   * @param orientation 图片方向
   */
  async getRandomPhoto(
    query: string = 'technology',
    orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'
  ): Promise<UnsplashPhoto | null> {
    if (this.config.clientId === 'demo') {
      const placeholders = this.getPlaceholderImages(query, orientation);
      return placeholders[Math.floor(Math.random() * placeholders.length)];
    }

    try {
      const params = new URLSearchParams({
        query,
        orientation,
        content_filter: 'high',
      });

      const response = await fetch(
        `${this.config.baseUrl}/photos/random?${params}`,
        {
          headers: {
            'Authorization': `Client-ID ${this.config.clientId}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Unsplash random photo error:', error);
      const placeholders = this.getPlaceholderImages(query, orientation);
      return placeholders[Math.floor(Math.random() * placeholders.length)];
    }
  }

  /**
   * 获取占位图片（当API不可用时）
   */
  private getPlaceholderImages(
    query: string,
    orientation: 'landscape' | 'portrait' | 'squarish'
  ): UnsplashPhoto[] {
    // 根据关键词返回相关的示例图片
    const baseImages = {
      'technology': [
        'https://images.unsplash.com/photo-1518770660439-4636190af475',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
      ],
      'programming': [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
        'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb'
      ],
      'web': [
        'https://images.unsplash.com/photo-1507238691748-69788ddc46f5',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3'
      ],
      'default': [
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
        'https://images.unsplash.com/photo-1618477248223-acd07c46a640',
        'https://images.unsplash.com/photo-1593720213428-dea7ef758074'
      ]
    };

    const category = Object.keys(baseImages).find(key =>
      query.toLowerCase().includes(key.toLowerCase())
    ) || 'default';

    const images = baseImages[category as keyof typeof baseImages];

    return images.map((url, index) => ({
      id: `placeholder-${index}`,
      urls: {
        regular: `${url}?w=1080&fit=crop`,
        small: `${url}?w=400&fit=crop`,
        thumb: `${url}?w=200&fit=crop`
      },
      description: `${query} related image ${index + 1}`,
      alt_description: `${query} image from Unsplash`,
      user: {
        name: 'Unsplash Photographer',
        username: 'unsplash'
      }
    }));
  }

  /**
   * 根据文章标签获取相关图片
   */
  async getPhotoForTags(tags: string[]): Promise<UnsplashPhoto | null> {
    // 技术相关关键词映射
    const tagToQuery: Record<string, string> = {
      'react': 'react programming',
      'javascript': 'javascript code',
      'typescript': 'typescript programming',
      'web': 'web development',
      'frontend': 'frontend development',
      'backend': 'backend programming',
      'database': 'database server',
      'api': 'api development',
      'security': 'cybersecurity',
      'performance': 'performance optimization',
      'design': 'web design',
      'tutorial': 'programming tutorial',
      'css': 'css styling',
      'html': 'html development'
    };

    for (const tag of tags) {
      const query = tagToQuery[tag.toLowerCase()] || tag;
      const photo = await this.getRandomPhoto(query);
      if (photo) {
        return photo;
      }
    }

    // 如果没有找到匹配的，返回默认图片
    return await this.getRandomPhoto('technology');
  }

  /**
   * 获取图片的优化URL
   */
  getOptimizedUrl(
    photo: UnsplashPhoto,
    width: number = 1080,
    height?: number,
    format: 'jpg' | 'webp' = 'webp'
  ): string {
    const baseUrl = photo.urls.regular.split('?')[0];
    const params = new URLSearchParams({
      w: width.toString(),
      fm: format,
      q: '80',
      auto: 'format'
    });

    if (height) {
      params.set('h', height.toString());
      params.set('fit', 'crop');
    }

    return `${baseUrl}?${params.toString()}`;
  }
}

export const unsplashService = new UnsplashService();
export type { UnsplashPhoto };
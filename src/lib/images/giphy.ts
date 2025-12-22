// GIPHY API 集成
// 获取动态GIF图片

interface GiphyGif {
  id: string;
  title: string;
  images: {
    original: {
      url: string;
      width: string;
      height: string;
      size: string;
    };
    downsized_medium: {
      url: string;
      width: string;
      height: string;
      size: string;
    };
    fixed_height: {
      url: string;
      width: string;
      height: string;
      size: string;
    };
  };
  embed_url: string;
  url: string;
}

interface GiphyConfig {
  apiKey?: string;
  baseUrl: string;
  limit: number;
  rating: 'g' | 'pg' | 'pg-13' | 'r';
}

class GiphyService {
  private config: GiphyConfig;

  constructor() {
    // 使用演示密钥，生产环境需要申请自己的 API Key
    this.config = {
      apiKey: process.env.GIPHY_API_KEY || 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65',
      baseUrl: 'https://api.giphy.com/v1/gifs',
      limit: 25,
      rating: 'g' // 只显示适合工作环境的内容
    };
  }

  /**
   * 根据关键词搜索GIF
   * @param query 搜索关键词
   * @param limit 返回数量限制
   * @param offset 偏移量
   */
  async searchGifs(
    query: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<GiphyGif[]> {
    try {
      const params = new URLSearchParams({
        api_key: this.config.apiKey!,
        q: query,
        limit: Math.min(limit, this.config.limit).toString(),
        offset: offset.toString(),
        rating: this.config.rating,
        lang: 'en'
      });

      const response = await fetch(
        `${this.config.baseUrl}/search?${params}`
      );

      if (!response.ok) {
        throw new Error(`Giphy API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Giphy API error:', error);
      return this.getPlaceholderGifs(query);
    }
  }

  /**
   * 获取随机GIF
   * @param tag 标签
   */
  async getRandomGif(tag: string = 'programming'): Promise<GiphyGif | null> {
    try {
      const params = new URLSearchParams({
        api_key: this.config.apiKey!,
        tag,
        rating: this.config.rating
      });

      const response = await fetch(
        `${this.config.baseUrl}/random?${params}`
      );

      if (!response.ok) {
        throw new Error(`Giphy API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Giphy random GIF error:', error);
      const placeholders = this.getPlaceholderGifs(tag);
      return placeholders.length > 0 ? placeholders[0] : null;
    }
  }

  /**
   * 获取趋势GIF
   */
  async getTrendingGifs(limit: number = 10): Promise<GiphyGif[]> {
    try {
      const params = new URLSearchParams({
        api_key: this.config.apiKey!,
        limit: Math.min(limit, this.config.limit).toString(),
        rating: this.config.rating
      });

      const response = await fetch(
        `${this.config.baseUrl}/trending?${params}`
      );

      if (!response.ok) {
        throw new Error(`Giphy API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Giphy trending GIFs error:', error);
      return this.getPlaceholderGifs('trending');
    }
  }

  /**
   * 获取占位GIF（当API不可用时）
   */
  private getPlaceholderGifs(query: string): GiphyGif[] {
    // 返回一些预设的示例GIF URL
    const placeholderGifs = [
      {
        id: 'placeholder-1',
        title: `${query} related GIF`,
        images: {
          original: {
            url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
            width: '480',
            height: '270',
            size: '503207'
          },
          downsized_medium: {
            url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif',
            width: '400',
            height: '225',
            size: '503207'
          },
          fixed_height: {
            url: 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/200.gif',
            width: '358',
            height: '200',
            size: '97234'
          }
        },
        embed_url: 'https://giphy.com/embed/3oKIPnAiaMCws8nOsE',
        url: 'https://giphy.com/gifs/computer-code-3oKIPnAiaMCws8nOsE'
      },
      {
        id: 'placeholder-2',
        title: 'Programming GIF',
        images: {
          original: {
            url: 'https://media.giphy.com/media/L1R1tvI9svkIWwpVYr/giphy.gif',
            width: '480',
            height: '270',
            size: '1436131'
          },
          downsized_medium: {
            url: 'https://media.giphy.com/media/L1R1tvI9svkIWwpVYr/giphy.gif',
            width: '400',
            height: '225',
            size: '1436131'
          },
          fixed_height: {
            url: 'https://media.giphy.com/media/L1R1tvI9svkIWwpVYr/200.gif',
            width: '358',
            height: '200',
            size: '278047'
          }
        },
        embed_url: 'https://giphy.com/embed/L1R1tvI9svkIWwpVYr',
        url: 'https://giphy.com/gifs/react-javascript-programming-L1R1tvI9svkIWwpVYr'
      }
    ];

    return placeholderGifs;
  }

  /**
   * 根据文章标签获取相关GIF
   */
  async getGifForTags(tags: string[]): Promise<GiphyGif | null> {
    // 技术相关关键词映射
    const tagToQuery: Record<string, string> = {
      'react': 'react programming',
      'javascript': 'javascript coding',
      'typescript': 'typescript',
      'web': 'web development',
      'frontend': 'frontend developer',
      'backend': 'backend programming',
      'database': 'database',
      'api': 'api',
      'security': 'cybersecurity',
      'performance': 'performance',
      'design': 'web design',
      'tutorial': 'programming tutorial',
      'success': 'success celebration',
      'error': 'error bug',
      'loading': 'loading wait'
    };

    for (const tag of tags) {
      const query = tagToQuery[tag.toLowerCase()] || tag;
      const gif = await this.getRandomGif(query);
      if (gif) {
        return gif;
      }
    }

    // 如果没有找到匹配的，返回默认GIF
    return await this.getRandomGif('programming');
  }

  /**
   * 获取GIF的优化URL
   */
  getOptimizedUrl(
    gif: GiphyGif,
    width?: number,
    height?: number
  ): string {
    if (width && height) {
      return gif.images.fixed_height.url; // GIPHY的固定高度版本已经优化过
    } else if (width && width <= 400) {
      return gif.images.downsized_medium.url;
    } else {
      return gif.images.original.url;
    }
  }

  /**
   * 获取GIF的嵌入代码
   */
  getEmbedCode(gif: GiphyGif, width: number = 400, height?: number): string {
    const src = this.getOptimizedUrl(gif, width, height);
    return `<iframe src="${gif.embed_url}" width="${width}" ${height ? `height="${height}"` : ''} frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`;
  }
}

export const giphyService = new GiphyService();
export type { GiphyGif };